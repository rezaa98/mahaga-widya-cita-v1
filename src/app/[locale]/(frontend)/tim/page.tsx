import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import Link from "next/link";
import { Globe, BookOpen } from "lucide-react";

import { IconLinkedin } from "@/components/icons/SocialIcons";
import { WaveDivider } from "@/components/ui/WaveDivider";
import TeamMemberCard from "@/components/ui/TeamMemberCard";
import { getPayload } from "payload";
import configPromise from "@payload-config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tim & Manajemen",
  description:
    "Kenali para pakar dan manajemen PT Mahaga Widya Cita yang berpengalaman di bidang administrasi publik, tata kelola, dan teknologi.",
};

export default async function TimPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEn = locale === "en";
  const payload = await getPayload({ config: configPromise });
  const result = await payload.find({
    collection: "team-members",
    limit: 100,
    sort: "order",
    locale: locale as any,
  });

  const team = result.docs;
  const management = team.filter((member) => member.category === "management");
  const experts = team.filter((member) => member.category === "expert");

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section
        style={{
          background: "linear-gradient(135deg, var(--color-primary-900), var(--color-primary-700))",
          paddingTop: "calc(72px + 4rem)",
          paddingBottom: "4rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at 70% 50%, rgba(30,111,217,0.3) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />
        <div className="container" style={{ position: "relative" }}>
          <span
            className="badge"
            style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.9)", marginBottom: "1rem" }}
          >
            {isEn ? "Team & Management" : "Tim & Manajemen"}
          </span>
          <h1 className="text-display" style={{ color: "white", marginBottom: "1.25rem", maxWidth: "640px" }}>
            {isEn ? "Guided by Indonesia's" : "Dipandu oleh Para"}
            <br />
            <span style={{ color: "var(--color-gold-300)" }}>{isEn ? "Top Experts" : "Pakar Terbaik Indonesia"}</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "1.125rem", maxWidth: "500px" }}>
            {isEn
              ? "We are proud to have a team consisting of leading academics, experienced bureaucrats, and technology practitioners."
              : "Kami bangga memiliki tim yang terdiri dari akademisi, birokrat berpengalaman, dan praktisi teknologi terkemuka."}
          </p>
        </div>
        <WaveDivider fill="white" />
      </section>

      {/* MANAGEMENT */}
      <section className="section" id="manajemen">
        <div className="container">
          <div className="section-title">
            <span className="overline">{isEn ? "Leadership" : "Pimpinan"}</span>
            <h2>{isEn ? "Company Management" : "Manajemen Perusahaan"}</h2>
            <div className="gold-divider" />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "2rem" }}>
            {management.map((m) => (
              <div key={m.id} style={{ width: "100%", maxWidth: "320px", flexGrow: 1 }}>
                <TeamMemberCard member={m} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERTS */}
      <section className="section" style={{ background: "var(--color-neutral-50)" }} id="ahli">
        <div className="container">
          <div className="section-title text-center" style={{ alignItems: "center" }}>
            <span className="overline">{isEn ? "Expert Network" : "Jejaring Kepakaran"}</span>
            <h2>{isEn ? "Experts & Facilitators" : "Tenaga Ahli & Fasilitator"}</h2>
            <div className="gold-divider" />
            <p style={{ color: "var(--color-neutral-600)", maxWidth: "600px", margin: "1rem auto 0" }}>
              {isEn
                ? "Hundreds of our programs are supported by the best practitioners and academics from various leading institutions and universities in Indonesia."
                : "Ratusan program kami didukung oleh para praktisi dan akademisi terbaik dari berbagai institusi dan perguruan tinggi terkemuka di Indonesia."}
            </p>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "2rem" }}>
            {experts.map((expert) => (
              <div key={expert.id} style={{ width: "100%", maxWidth: "320px", flexGrow: 1 }}>
                <TeamMemberCard member={expert} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JOIN CTA */}
      <section
        style={{
          background: "linear-gradient(135deg, var(--color-primary-900), var(--color-primary-700))",
          padding: "4.5rem 0",
        }}
      >
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={{ color: "white", marginBottom: "1rem" }}>
            {isEn ? "Join Our Expert Team" : "Bergabung Bersama Tim Pakar Kami"}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.75)", marginBottom: "2rem", fontSize: "1.0625rem" }}>
            {isEn
              ? "We are always open for the best academics and practitioners to collaborate."
              : "Kami selalu membuka kesempatan bagi akademisi dan praktisi terbaik untuk berkolaborasi."}
          </p>
          <Link href="/karir" className="btn btn-gold btn-lg" id="cta-join-team">
            {isEn ? "View Vacancies & Collaboration" : "Lihat Lowongan & Kolaborasi"}
          </Link>
        </div>
      </section>

      <Footer locale={locale} />
      <WhatsAppFloat />
    </>
  );
}
