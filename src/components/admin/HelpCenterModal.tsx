"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Home, Layers, PenTool, Users, Building, X, PlayCircle, ArrowRight, BookOpen } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpCenterModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted) return null;
  if (!isOpen && !isClosing) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300); // matches animation duration
  };

  const tutorials = [
    {
      id: "beranda",
      icon: Home,
      title: "Cara Edit Beranda",
      desc: "Panduan mengelola teks Hero, Statistik, dan Mitra.",
      path: "/admin/globals/beranda",
      color: "#3b82f6",
      bgLight: "#eff6ff",
    },
    {
      id: "layanan",
      icon: Layers,
      title: "Cara Tambah Layanan",
      desc: "Pelajari cara menambah dan mengedit Layanan baru.",
      path: "/admin/collections/services",
      color: "#8b5cf6",
      bgLight: "#f5f3ff",
    },
    {
      id: "artikel",
      icon: PenTool,
      title: "Cara Menulis Artikel",
      desc: "Panduan membuat, menerjemahkan, dan mempublikasikan Artikel.",
      path: "/admin/collections/articles/create",
      color: "#10b981",
      bgLight: "#ecfdf5",
    },
    {
      id: "tim",
      icon: Users,
      title: "Cara Mengelola Tim",
      desc: "Cara menambah anggota tim atau profil direksi.",
      path: "/admin/globals/tentang-kami", // Tim currently managed in Tentang Kami
      color: "#f59e0b",
      bgLight: "#fffbeb",
    },
    {
      id: "tentangkami",
      icon: Building,
      title: "Cara Edit Tentang Kami",
      desc: "Panduan mengelola Visi, Misi, dan profil perusahaan.",
      path: "/admin/globals/tentang-kami",
      color: "#ec4899",
      bgLight: "#fdf2f8",
    },
  ];

  const handleSelectTutorial = (path: string) => {
    handleClose();
    setTimeout(() => {
      // Navigate with a query param to trigger the tour on load
      router.push(`${path}?tour=1`);
    }, 300);
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
    opacity: isClosing ? 0 : 1,
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
    transform: isClosing ? "scale(0.95) translateY(10px)" : "scale(1) translateY(0)",
    opacity: isClosing ? 0 : 1,
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
            <h2 style={{ margin: "0 0 12px 0", fontSize: "28px", fontWeight: 700, letterSpacing: "-0.5px" }}>
              Selamat Datang di Mahaga Admin
            </h2>
            <p style={{ margin: 0, fontSize: "15px", opacity: 0.9, maxWidth: "500px", lineHeight: 1.5 }}>
              Pilih topik panduan interaktif di bawah ini. Sistem akan memandu Anda langkah demi langkah langsung di
              halaman yang bersangkutan.
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ padding: "2rem", overflowY: "auto", background: "#f8fafc" }}>
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
