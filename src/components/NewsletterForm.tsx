"use client";
import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setStatus("idle");

    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubscribe} style={{ display: "flex", gap: "0.625rem", flexShrink: 0, flexWrap: "wrap" }}>
      <input
        type="email"
        placeholder="Masukkan email Anda"
        className="input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
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
        {loading ? "Memproses..." : status === "success" ? "Berhasil!" : "Langganan"}
      </button>
    </form>
  );
}
