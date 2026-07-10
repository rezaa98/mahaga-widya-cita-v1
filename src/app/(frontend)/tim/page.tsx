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
  description: "Kenali para pakar dan manajemen PT Mahaga Widya Cita yang berpengalaman di bidang administrasi publik, tata kelola, dan teknologi.",
};

export default async function TimPage() {
  const payload = await getPayload({ config: configPromise });
  const result = await payload.find({
    collection: 'team-members',
    limit: 100,
    sort: 'order',
  });

  const team = result.docs;
  const management = team.filter(member => member.category === 'management');
  const experts = team.filter(member => member.category === 'expert');

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section style={{ background: "linear-gradient(135deg, var(--color-primary-900), var(--color-primary-700))", paddingTop: "calc(72px + 4rem)", paddingBottom: "4rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 70% 50%, rgba(30,111,217,0.3) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div className="container" style={{ position: "relative" }}>
          <span className="badge" style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.9)", marginBottom: "1rem" }}>Tim & Manajemen</span>
          <h1 className="text-display" style={{ color: "white", marginBottom: "1.25rem", maxWidth: "640px" }}>
            Dipandu oleh Para<br /><span style={{ color: "var(--color-gold-300)" }}>Pakar Terbaik Indonesia</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "1.125rem", maxWidth: "500px" }}>
            Kami bangga memiliki tim yang terdiri dari akademisi, birokrat berpengalaman, dan praktisi teknologi terkemuka.
          </p>
        </div>
        <WaveDivider fill="white" />
      </section>

      {/* MANAGEMENT */}
      <section className="section" id="manajemen">
        <div className="container">
          <div className="section-title">
            <span className="overline">Pimpinan</span>
            <h2>Manajemen Perusahaan</h2>
            <div className="gold-divider" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(280px, 1fr))", gap: "2rem" }}>
            {management.map((m) => (
              <TeamMemberCard key={m.id} member={m} />
            ))}
          </div>
        </div>
      </section>

      {/* EXPERTS */}
      <section className="section" style={{ background: "var(--color-neutral-50)" }} id="ahli">
        <div className="container">
          <div className="section-title text-center" style={{ alignItems: "center" }}>
            <span className="overline">Jejaring Kepakaran</span>
            <h2>Tenaga Ahli & Fasilitator</h2>
            <div className="gold-divider" />
            <p style={{ color: "var(--color-neutral-600)", maxWidth: "600px", margin: "1rem auto 0" }}>
              Ratusan program kami didukung oleh para praktisi dan akademisi terbaik dari berbagai institusi dan perguruan tinggi terkemuka di Indonesia.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
            {experts.map((expert) => (
              <TeamMemberCard key={expert.id} member={expert} />
            ))}
          </div>
        </div>
      </section>

      {/* JOIN CTA */}
      <section style={{ background: "linear-gradient(135deg, var(--color-primary-900), var(--color-primary-700))", padding: "4.5rem 0" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={{ color: "white", marginBottom: "1rem" }}>Bergabung Bersama Tim Pakar Kami</h2>
          <p style={{ color: "rgba(255,255,255,0.75)", marginBottom: "2rem", fontSize: "1.0625rem" }}>
            Kami selalu membuka kesempatan bagi akademisi dan praktisi terbaik untuk berkolaborasi.
          </p>
          <Link href="/karir" className="btn btn-gold btn-lg" id="cta-join-team">
            Lihat Lowongan & Kolaborasi
          </Link>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </>
  );
}
