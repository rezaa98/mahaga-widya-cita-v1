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
    },
    twitter: {
      card: "summary_large_image",
      title: "PT Mahaga Widya Cita",
      description: "Platform edukasi dan tata kelola profesional untuk ASN Indonesia.",
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
  return (
    <html lang={locale}>
      <body id="frontend-app">{children}</body>
    </html>
  );
}
