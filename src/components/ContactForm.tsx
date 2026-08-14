"use client";
import { useEffect, useRef, useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

interface ContactFormProps {
  initialMessage?: string;
  initialSubject?: string;
  subjects?: string[];
  locale?: string;
}

const defaultSubjectsId = [
  "Konsultasi Tata Kelola",
  "Smart Executive Education",
  "Smart Software Service",
  "Smart Online Course",
  "Pendaftaran Webinar",
  "Kemitraan & Kolaborasi",
  "Lainnya",
];

const defaultSubjectsEn = [
  "Governance Consulting",
  "Smart Executive Education",
  "Smart Software Service",
  "Smart Online Course",
  "Webinar Registration",
  "Partnership & Collaboration",
  "Other",
];

export default function ContactForm({
  initialMessage = "",
  initialSubject = "",
  subjects,
  locale = "id",
}: ContactFormProps) {
  const isEn = locale === "en";
  const configuredSubjects = subjects?.length ? subjects : isEn ? defaultSubjectsEn : defaultSubjectsId;
  const subjectOptions =
    initialSubject && !configuredSubjects.includes(initialSubject)
      ? [initialSubject, ...configuredSubjects]
      : configuredSubjects;
  const copy = isEn
    ? {
        title: "Send a Message",
        intro: "Fill out the form below and our team will get back to you shortly.",
        name: "Full Name *",
        namePh: "John Smith",
        email: "Email *",
        emailPh: "john@company.com",
        phone: "Phone / WhatsApp",
        phonePh: "+62 812xxxxxxxx",
        institution: "Organization / Company",
        institutionPh: "Ministry / Agency / Company ...",
        subject: "Subject / Purpose *",
        subjectPh: "— Select your purpose —",
        message: "Message *",
        messagePh: "Tell us about your needs or questions...",
        sending: "Sending...",
        submit: "Send Message",
        successTitle: "Message Sent!",
        successBody: "Thank you for contacting us. Our team will get back to you within 1×24 working hours.",
        sendAnother: "Send Another Message",
        errorSend: "Something went wrong while sending your message. Please try again.",
        errorNetwork: "A connection error occurred. Please try again.",
      }
    : {
        title: "Kirim Pesan",
        intro: "Isi formulir di bawah ini dan tim kami akan menghubungi Anda secepatnya.",
        name: "Nama Lengkap *",
        namePh: "Budi Santoso",
        email: "Email *",
        emailPh: "budi@instansi.go.id",
        phone: "No. HP / WhatsApp",
        phonePh: "0812xxxxxxxx",
        institution: "Instansi / Perusahaan",
        institutionPh: "Kementerian / Dinas / PT ...",
        subject: "Subjek / Keperluan *",
        subjectPh: "— Pilih keperluan Anda —",
        message: "Pesan *",
        messagePh: "Ceritakan kebutuhan atau pertanyaan Anda...",
        sending: "Mengirim...",
        submit: "Kirim Pesan",
        successTitle: "Pesan Terkirim!",
        successBody: "Terima kasih telah menghubungi kami. Tim kami akan segera menghubungi Anda dalam 1×24 jam kerja.",
        sendAnother: "Kirim Pesan Baru",
        errorSend: "Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.",
        errorNetwork: "Terjadi kesalahan koneksi. Silakan coba lagi.",
      };

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    institution: "",
    subject: initialSubject,
    message: initialMessage,
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [website, setWebsite] = useState("");
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/public/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...form, website, startedAt: startedAt.current }),
      });

      if (res.ok) {
        setSubmitted(true);
        setForm({ name: "", email: "", phone: "", institution: "", subject: "", message: "" });
        startedAt.current = Date.now();
      } else {
        alert(copy.errorSend);
      }
    } catch (error) {
      console.error("Error submitting form", error);
      alert(copy.errorNetwork);
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
        <h2 style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>{copy.successTitle}</h2>
        <p style={{ color: "var(--color-neutral-500)", fontSize: "1rem", marginBottom: "2rem" }}>{copy.successBody}</p>
        <button
          className="btn btn-primary"
          onClick={() => {
            setSubmitted(false);
            setForm({ name: "", email: "", phone: "", institution: "", subject: "", message: "" });
          }}
        >
          {copy.sendAnother}
        </button>
      </div>
    );
  }

  return (
    <>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "0.375rem" }}>{copy.title}</h2>
      <p style={{ color: "var(--color-neutral-500)", marginBottom: "2rem", fontSize: "0.9375rem" }}>{copy.intro}</p>
      <form onSubmit={handleSubmit}>
        <div
          aria-hidden="true"
          style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}
        >
          <label htmlFor="contact-website">Website</label>
          <input
            id="contact-website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
          />
        </div>
        <div
          className="responsive-form-grid"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}
        >
          <div>
            <label htmlFor="contact-name">{copy.name}</label>
            <input
              id="contact-name"
              name="name"
              type="text"
              className="input"
              placeholder={copy.namePh}
              value={form.name}
              onChange={handleChange}
              required
              maxLength={100}
            />
          </div>
          <div>
            <label htmlFor="contact-email">{copy.email}</label>
            <input
              id="contact-email"
              name="email"
              type="email"
              className="input"
              placeholder={copy.emailPh}
              value={form.email}
              onChange={handleChange}
              required
              maxLength={254}
            />
          </div>
          <div>
            <label htmlFor="contact-phone">{copy.phone}</label>
            <input
              id="contact-phone"
              name="phone"
              type="tel"
              className="input"
              placeholder={copy.phonePh}
              value={form.phone}
              onChange={handleChange}
              maxLength={30}
            />
          </div>
          <div>
            <label htmlFor="contact-institution">{copy.institution}</label>
            <input
              id="contact-institution"
              name="institution"
              type="text"
              className="input"
              placeholder={copy.institutionPh}
              value={form.institution}
              onChange={handleChange}
              maxLength={150}
            />
          </div>
        </div>
        <div style={{ marginBottom: "1.25rem" }}>
          <label htmlFor="contact-subject">{copy.subject}</label>
          <select
            id="contact-subject"
            name="subject"
            className="input"
            value={form.subject}
            onChange={handleChange}
            required
            style={{ cursor: "pointer" }}
          >
            <option value="">{copy.subjectPh}</option>
            {subjectOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: "2rem" }}>
          <label htmlFor="contact-message">{copy.message}</label>
          <textarea
            id="contact-message"
            name="message"
            className="input"
            placeholder={copy.messagePh}
            rows={5}
            value={form.message}
            onChange={handleChange}
            required
            maxLength={5000}
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
            copy.sending
          ) : (
            <>
              <Send size={16} /> {copy.submit}
            </>
          )}
        </button>
      </form>
    </>
  );
}
