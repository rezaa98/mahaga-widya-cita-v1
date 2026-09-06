"use client";

import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

function MemberVisual({
  member,
  photoUrl,
  initials,
  visibleRole,
}: {
  member: any;
  photoUrl: string | null;
  initials: string;
  visibleRole?: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          width: "100%",
          aspectRatio: "1 / 1.1",
          background:
            member.color || "linear-gradient(180deg, var(--color-primary-50) 0%, var(--color-primary-200) 100%)",
          borderTopLeftRadius: "999px",
          borderTopRightRadius: "999px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {photoUrl && !imageFailed ? (
          // Profile media can be hosted by the CMS on a runtime-configured domain.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl}
            alt={member.name}
            onError={() => setImageFailed(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <span style={{ fontSize: "4rem", fontWeight: "700", color: "white" }}>{initials}</span>
          </div>
        )}
      </div>

      <div style={{ position: "relative" }}>
        {visibleRole && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "white",
              padding: "0.5rem 1rem",
              borderRadius: "9999px",
              fontSize: "0.65rem",
              fontWeight: "800",
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              width: "85%",
              color: "#191b23",
              zIndex: 10,
              whiteSpace: "normal",
              lineHeight: "1.3",
            }}
          >
            {visibleRole}
          </div>
        )}
        <div
          style={{
            background: "linear-gradient(135deg, var(--color-primary-700) 0%, var(--color-primary-900) 100%)",
            color: "white",
            padding: "1.25rem 0.5rem 0.75rem",
            textAlign: "center",
            fontSize: "0.875rem",
            fontWeight: "700",
            borderRadius: "0 0 6px 6px",
            boxShadow: "0 4px 10px rgba(11, 45, 107, 0.2)",
          }}
        >
          {member.name}
        </div>
      </div>
    </div>
  );
}

export default function TeamMemberCard({ member, locale = "id" }: { member: any; locale?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const memberName = typeof member.name === "string" ? member.name.toLowerCase() : "";
  const isIraNingrum = memberName.includes("ira ningrum");
  const isThataDebora = memberName.includes("thata debora");
  const visibleRole = isIraNingrum
    ? "Government & Regional Autonomy Expert"
    : isThataDebora
      ? "Supervisor"
      : [member.role, member.expertise].find(
          (value) => typeof value === "string" && value.trim() && value.trim() !== "-",
        );
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const dialog = dialogRef.current;
    dialog?.querySelector<HTMLElement>("button")?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        requestAnimationFrame(() => triggerRef.current?.focus());
      }
      if (event.key !== "Tab" || !dialog) return;
      const focusable = [...dialog.querySelectorAll<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])')];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  let photoUrl = member.photo && typeof member.photo !== "string" ? member.photo.url : null;
  const initials = member.initials;

  // Fallback for Vercel read-only filesystem (where media upload fails but files exist in git)
  if (!photoUrl) {
    const fallbackMap: Record<string, string> = {
      "Prof. Dr. Hj. Endang Larasati, M.S.": "/media/prof_endang_1783667447330.png",
      "Dr. Oscar Radyan Danar, M.A.": "/media/dr_oscar_1783667480247.png",
      "Rizki Firmansyah, M.Sc.": "/media/rizki_firmansyah_1783667489175.png",
      "Prof. Dr. Ahmad Basori, M.M.": "/media/prof_ahmad_1783667505471.png",
      "Sari Dewi Purnama, S.Psi., M.Si.": "/media/sari_dewi_1783667556008.png",
      "Dr. Bambang Wiyono, S.H., M.H.": "/media/dr_bambang_1783667514730.png",
      "Rudi Ardiansyah, M.Kom.": "/media/rudi_ardiansyah_1783667564948.png",
      "Nurul Aini, M.Pd.": "/media/nurul_aini_1783667603562.png",
      "Dr. Hendra Saputra, M.Sos.": "/media/dr_hendra_1783667613293.png",
    };
    if (fallbackMap[member.name]) {
      photoUrl = fallbackMap[member.name];
    }
  }

  return (
    <>
      {/* GRID CARD */}
      <div
        ref={triggerRef}
        className="card"
        role="button"
        tabIndex={0}
        aria-label={`${locale === "en" ? "View profile" : "Lihat profil"}: ${member.name}`}
        onClick={() => setIsOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setIsOpen(true);
          }
        }}
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "1rem",
          background: "white",
          border: "1px solid var(--color-neutral-100)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
          borderRadius: "16px",
          cursor: "pointer",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "none";
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.04)";
        }}
      >
        <MemberVisual member={member} photoUrl={photoUrl} initials={initials} visibleRole={visibleRole} />
      </div>

      {/* POPUP MODAL */}
      {isOpen && (
        <div
          role="presentation"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.7)",
            backdropFilter: "blur(8px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            animation: "fadeIn 0.2s ease-out",
          }}
          onClick={() => setIsOpen(false)}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`team-member-${member.id || member.initials}`}
            style={{
              background: "white",
              borderRadius: "24px",
              width: "100%",
              maxWidth: "1000px",
              maxHeight: "90vh",
              overflow: "hidden",
              display: "flex",
              position: "relative",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              animation: "slideUp 0.3s ease-out",
            }}
            onClick={(e) => e.stopPropagation()}
            className="team-member-dialog"
          >
            {/* Close Button */}
            <button
              type="button"
              aria-label={locale === "en" ? "Close profile" : "Tutup profil"}
              onClick={() => setIsOpen(false)}
              style={{
                position: "absolute",
                top: "1.5rem",
                right: "1.5rem",
                background: "var(--color-neutral-100)",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 10,
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-neutral-200)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-neutral-100)")}
            >
              <X size={20} color="#475569" />
            </button>

            {/* Modal Content - Left side */}
            <div
              className="team-member-dialog-copy"
              style={{ padding: "3.5rem 3rem", flex: 1, overflowY: "auto", maxHeight: "90vh" }}
            >
              <h2
                id={`team-member-${member.id || member.initials}`}
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "900",
                  marginBottom: "0.5rem",
                  color: "#0f172a",
                  letterSpacing: "-0.02em",
                  lineHeight: "1.2",
                }}
              >
                {member.name}
              </h2>
              {visibleRole && (
                <p
                  style={{
                    color: "var(--color-primary-600)",
                    fontWeight: "800",
                    fontSize: "1rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "2.5rem",
                  }}
                >
                  {visibleRole}
                </p>
              )}

              <div style={{ color: "#475569", lineHeight: "1.8", fontSize: "1.125rem" }}>
                {member.institution && (
                  <p style={{ marginBottom: member.bio ? "1.5rem" : "1rem" }}>
                    <strong>{locale === "en" ? "Institution" : "Instansi"}:</strong> {member.institution}
                  </p>
                )}

                {member.bio && (
                  <div style={{ marginTop: "1rem" }}>
                    {member.bio.split("\n").map((paragraph: string, idx: number) => (
                      <p key={idx} style={{ marginBottom: "1.5rem" }}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Content - Right side (Card visual) */}
            <div
              style={{
                padding: "3.5rem 3rem",
                width: "400px",
                background: "var(--color-neutral-50)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                borderLeft: "1px solid var(--color-neutral-200)",
              }}
              className="team-member-dialog-visual"
            >
              <div
                style={{
                  background: "white",
                  padding: "1rem",
                  borderRadius: "16px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                }}
              >
                <MemberVisual member={member} photoUrl={photoUrl} initials={initials} visibleRole={visibleRole} />
              </div>
            </div>
          </div>
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `,
        }}
      />
    </>
  );
}
