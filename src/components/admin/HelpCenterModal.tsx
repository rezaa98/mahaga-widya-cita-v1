"use client";
import React, { useState, useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  Home,
  Layers,
  PenTool,
  Users,
  Building,
  X,
  PlayCircle,
  ArrowRight,
  BookOpen,
  Camera,
  Phone,
} from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpCenterModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"tutorials" | "faq">("tutorials");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted) return null;
  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
  };

  const tutorials = [
    {
      id: "beranda",
      icon: Home,
      title: "Cara Edit Beranda",
      desc: "Panduan mengelola teks Hero banner, angka statistik, dan logo mitra.",
      path: "/admin/globals/beranda",
      color: "#3b82f6",
      bgLight: "#eff6ff",
    },
    {
      id: "artikel",
      icon: Camera,
      title: "Tulis Artikel & Galeri Foto",
      desc: "Panduan membuat rilis berita, upload banyak foto kegiatan, dan preview draf.",
      path: "/admin/collections/articles/create",
      color: "#10b981",
      bgLight: "#ecfdf5",
    },
    {
      id: "tim",
      icon: Users,
      title: "Cara Mengelola Tim Ahli",
      desc: "Cara menambah anggota tim ahli, pimpinan, foto profil, dan keahlian.",
      path: "/admin/collections/team-members",
      color: "#f59e0b",
      bgLight: "#fffbeb",
    },
    {
      id: "layanan",
      icon: Layers,
      title: "Cara Kelola Layanan",
      desc: "Pelajari cara menambah dan mengedit paket layanan konsultasi.",
      path: "/admin/collections/services",
      color: "#8b5cf6",
      bgLight: "#f5f3ff",
    },
    {
      id: "tentangkami",
      icon: Building,
      title: "Cara Edit Tentang Kami",
      desc: "Panduan mengelola visi, misi, profil korporat, dan pesan direktur.",
      path: "/admin/globals/tentang-kami",
      color: "#ec4899",
      bgLight: "#fdf2f8",
    },
    {
      id: "kontak",
      icon: Phone,
      title: "Cara Ubah Kontak & Lokasi",
      desc: "Panduan mengganti nomor WhatsApp, email kantor, dan Google Maps.",
      path: "/admin/globals/kontak",
      color: "#0284c7",
      bgLight: "#f0f9ff",
    },
  ];

  const faqs = [
    {
      q: "Bagaimana cara mengubah nomor WhatsApp & alamat kantor?",
      a: "Buka menu 'Halaman Website' > 'Kontak & Lokasi Kantor'. Ubah nomor telepon atau alamat gedung, lalu klik tombol biru 'Simpan' di kanan bawah.",
      path: "/admin/globals/kontak",
      btnText: "Buka Halaman Kontak",
    },
    {
      q: "Bagaimana cara membuat berita baru dan memasukkan banyak foto?",
      a: "Klik tombol 'Tulis Berita / Artikel Baru' di dashboard. Masukkan judul dan isi naskah. Di bawahnya terdapat bagian 'Dokumentasi & Galeri Foto' untuk mengunggah banyak foto kegiatan sekaligus.",
      path: "/admin/collections/articles/create",
      btnText: "Tulis Artikel Baru",
    },
    {
      q: "Bagaimana cara melihat tampilan sebelum dipublikasikan ke umum?",
      a: "Saat mengedit artikel atau halaman, ada tombol 'Pratinjau Draf' (Preview) di atas naskah. Klik tombol tersebut untuk melihat tampilan asli di website dengan aman sebelum tayang ke publik.",
      path: "/admin/collections/articles",
      btnText: "Buka Daftar Artikel",
    },
    {
      q: "Apakah saya harus menerjemahkan sendiri ke Bahasa Inggris?",
      a: "Tidak perlu repot! Cukup tulis dalam Bahasa Indonesia. Sistem AI Mahaga Widya Cita akan otomatis menyiapkan terjemahan Bahasa Inggris setelah dokumen disimpan.",
      path: "/admin/globals/beranda",
      btnText: "Lihat Beranda",
    },
    {
      q: "Bagaimana cara menambah anggota tim ahli atau manajemen baru?",
      a: "Buka menu 'Halaman Website' > 'Tim Ahli & Manajemen', klik tombol 'Tambah Baru'. Masukkan nama lengkap, jabatan, biografi singkat, dan pas foto formal.",
      path: "/admin/collections/team-members",
      btnText: "Kelola Tim Ahli",
    },
    {
      q: "Di mana saya bisa melihat pesan dari formulir kontak website?",
      a: "Buka menu 'Pesan & Pengunjung' > 'Pesan Masuk Formulir'. Semua nama pengirim, email, nomor telepon, dan subjek pertanyaan dari pengunjung website tersimpan rapi di sana.",
      path: "/admin/collections/contact-submissions",
      btnText: "Buka Pesan Masuk",
    },
  ];

  const handleSelectTutorial = (path: string) => {
    onClose();
    router.push(`${path}?tour=1`);
  };

  const handleGoToPage = (path: string) => {
    onClose();
    router.push(path);
  };

  const backdropStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    backdropFilter: "blur(8px)",
    zIndex: 999999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
    opacity: 1,
    transition: "opacity 0.3s ease-out",
  };

  const modalStyle: React.CSSProperties = {
    background: "#ffffff",
    borderRadius: "24px",
    width: "100%",
    maxWidth: "850px",
    maxHeight: "90vh",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.05)",
    fontFamily: '"Inter", "Plus Jakarta Sans", sans-serif',
    transform: "scale(1) translateY(0)",
    opacity: 1,
    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
    overflow: "hidden",
  };

  return createPortal(
    <div style={backdropStyle} onClick={handleClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {/* Header / Banner */}
        <div
          style={{
            background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)",
            padding: "2.5rem 2rem",
            position: "relative",
            overflow: "hidden",
            color: "white",
          }}
        >
          {/* Decorative circles */}
          <div
            style={{
              position: "absolute",
              top: "-50px",
              right: "-50px",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-80px",
              right: "50px",
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.05)",
            }}
          />

          <button
            onClick={handleClose}
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              background: "rgba(255,255,255,0.2)",
              border: "none",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "white",
              transition: "background 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.3)")}
            onMouseOut={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
          >
            <X size={18} strokeWidth={2.5} />
          </button>

          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(255,255,255,0.2)",
                padding: "6px 12px",
                borderRadius: "100px",
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                marginBottom: "16px",
              }}
            >
              <BookOpen size={14} /> Pusat Bantuan
            </div>
            <h2 style={{ margin: "0 0 12px 0", fontSize: "26px", fontWeight: 700, letterSpacing: "-0.5px" }}>
              Pusat Panduan & Bantuan Admin
            </h2>
            <p style={{ margin: 0, fontSize: "14px", opacity: 0.9, maxWidth: "560px", lineHeight: 1.5 }}>
              Pilih topik panduan interaktif atau baca tanya-jawab cepat di bawah. Anda akan dipandu langsung di halaman
              yang bersangkutan tanpa kebingungan.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            padding: "0 2rem",
            marginTop: "-20px",
            zIndex: 10,
            position: "relative",
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab("tutorials")}
            style={{
              padding: "10px 18px",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              background: activeTab === "tutorials" ? "#ffffff" : "#f1f5f9",
              color: activeTab === "tutorials" ? "#1e40af" : "#64748b",
              fontWeight: 700,
              fontSize: "14px",
              cursor: "pointer",
              boxShadow: activeTab === "tutorials" ? "0 4px 12px rgba(0,0,0,0.08)" : "none",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.2s",
            }}
          >
            <span>🧭</span>
            <span>Panduan Interaktif</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("faq")}
            style={{
              padding: "10px 18px",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              background: activeTab === "faq" ? "#ffffff" : "#f1f5f9",
              color: activeTab === "faq" ? "#1e40af" : "#64748b",
              fontWeight: 700,
              fontSize: "14px",
              cursor: "pointer",
              boxShadow: activeTab === "faq" ? "0 4px 12px rgba(0,0,0,0.08)" : "none",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.2s",
            }}
          >
            <span>💬</span>
            <span>Tanya Jawab Pemula (FAQ)</span>
          </button>
        </div>

        {/* Content Area */}
        <div style={{ padding: "1.75rem 2rem 2rem", overflowY: "auto", background: "#f8fafc" }}>
          {activeTab === "tutorials" ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: "1.25rem",
              }}
            >
              {tutorials.map((tut) => {
                const Icon = tut.icon;
                const isHovered = hoveredId === tut.id;

                return (
                  <div
                    key={tut.id}
                    onClick={() => handleSelectTutorial(tut.path)}
                    onMouseEnter={() => setHoveredId(tut.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{
                      padding: "1.5rem",
                      background: "white",
                      borderRadius: "16px",
                      cursor: "pointer",
                      transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                      border: "1px solid #e2e8f0",
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                      boxShadow: isHovered
                        ? "0 12px 24px -10px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.05)"
                        : "0 2px 4px -2px rgba(0,0,0,0.05)",
                      transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "12px",
                          background: tut.bgLight,
                          color: tut.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "transform 0.3s",
                          transform: isHovered ? "scale(1.1)" : "scale(1)",
                        }}
                      >
                        <Icon size={24} strokeWidth={2} />
                      </div>

                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          background: isHovered ? tut.color : "#f1f5f9",
                          color: isHovered ? "white" : "#94a3b8",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.3s",
                        }}
                      >
                        <ArrowRight
                          size={16}
                          strokeWidth={2.5}
                          style={{
                            transform: isHovered ? "translateX(2px)" : "translateX(0)",
                            transition: "transform 0.3s",
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <h3 style={{ margin: "0 0 8px 0", fontSize: "17px", fontWeight: 600, color: "#0f172a" }}>
                        {tut.title}
                      </h3>
                      <p style={{ margin: 0, fontSize: "14px", color: "#64748b", lineHeight: 1.5 }}>{tut.desc}</p>
                    </div>

                    <div
                      style={{
                        marginTop: "auto",
                        paddingTop: "12px",
                        borderTop: "1px solid #f1f5f9",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: tut.color,
                        opacity: isHovered ? 1 : 0.7,
                        transition: "opacity 0.3s",
                      }}
                    >
                      <PlayCircle size={16} /> Mulai Tur Interaktif
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  style={{
                    background: "#ffffff",
                    borderRadius: "14px",
                    border: "1px solid #e2e8f0",
                    padding: "1.25rem 1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}
                  >
                    <h4 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#0f172a", lineHeight: 1.4 }}>
                      ❓ {faq.q}
                    </h4>
                    <button
                      type="button"
                      onClick={() => handleGoToPage(faq.path)}
                      style={{
                        whiteSpace: "nowrap",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        background: "#eff6ff",
                        color: "#1d4ed8",
                        border: "1px solid #bfdbfe",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <span>{faq.btnText}</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                  <p style={{ margin: 0, fontSize: "14px", color: "#475569", lineHeight: 1.5 }}>{faq.a}</p>
                </div>
              ))}
            </div>
          )}

          <div
            style={{
              marginTop: "2rem",
              padding: "1.25rem",
              background: "white",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "#f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: "20px" }}>👋</span>
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>Butuh bantuan lain?</div>
                <div style={{ fontSize: "13px", color: "#64748b" }}>
                  Hubungi administrator sistem untuk dukungan teknis lebih lanjut.
                </div>
              </div>
            </div>
            <button
              onClick={handleClose}
              style={{
                background: "#f1f5f9",
                color: "#475569",
                border: "none",
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "#e2e8f0")}
              onMouseOut={(e) => (e.currentTarget.style.background = "#f1f5f9")}
            >
              Tutup Pusat Bantuan
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};
