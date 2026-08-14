"use client";

import Link from "next/link";
import { useState } from "react";
import { AdminAuthShell } from "./AdminAuthShell";

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
    <AdminAuthShell
      title={submitted ? "Periksa email Anda" : "Pulihkan akun Anda"}
      description={
        submitted
          ? "Instruksi pemulihan telah diproses dengan aman."
          : "Kami akan mengirimkan tautan terbatas waktu ke email administrator Anda."
      }
    >
      {submitted ? (
        <>
          <div className="admin-auth-success">
            <span className="material-symbols-outlined" style={{ fontSize: 31 }}>
              mark_email_read
            </span>
          </div>
          <p className="admin-auth-description">
            Jika <strong>{email}</strong> terdaftar, email pengaturan ulang kata sandi akan segera diterima.
          </p>
          <div className="admin-auth-note">
            Periksa folder Spam atau Junk jika email belum terlihat. Tautan pemulihan berlaku selama 60 menit.
          </div>
        </>
      ) : (
        <form className="admin-auth-form" onSubmit={handleSubmit}>
          {error && (
            <p className="admin-auth-error" role="alert">
              {error}
            </p>
          )}
          <div className="admin-auth-field">
            <label className="admin-auth-label" htmlFor="forgot-email">
              Alamat email
            </label>
            <div className="admin-auth-input-wrap">
              <span className="material-symbols-outlined admin-auth-input-icon">mail</span>
              <input
                className="admin-auth-input"
                id="forgot-email"
                type="email"
                autoComplete="email"
                placeholder="nama@perusahaan.com"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
          </div>
          <button className="admin-auth-button" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="material-symbols-outlined admin-auth-spin">progress_activity</span> Mengirim...
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
      )}
      <div className="admin-auth-divider">
        <Link className="admin-auth-link" href="/admin/login">
          ← Kembali ke halaman masuk
        </Link>
      </div>
    </AdminAuthShell>
  );
};
