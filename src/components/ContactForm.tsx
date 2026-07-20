"use client";
import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

interface ContactFormProps {
  subjects?: string[];
}

export default function ContactForm({
  subjects = [
    "Konsultasi Tata Kelola",
    "Smart Executive Education",
    "Smart Software Service",
    "Smart Online Course",
    "Pendaftaran Webinar",
    "Kemitraan & Kolaborasi",
    "Lainnya",
  ],
}: ContactFormProps) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", institution: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/contact-submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSubmitted(true);
        setForm({ name: "", email: "", phone: "", institution: "", subject: "", message: "" });
      } else {
        alert("Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Error submitting form", error);
      alert("Terjadi kesalahan koneksi. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
        <div
          style={{
            width: "72px",
            height: "72px",
            background: "var(--color-success-light)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
          }}
        >
          <CheckCircle2 size={36} color="var(--color-success)" />
        </div>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>Pesan Terkirim!</h2>
        <p style={{ color: "var(--color-neutral-500)", fontSize: "1rem", marginBottom: "2rem" }}>
          Terima kasih telah menghubungi kami. Tim kami akan segera menghubungi Anda dalam 1×24 jam kerja.
        </p>
        <button
          className="btn btn-primary"
          onClick={() => {
            setSubmitted(false);
            setForm({ name: "", email: "", phone: "", institution: "", subject: "", message: "" });
          }}
        >
          Kirim Pesan Baru
        </button>
      </div>
    );
  }

  return (
    <>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "0.375rem" }}>Kirim Pesan</h2>
      <p style={{ color: "var(--color-neutral-500)", marginBottom: "2rem", fontSize: "0.9375rem" }}>
        Isi formulir di bawah ini dan tim kami akan menghubungi Anda secepatnya.
      </p>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
          <div>
            <label htmlFor="contact-name">Nama Lengkap *</label>
            <input
              id="contact-name"
              name="name"
              type="text"
              className="input"
              placeholder="Budi Santoso"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="contact-email">Email *</label>
            <input
              id="contact-email"
              name="email"
              type="email"
              className="input"
              placeholder="budi@instansi.go.id"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="contact-phone">No. HP / WhatsApp</label>
            <input
              id="contact-phone"
              name="phone"
              type="tel"
              className="input"
              placeholder="0812xxxxxxxx"
              value={form.phone}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="contact-institution">Instansi / Perusahaan</label>
            <input
              id="contact-institution"
              name="institution"
              type="text"
              className="input"
              placeholder="Kementerian / Dinas / PT ..."
              value={form.institution}
              onChange={handleChange}
            />
          </div>
        </div>
        <div style={{ marginBottom: "1.25rem" }}>
          <label htmlFor="contact-subject">Subjek / Keperluan *</label>
          <select
            id="contact-subject"
            name="subject"
            className="input"
            value={form.subject}
            onChange={handleChange}
            required
            style={{ cursor: "pointer" }}
          >
            <option value="">— Pilih keperluan Anda —</option>
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: "2rem" }}>
          <label htmlFor="contact-message">Pesan *</label>
          <textarea
            id="contact-message"
            name="message"
            className="input"
            placeholder="Ceritakan kebutuhan atau pertanyaan Anda..."
            rows={5}
            value={form.message}
            onChange={handleChange}
            required
            style={{ resize: "vertical" }}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: "100%", justifyContent: "center" }}
          disabled={loading}
          id="submit-contact-form"
        >
          {loading ? (
            "Mengirim..."
          ) : (
            <>
              <Send size={16} /> Kirim Pesan
            </>
          )}
        </button>
      </form>
    </>
  );
}
