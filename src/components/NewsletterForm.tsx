"use client";
import { useEffect, useRef, useState } from "react";

export default function NewsletterForm({ locale = "id" }: { locale?: string }) {
  const isEn = locale === "en";
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [website, setWebsite] = useState("");
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setStatus("idle");

    try {
      const res = await fetch("/api/public/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website, startedAt: startedAt.current }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
        startedAt.current = Date.now();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubscribe} style={{ display: "flex", gap: "0.625rem", flexShrink: 0, flexWrap: "wrap" }}>
      <input
        aria-hidden="true"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={website}
        onChange={(event) => setWebsite(event.target.value)}
        style={{ position: "absolute", left: "-10000px", width: 1, height: 1 }}
      />
      <input
        type="email"
        aria-label={isEn ? "Email for newsletter subscription" : "Email untuk berlangganan newsletter"}
        placeholder={isEn ? "Enter your email" : "Masukkan email Anda"}
        className="input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        maxLength={254}
        disabled={loading || status === "success"}
        style={{
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "white",
          minWidth: "240px",
          borderRadius: "var(--radius-full)",
        }}
        id="newsletter-email"
      />
      <button
        type="submit"
        className="btn btn-primary btn-sm"
        disabled={loading || status === "success"}
        style={{
          backgroundColor: status === "success" ? "var(--color-success)" : undefined,
          borderColor: status === "success" ? "var(--color-success)" : undefined,
        }}
      >
        {loading
          ? isEn
            ? "Processing..."
            : "Memproses..."
          : status === "success"
            ? isEn
              ? "Subscribed!"
              : "Berhasil!"
            : isEn
              ? "Subscribe"
              : "Langganan"}
      </button>
      <span role="status" aria-live="polite" style={{ width: "100%", fontSize: ".8125rem" }}>
        {status === "error"
          ? isEn
            ? "Subscription failed. Please try again."
            : "Pendaftaran gagal. Silakan coba lagi."
          : ""}
      </span>
    </form>
  );
}
