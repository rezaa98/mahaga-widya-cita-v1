"use client";

import Link from "next/link";
import { useState } from "react";
import { AdminAuthShell } from "./AdminAuthShell";

export const CustomLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok && data.user) {
        window.location.href = ["admin", "super_admin"].includes(data.user.role)
          ? "/admin"
          : "/admin/collections/articles";
        return;
      }
      setError(data.errors?.[0]?.message || "Email atau kata sandi tidak sesuai.");
    } catch {
      setError("Tidak dapat terhubung. Silakan coba kembali.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminAuthShell
      title="Selamat datang kembali"
      description="Masuk menggunakan akun administrator Mahaga Widya Cita."
    >
      <form className="admin-auth-form" onSubmit={handleLogin}>
        {error && (
          <p className="admin-auth-error" role="alert">
            {error}
          </p>
        )}
        <div className="admin-auth-field">
          <label className="admin-auth-label" htmlFor="login-email">
            Alamat email
          </label>
          <div className="admin-auth-input-wrap">
            <span className="material-symbols-outlined admin-auth-input-icon">mail</span>
            <input
              className="admin-auth-input"
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="nama@perusahaan.com"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
        </div>
        <div className="admin-auth-field">
          <div className="admin-auth-label-row">
            <label className="admin-auth-label" htmlFor="login-password">
              Kata sandi
            </label>
            <Link className="admin-auth-link" href="/admin/forgot">
              Lupa kata sandi?
            </Link>
          </div>
          <div className="admin-auth-input-wrap">
            <span className="material-symbols-outlined admin-auth-input-icon">lock</span>
            <input
              className="admin-auth-input"
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Masukkan kata sandi"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button
              className="admin-auth-trailing"
              type="button"
              aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
              onClick={() => setShowPassword((value) => !value)}
            >
              <span className="material-symbols-outlined">{showPassword ? "visibility_off" : "visibility"}</span>
            </button>
          </div>
        </div>
        <button className="admin-auth-button" type="submit" disabled={loading}>
          {loading ? (
            <>
              <span className="material-symbols-outlined admin-auth-spin">progress_activity</span> Memproses...
            </>
          ) : (
            <>
              Masuk ke Admin{" "}
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                arrow_forward
              </span>
            </>
          )}
        </button>
      </form>
      <div className="admin-auth-divider">Memerlukan akses? Hubungi administrator sistem.</div>
    </AdminAuthShell>
  );
};
