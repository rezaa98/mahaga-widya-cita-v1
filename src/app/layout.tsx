import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://mahagawidyacita.co.id"),
  title: {
    default: "PT Mahaga Widya Cita — Platform Edukasi & Tata Kelola Profesional",
    template: "%s | PT Mahaga Widya Cita",
  },
  description:
    "PT Mahaga Widya Cita adalah platform terdepan yang menyediakan layanan konsultasi tata kelola, edukasi profesional, webinar, dan sertifikasi digital untuk ASN dan profesional Indonesia.",
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
    locale: "id_ID",
    url: "https://mahagawidyacita.co.id",
    siteName: "PT Mahaga Widya Cita",
    title: "PT Mahaga Widya Cita — Platform Edukasi & Tata Kelola Profesional",
    description:
      "Platform terdepan untuk edukasi profesional, konsultasi tata kelola, dan sertifikasi digital bagi ASN dan profesional Indonesia.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PT Mahaga Widya Cita",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PT Mahaga Widya Cita",
    description: "Platform edukasi dan tata kelola profesional untuk ASN Indonesia.",
    images: ["/og-image.jpg"],
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
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
