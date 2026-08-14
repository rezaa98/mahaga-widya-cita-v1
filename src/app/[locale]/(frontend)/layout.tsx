import type { Metadata } from "next";
import "../../globals.css";
import { SITE_URL } from "@/utils/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  const description = isEn
    ? "Integrated consulting, research, technology, and human resource development solutions for sustainable organizational growth."
    : "Solusi konsultasi, riset, teknologi, dan pengembangan sumber daya manusia yang terintegrasi untuk pertumbuhan organisasi berkelanjutan.";

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: isEn
        ? "PT Mahaga Widya Cita — Integrated Consulting Partner"
        : "PT Mahaga Widya Cita — Mitra Konsultasi Terintegrasi",
      template: "%s | PT Mahaga Widya Cita",
    },
    description,
    keywords: [
      "Mahaga Widya Cita",
      "konsultasi tata kelola",
      "webinar ASN",
      "sertifikasi digital",
      "Smart Discussion Series",
      "edukasi pemerintah",
      "kursus online ASN",
    ],
    authors: [{ name: "PT Mahaga Widya Cita" }],
    creator: "PT Mahaga Widya Cita",
    openGraph: {
      type: "website",
      locale: isEn ? "en_US" : "id_ID",
      url: `/${locale}`,
      siteName: "PT Mahaga Widya Cita",
      description,
      images: [{ url: "/opengraph-image.jpg", width: 1200, height: 630, alt: "PT Mahaga Widya Cita" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "PT Mahaga Widya Cita",
      description,
      images: ["/opengraph-image.jpg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png" },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const organizationSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.mahagawidyacita.com/#organization",
        name: "PT Mahaga Widya Cita",
        url: "https://www.mahagawidyacita.com",
        logo: "https://www.mahagawidyacita.com/logo-transparent.png",
      },
      {
        "@type": "WebSite",
        "@id": "https://www.mahagawidyacita.com/#website",
        name: "PT Mahaga Widya Cita",
        url: "https://www.mahagawidyacita.com",
        publisher: { "@id": "https://www.mahagawidyacita.com/#organization" },
        inLanguage: locale === "en" ? "en-US" : "id-ID",
      },
    ],
  };
  return (
    <html lang={locale}>
      <body id="frontend-app">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        {children}
      </body>
    </html>
  );
}
