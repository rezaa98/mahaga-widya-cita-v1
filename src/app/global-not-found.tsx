import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/utils/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Page Not Found | PT Mahaga Widya Cita",
  robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="id">
      <body
        style={{
          minHeight: "100vh",
          margin: 0,
          display: "grid",
          placeItems: "center",
          padding: "24px",
          color: "#102754",
          background: "linear-gradient(135deg, #f8fafc, #eaf1ff)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <main style={{ maxWidth: 560, textAlign: "center" }}>
          <p style={{ margin: 0, color: "#1d63d8", fontWeight: 800 }}>404</p>
          <h1 style={{ margin: "12px 0", fontSize: "clamp(2rem, 7vw, 3.5rem)" }}>Halaman tidak ditemukan</h1>
          <p style={{ color: "#526581", lineHeight: 1.7 }}>
            Alamat yang Anda buka tidak tersedia atau telah dipindahkan. Kembali ke halaman utama untuk melanjutkan.
          </p>
          <Link
            href="/id"
            style={{
              display: "inline-block",
              marginTop: 16,
              padding: "12px 22px",
              borderRadius: 999,
              color: "white",
              background: "#1458c8",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Kembali ke beranda
          </Link>
        </main>
      </body>
    </html>
  );
}
