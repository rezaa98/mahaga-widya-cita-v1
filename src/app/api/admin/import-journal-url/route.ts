import { NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { requireAdminAuth } from "@/utils/adminAuth";
import { isIP } from "node:net";
import { lookup } from "node:dns/promises";

const MAX_IMPORT_BYTES = 2 * 1024 * 1024;
const BLOCKED_HOSTS = new Set(["localhost", "metadata.google.internal"]);

function isPrivateAddress(address: string) {
  if (isIP(address) === 4) {
    const [a, b] = address.split(".").map(Number);
    return (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      a >= 224
    );
  }
  const normalized = address.toLowerCase();
  if (normalized.startsWith("::ffff:")) return isPrivateAddress(normalized.slice(7));
  return (
    normalized === "::1" ||
    normalized === "::" ||
    normalized.startsWith("fc") ||
    normalized.startsWith("fd") ||
    normalized.startsWith("fe80:") ||
    normalized.startsWith("ff")
  );
}

async function assertSafeImportUrl(value: string) {
  const parsed = new URL(value);
  if (parsed.protocol !== "https:" || parsed.username || parsed.password || parsed.port) {
    throw new Error("URL jurnal harus menggunakan HTTPS tanpa kredensial atau port khusus.");
  }
  if (BLOCKED_HOSTS.has(parsed.hostname.toLowerCase())) throw new Error("Host URL jurnal tidak diizinkan.");
  const addresses = await lookup(parsed.hostname, { all: true, verbatim: true });
  if (!addresses.length || addresses.some(({ address }) => isPrivateAddress(address))) {
    throw new Error("URL jurnal tidak boleh mengarah ke jaringan privat atau internal.");
  }
  return parsed;
}

async function fetchJournalPage(initialUrl: string) {
  let current = await assertSafeImportUrl(initialUrl);
  for (let redirect = 0; redirect <= 3; redirect += 1) {
    const response = await fetch(current, {
      headers: { "User-Agent": "MahagaWidyaCita-JournalImporter/1.0" },
      redirect: "manual",
      signal: AbortSignal.timeout(10_000),
    });
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location || redirect === 3) throw new Error("Redirect URL jurnal tidak valid atau terlalu banyak.");
      current = await assertSafeImportUrl(new URL(location, current).toString());
      continue;
    }
    if (!response.ok) throw new Error(`Gagal mengakses URL jurnal (Status: ${response.status}).`);
    const declaredSize = Number(response.headers.get("content-length") || 0);
    if (declaredSize > MAX_IMPORT_BYTES) throw new Error("Halaman jurnal melebihi batas ukuran 2 MB.");
    const bytes = await response.arrayBuffer();
    if (bytes.byteLength > MAX_IMPORT_BYTES) throw new Error("Halaman jurnal melebihi batas ukuran 2 MB.");
    return new TextDecoder().decode(bytes);
  }
  throw new Error("URL jurnal tidak dapat diakses.");
}

function toLexical(text: string) {
  return {
    root: {
      children: [
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: "normal",
              style: "",
              text: text || "",
              type: "text",
              version: 1,
            },
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "paragraph",
          version: 1,
        },
      ],
      direction: "ltr",
      format: "",
      indent: 0,
      type: "root",
      version: 1,
    },
  };
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(req: Request) {
  const authError = await requireAdminAuth(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL tidak valid. Masukkan URL jurnal OJS resmi." }, { status: 400 });
    }

    const html = await fetchJournalPage(url);

    // Helper to extract meta tag contents
    const getMeta = (name: string): string[] => {
      const regex = new RegExp(`<meta\\s+name=["']${name}["']\\s+content=["'](.*?)["']`, "gi");
      const matches: string[] = [];
      let match;
      while ((match = regex.exec(html)) !== null) {
        if (match[1]) matches.push(match[1].trim());
      }
      return matches;
    };

    const titles = getMeta("citation_title");
    const title = titles[0] || "";

    if (!title) {
      return NextResponse.json(
        { error: "Tidak dapat menemukan judul artikel pada halaman OJS tersebut." },
        { status: 400 },
      );
    }

    const authorNames = getMeta("citation_author");
    const authorInsts = getMeta("citation_author_institution");
    const authors = authorNames.map((name, i) => ({
      name,
      affiliation: authorInsts[i] || "",
    }));

    const dates = getMeta("citation_publication_date");
    const pubDateStr = dates[0] || new Date().toISOString();
    const pubYear = pubDateStr ? new Date(pubDateStr).getFullYear() : new Date().getFullYear();

    const volumes = getMeta("citation_volume");
    const issues = getMeta("citation_issue");
    const firstPages = getMeta("citation_firstpage");
    const lastPages = getMeta("citation_lastpage");
    const mois = getMeta("citation_doi");
    const keywordsList = getMeta("citation_keywords");
    const pdfUrls = getMeta("citation_pdf_url");

    const volume = volumes[0] || "";
    const issue = issues[0] || "";
    const pages = firstPages[0] && lastPages[0] ? `${firstPages[0]}-${lastPages[0]}` : firstPages[0] || "";
    const doi = mois[0] || "";
    const externalPdfUrl = pdfUrls[0] || url;

    // Extract Abstract from OJS HTML content if present
    let abstractText = "";
    const abstractMatch =
      html.match(/<section\s+class=["']item\s+abstract["']>([\s\S]*?)<\/section>/i) ||
      html.match(/<div\s+class=["']item\s+abstract["']>([\s\S]*?)<\/div>/i) ||
      html.match(/<h2[^>]*>Abstract<\/h2>([\s\S]*?)(?:<h2|<div class=["']item)/i);

    if (abstractMatch && abstractMatch[1]) {
      abstractText = abstractMatch[1]
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }

    if (!abstractText) {
      const ogDesc = html.match(/<meta\s+property=["']og:description["']\s+content=["'](.*?)["']/i);
      abstractText = ogDesc ? ogDesc[1] : title;
    }

    const payload = await getPayload({ config: configPromise });

    // Find default categories and media
    const categories = await payload.find({ collection: "categories", limit: 1 });
    const defaultCategory = categories.docs[0]?.id;

    const coverMedia = await payload.find({
      collection: "media",
      where: { or: [{ filename: { contains: "wiga" } }, { alt: { contains: "WIGA" } }] },
      limit: 1,
    });

    const pdfMedia = await payload.find({
      collection: "media",
      where: { or: [{ filename: { contains: "dummy-journal" } }, { alt: { contains: "PDF" } }] },
      limit: 1,
    });

    const coverId = coverMedia.docs[0]?.id;
    const pdfId = pdfMedia.docs[0]?.id;

    const slug = slugify(title);

    // Check if journal already exists by DOI or slug
    const existing = await payload.find({
      collection: "journals",
      where: doi ? { doi: { equals: doi } } : { slug: { equals: slug } },
      overrideAccess: true,
    });

    const journalData: any = {
      title,
      slug,
      status: "published",
      publishedAt: new Date(pubDateStr).toISOString(),
      publicationYear: pubYear || new Date().getFullYear(),
      volume,
      issue,
      pages,
      doi,
      externalUrl: externalPdfUrl,
      language: "en",
      authors: authors.length > 0 ? authors : [{ name: "Mahaga Widya Cita" }],
      keywords: keywordsList.map((k) => ({ keyword: k })),
      category: defaultCategory,
      coverImage: coverId,
      document: pdfId,
      abstract: toLexical(abstractText),
      content: toLexical(abstractText),
      meta: {
        title: `${title} | Mahaga Widya Cita`,
        description: abstractText.slice(0, 160),
      },
    };

    let doc;
    if (existing.docs.length > 0) {
      console.log("[ImportJournal] Updating existing journal:", existing.docs[0].id);
      doc = await payload.update({
        collection: "journals",
        id: existing.docs[0].id,
        data: journalData,
        overrideAccess: true,
      });
    } else {
      console.log("[ImportJournal] Creating new journal:", title);
      doc = await payload.create({
        collection: "journals",
        data: journalData,
        overrideAccess: true,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Jurnal berhasil diimpor dari URL OJS!",
      doc: {
        id: doc.id,
        title: doc.title,
        slug: doc.slug,
        doi: doc.doi,
      },
    });
  } catch (err: any) {
    console.error("[ImportJournal] API Error:", err);
    return NextResponse.json(
      { error: err.message || "Terjadi kesalahan saat mengimpor jurnal dari URL." },
      { status: 500 },
    );
  }
}
