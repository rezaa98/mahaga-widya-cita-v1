"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";

export const CustomForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/users/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      if (!response.ok) throw new Error("request-failed");
      setSubmitted(true);
    } catch {
      setError("Permintaan belum dapat diproses. Periksa koneksi Anda dan coba kembali.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="forgot-shell">
      <style>{`
        .forgot-shell { min-height: 100vh; display: grid; grid-template-columns: minmax(360px, 0.9fr) minmax(520px, 1.1fr); background: #f4f7fc; font-family: Inter, "Plus Jakarta Sans", system-ui, sans-serif; }
        .forgot-brand { position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; padding: clamp(32px, 5vw, 72px); color: #fff; background: linear-gradient(145deg, #0b2e68 0%, #1552b2 58%, #1f6fe5 100%); }
        .forgot-brand::before, .forgot-brand::after { content: ""; position: absolute; border-radius: 999px; pointer-events: none; }
        .forgot-brand::before { width: 460px; height: 460px; right: -230px; top: -180px; background: rgba(255,255,255,.09); }
        .forgot-brand::after { width: 280px; height: 280px; left: -150px; bottom: -110px; border: 1px solid rgba(255,255,255,.18); }
        .forgot-brand-content, .forgot-brand-footer { position: relative; z-index: 1; }
        .forgot-logo { display: flex; align-items: center; gap: 13px; font-size: 17px; font-weight: 750; letter-spacing: -.02em; }
        .forgot-brand-copy { max-width: 500px; margin-top: 14vh; }
        .forgot-brand-copy h1 { margin: 18px 0; font-size: clamp(36px, 4.3vw, 62px); line-height: 1.05; letter-spacing: -.045em; }
        .forgot-brand-copy p { max-width: 440px; margin: 0; color: #dbe9ff; font-size: 16px; line-height: 1.75; }
        .forgot-security-pill { display: inline-flex; align-items: center; gap: 8px; padding: 7px 12px; border: 1px solid rgba(255,255,255,.22); border-radius: 999px; background: rgba(255,255,255,.11); font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; }
        .forgot-brand-footer { display: flex; align-items: center; gap: 9px; color: #c9dcfb; font-size: 12px; }
        .forgot-content { display: grid; place-items: center; padding: clamp(24px, 6vw, 80px); }
        .forgot-card { width: min(100%, 480px); padding: clamp(28px, 4vw, 44px); border: 1px solid #e1e8f3; border-radius: 24px; background: rgba(255,255,255,.96); box-shadow: 0 24px 70px rgba(30,60,110,.12); }
        .forgot-icon { width: 56px; height: 56px; display: grid; place-items: center; border-radius: 16px; color: #175ac4; background: linear-gradient(145deg, #edf4ff, #dceaff); }
        .forgot-card h2 { margin: 22px 0 10px; color: #132746; font-size: clamp(26px, 3vw, 34px); line-height: 1.2; letter-spacing: -.035em; }
        .forgot-description { margin: 0 0 28px; color: #62718a; font-size: 14px; line-height: 1.7; }
        .forgot-label { display: block; margin-bottom: 9px; color: #243854; font-size: 12px; font-weight: 750; text-transform: uppercase; letter-spacing: .06em; }
        .forgot-input-wrap { position: relative; }
        .forgot-input-wrap svg { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #8190a7; }
        .forgot-input { width: 100%; height: 52px; box-sizing: border-box; padding: 0 15px 0 46px; border: 1px solid #cad5e4; border-radius: 12px; outline: none; background: #fff; color: #17213a; font-size: 15px; transition: border-color .2s, box-shadow .2s; }
        .forgot-input:focus { border-color: #2767c9; box-shadow: 0 0 0 4px rgba(39,103,201,.12); }
        .forgot-error { margin: 12px 0 0; color: #b42318; font-size: 13px; line-height: 1.5; }
        .forgot-submit { width: 100%; height: 52px; margin-top: 20px; display: flex; align-items: center; justify-content: center; gap: 9px; border: 0; border-radius: 12px; background: linear-gradient(135deg, #174eab, #1d6ce0); color: #fff; cursor: pointer; font-size: 14px; font-weight: 750; box-shadow: 0 12px 24px rgba(29,108,224,.22); transition: transform .2s, box-shadow .2s, opacity .2s; }
        .forgot-submit:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 16px 30px rgba(29,108,224,.28); }
        .forgot-submit:disabled { cursor: wait; opacity: .7; }
        .forgot-back { display: inline-flex; align-items: center; gap: 7px; margin-top: 24px; color: #52647f; text-decoration: none; font-size: 13px; font-weight: 650; }
        .forgot-back:hover { color: #175ac4; }
        .forgot-success-badge { display: inline-flex; align-items: center; gap: 7px; margin-top: 22px; padding: 8px 12px; border-radius: 999px; background: #eafaf2; color: #087447; font-size: 12px; font-weight: 750; }
        .forgot-hint { margin-top: 22px; padding: 15px 17px; border-radius: 12px; background: #f6f8fc; color: #687891; font-size: 12px; line-height: 1.65; }
        @media (max-width: 900px) { .forgot-shell { grid-template-columns: 1fr; } .forgot-brand { min-height: auto; padding: 24px; } .forgot-brand-copy, .forgot-brand-footer { display: none; } .forgot-content { min-height: calc(100vh - 88px); padding: 24px 18px 42px; } }
        @media (max-width: 520px) { .forgot-card { padding: 28px 22px; border-radius: 20px; } }
      `}</style>

      <aside className="forgot-brand" aria-label="PT Mahaga Widya Cita">
        <div className="forgot-brand-content">
          <div className="forgot-logo">
            <Image src="/logo-transparent.png" width={44} height={44} alt="Logo PT Mahaga Widya Cita" />
            <span>PT Mahaga Widya Cita</span>
          </div>
          <div className="forgot-brand-copy">
            <span className="forgot-security-pill">
              <ShieldCheck size={15} /> Pemulihan akun aman
            </span>
            <h1>Kembali bekerja dengan aman.</h1>
            <p>
              Kami akan mengirimkan tautan pemulihan terbatas waktu ke email yang terdaftar pada akun administrator
              Anda.
            </p>
          </div>
        </div>
        <div className="forgot-brand-footer">
          <ShieldCheck size={15} /> Tautan reset berlaku selama 60 menit
        </div>
      </aside>

      <section className="forgot-content">
        <div className="forgot-card">
          {submitted ? (
            <>
              <div className="forgot-icon">
                <CheckCircle2 size={28} />
              </div>
              <span className="forgot-success-badge">
                <CheckCircle2 size={14} /> Permintaan diterima
              </span>
              <h2>Periksa email Anda</h2>
              <p className="forgot-description">
                Jika alamat <strong>{email}</strong> terdaftar, instruksi untuk membuat kata sandi baru akan segera
                dikirim.
              </p>
              <div className="forgot-hint">
                Belum menerima email? Periksa folder Spam atau Junk. Demi keamanan, sistem tidak mengungkapkan apakah
                sebuah alamat terdaftar.
              </div>
              <Link className="forgot-back" href="/admin/login">
                <ArrowLeft size={16} /> Kembali ke halaman masuk
              </Link>
            </>
          ) : (
            <>
              <div className="forgot-icon">
                <Mail size={27} />
              </div>
              <h2>Lupa kata sandi?</h2>
              <p className="forgot-description">
                Masukkan email administrator. Kami akan mengirimkan tautan aman untuk mengatur ulang kata sandi Anda.
              </p>
              <form onSubmit={handleSubmit}>
                <label className="forgot-label" htmlFor="forgot-email">
                  Alamat email
                </label>
                <div className="forgot-input-wrap">
                  <Mail size={18} aria-hidden />
                  <input
                    className="forgot-input"
                    id="forgot-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="nama@perusahaan.com"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
                {error && (
                  <p className="forgot-error" role="alert">
                    {error}
                  </p>
                )}
                <button className="forgot-submit" type="submit" disabled={loading}>
                  {loading ? (
                    "Mengirim tautan..."
                  ) : (
                    <>
                      Kirim tautan pemulihan <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </form>
              <Link className="forgot-back" href="/admin/login">
                <ArrowLeft size={16} /> Kembali ke halaman masuk
              </Link>
            </>
          )}
        </div>
      </section>
    </main>
  );
};
