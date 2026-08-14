"use client";

import Image from "next/image";
import Link from "next/link";
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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

        .forgot-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          color: #191b23;
          background-color: #faf8ff;
          background-image: radial-gradient(#d0e1fb 0.5px, transparent 0.5px), radial-gradient(#d0e1fb 0.5px, #faf8ff 0.5px);
          background-size: 20px 20px;
          background-position: 0 0, 10px 10px;
          font-family: 'Inter', sans-serif;
        }
        .forgot-blob {
          position: absolute;
          z-index: 0;
          border-radius: 9999px;
          filter: blur(80px);
          opacity: .4;
          pointer-events: none;
        }
        .forgot-main {
          min-height: calc(100vh - 66px);
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 1rem;
          position: relative;
          z-index: 1;
        }
        .forgot-card {
          width: 100%;
          max-width: 440px;
          box-sizing: border-box;
          padding: 2.5rem;
          border: 1px solid #e2e8f0;
          border-radius: .75rem;
          background: #fff;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,.1), 0 8px 10px -6px rgba(0,0,0,.1);
        }
        .forgot-brand {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 2.25rem;
          text-align: center;
        }
        .forgot-logo {
          width: 5rem;
          height: 5rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .forgot-title {
          margin: 0;
          color: #191b23;
          font-size: 1.25rem;
          font-weight: 600;
          line-height: 1.4;
        }
        .forgot-copy {
          margin: .5rem 0 0;
          color: #434655;
          font-size: .875rem;
          line-height: 1.65;
        }
        .forgot-form { display: flex; flex-direction: column; gap: 1.5rem; }
        .forgot-field { display: flex; flex-direction: column; gap: .5rem; }
        .forgot-label {
          color: #434655;
          font-size: .75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: .05em;
        }
        .forgot-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
          border-radius: .5rem;
        }
        .forgot-input-wrap:focus-within { box-shadow: 0 0 0 3px rgba(37,99,235,.1); }
        .forgot-input-icon {
          position: absolute;
          left: .75rem;
          color: #737686;
          font-size: 1.25rem;
          pointer-events: none;
        }
        .forgot-input {
          width: 100% !important;
          box-sizing: border-box !important;
          padding: .75rem 1rem .75rem 2.75rem !important;
          border: 1px solid #c3c6d7;
          border-radius: .5rem;
          outline: none;
          background: #fff;
          color: #191b23;
          font-size: .875rem;
          transition: border-color .2s;
        }
        .forgot-input:focus { border-color: #004ac6; }
        .forgot-button {
          width: 100%;
          padding: .875rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: .5rem;
          border: 0;
          border-radius: .5rem;
          background: #004ac6;
          color: #fff;
          cursor: pointer;
          font-size: .75rem;
          font-weight: 600;
          letter-spacing: .05em;
          text-transform: uppercase;
          box-shadow: 0 4px 6px -1px rgba(0,74,198,.2);
          transition: background-color .2s, box-shadow .2s, transform .2s;
        }
        .forgot-button:hover:not(:disabled) { background: #003ea8; box-shadow: 0 10px 15px -3px rgba(0,74,198,.3); }
        .forgot-button:active:not(:disabled) { transform: scale(.98); }
        .forgot-button:disabled { cursor: wait; opacity: .7; }
        .forgot-error {
          margin: 0;
          padding: .75rem;
          border-radius: .5rem;
          background: #ffdad6;
          color: #93000a;
          font-size: .875rem;
          font-weight: 500;
          line-height: 1.5;
          text-align: center;
        }
        .forgot-back-wrap {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #c3c6d7;
          text-align: center;
        }
        .forgot-back {
          display: inline-flex;
          align-items: center;
          gap: .4rem;
          color: #004ac6;
          font-size: .75rem;
          font-weight: 600;
          text-decoration: none;
        }
        .forgot-success-icon {
          width: 4rem;
          height: 4rem;
          margin: 0 auto 1.5rem;
          display: grid;
          place-items: center;
          border-radius: 999px;
          background: #e8f4ff;
          color: #004ac6;
        }
        .forgot-hint {
          margin-top: 1.5rem;
          padding: .875rem 1rem;
          border: 1px solid #dbe5f3;
          border-radius: .5rem;
          background: #f7faff;
          color: #54647a;
          font-size: .75rem;
          line-height: 1.6;
        }
        .forgot-footer {
          width: 100%;
          box-sizing: border-box;
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          position: relative;
          z-index: 1;
          border-top: 1px solid #c3c6d7;
          background: #faf8ff;
          color: #54647a;
          font-size: 11px;
        }
        .forgot-footer strong { color: #191b23; font-size: .75rem; font-weight: 900; }
        .forgot-footer-brand { display: flex; align-items: center; gap: 1.5rem; }
        @keyframes forgot-spin { to { transform: rotate(360deg); } }
        .forgot-spinning { animation: forgot-spin 1s linear infinite; }
        @media (max-width: 560px) {
          .forgot-main { align-items: flex-start; padding: 1.5rem 1rem 2rem; }
          .forgot-card { padding: 2rem 1.5rem; }
          .forgot-footer, .forgot-footer-brand { justify-content: center; flex-wrap: wrap; text-align: center; }
        }
      `}</style>

      <div className="forgot-page">
        <div
          className="forgot-blob"
          style={{ background: "#2563eb", width: 500, height: 500, top: -256, left: -128 }}
        />
        <div
          className="forgot-blob"
          style={{ background: "#d0e1fb", width: 400, height: 400, bottom: 0, right: -64 }}
        />

        <main className="forgot-main">
          <div className="forgot-card">
            {submitted ? (
              <>
                <div className="forgot-success-icon">
                  <span className="material-symbols-outlined" style={{ fontSize: 32 }}>
                    mark_email_read
                  </span>
                </div>
                <div className="forgot-brand" style={{ marginBottom: 0 }}>
                  <h1 className="forgot-title">Periksa email Anda</h1>
                  <p className="forgot-copy">
                    Jika alamat <strong>{email}</strong> terdaftar, instruksi untuk membuat kata sandi baru akan segera
                    dikirim.
                  </p>
                </div>
                <div className="forgot-hint">
                  Belum menerima email? Periksa folder Spam atau Junk. Tautan pemulihan hanya berlaku selama 60 menit.
                </div>
              </>
            ) : (
              <>
                <div className="forgot-brand">
                  <div className="forgot-logo">
                    <Image
                      src="/logo-transparent.png"
                      width={80}
                      height={80}
                      alt="Mahaga Widya Cita Logo"
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  </div>
                  <h1 className="forgot-title">Lupa kata sandi?</h1>
                  <p className="forgot-copy">
                    Masukkan email administrator untuk menerima tautan pemulihan akun yang aman.
                  </p>
                </div>

                <form className="forgot-form" onSubmit={handleSubmit}>
                  {error && (
                    <p className="forgot-error" role="alert">
                      {error}
                    </p>
                  )}
                  <div className="forgot-field">
                    <label className="forgot-label" htmlFor="forgot-email">
                      Alamat email
                    </label>
                    <div className="forgot-input-wrap">
                      <span className="material-symbols-outlined forgot-input-icon">mail</span>
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
                  </div>
                  <button className="forgot-button" type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="material-symbols-outlined forgot-spinning">progress_activity</span> Mengirim...
                      </>
                    ) : (
                      <>
                        Kirim tautan pemulihan{" "}
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                          arrow_forward
                        </span>
                      </>
                    )}
                  </button>
                </form>
              </>
            )}

            <div className="forgot-back-wrap">
              <Link className="forgot-back" href="/admin/login">
                <span className="material-symbols-outlined" style={{ fontSize: 17 }}>
                  arrow_back
                </span>
                Kembali ke halaman masuk
              </Link>
            </div>
          </div>
        </main>

        <footer className="forgot-footer">
          <div className="forgot-footer-brand">
            <strong>Mahaga Widya Cita</strong>
            <span>© 2026 PT Mahaga Widya Cita. All rights reserved.</span>
          </div>
          <span>Pemulihan akun administrator yang aman</span>
        </footer>
      </div>
    </>
  );
};
