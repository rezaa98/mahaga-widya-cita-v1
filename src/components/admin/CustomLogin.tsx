"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export const CustomLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.user) {
        // Force hard refresh to ensure Payload admin state picks up the cookie properly
        window.location.href = ["admin", "super_admin"].includes(data.user.role)
          ? "/admin"
          : "/admin/collections/articles";
      } else {
        setError(data.errors?.[0]?.message || "Invalid email or password");
        setLoading(false);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

        .nexus-login-wrapper {
          font-family: 'Inter', sans-serif;
          background-color: #faf8ff;
          background-image: radial-gradient(#d0e1fb 0.5px, transparent 0.5px), radial-gradient(#d0e1fb 0.5px, #faf8ff 0.5px);
          background-size: 20px 20px;
          background-position: 0 0, 10px 10px;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          color: #191b23;
        }
        
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          vertical-align: middle;
        }
        
        .login-card {
          background: #ffffff;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          border: 1px solid #E2E8F0;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          border-radius: 0.75rem;
        }

        .input-glow:focus-within {
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .blob {
          position: absolute;
          filter: blur(80px);
          z-index: 0;
          opacity: 0.4;
          border-radius: 9999px;
        }
        
        .custom-input {
          width: 100% !important;
          box-sizing: border-box !important;
          padding: 0.75rem 1rem 0.75rem 2.75rem !important;
          background: #ffffff;
          border: 1px solid #c3c6d7;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          outline: none;
          transition: all 0.2s;
        }
        .custom-input:focus {
          border-color: #004ac6;
        }
        
        .custom-input-password {
          padding-right: 3rem !important;
        }
        
        .btn-primary {
          background-color: #004ac6;
          color: white;
          width: 100%;
          padding: 0.875rem;
          border-radius: 0.5rem;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 74, 198, 0.2);
          border: none;
          cursor: pointer;
        }
        .btn-primary:hover {
          background-color: #003ea8;
          box-shadow: 0 10px 15px -3px rgba(0, 74, 198, 0.3);
        }
        .btn-primary:active {
          transform: scale(0.98);
        }
        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `,
        }}
      />

      <div className="nexus-login-wrapper">
        {/* Atmospheric Background Elements */}
        <div
          className="blob"
          style={{ background: "#2563eb", width: "500px", height: "500px", top: "-16rem", left: "-8rem" }}
        ></div>
        <div
          className="blob"
          style={{ background: "#d0e1fb", width: "400px", height: "400px", bottom: "0", right: "-4rem" }}
        ></div>

        <main
          style={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "3rem 1rem",
            position: "relative",
            zIndex: 10,
          }}
        >
          <div style={{ width: "100%", maxWidth: "440px" }}>
            {/* Login Card */}
            <div className="login-card" style={{ padding: "2.5rem" }}>
              {/* Brand Header */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "2.5rem" }}>
                <div
                  style={{
                    width: "5rem",
                    height: "5rem",
                    marginBottom: "1.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    alt="Nexus Admin Logo"
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmICE4OFCf2QdKsUYasy2vctHsQjkgNCSbXBwZDuyxhEZX3b23HDeMiuSMrr6SjQ_dI5n-6YkDiP5-rzuOGb5yEYLYKwX9nMaAwKfTYk8jM3cmxhVaSYNVRlaLaziuNzWYchWWB78pLHwQCHA5UCGCVnnktKeY-JUcnFAZoYDXWZMT5hSmFP1fIa1n4zMhOuztVDkfgqvPqG4N_lKfZG0XnettcxauoLyO83l1BLLV7BQOukJUFh8E4jNl926Eq28cJA"
                  />
                </div>
                <h1 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#191b23", margin: 0 }}>Welcome back</h1>
                <p style={{ fontSize: "0.875rem", color: "#434655", marginTop: "0.5rem", margin: "0.5rem 0 0 0" }}>
                  Sign in to your Mahaga Widya Cita Admin account
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {error && (
                  <div
                    style={{
                      padding: "0.75rem",
                      background: "#ffdad6",
                      color: "#93000a",
                      borderRadius: "0.5rem",
                      fontSize: "0.875rem",
                      textAlign: "center",
                      fontWeight: 500,
                    }}
                  >
                    {error}
                  </div>
                )}

                {/* Email Field */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label
                    htmlFor="email"
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "#434655",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Email Address
                  </label>
                  <div
                    className="input-glow"
                    style={{ position: "relative", display: "flex", alignItems: "center", borderRadius: "0.5rem" }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ position: "absolute", left: "0.75rem", color: "#737686", fontSize: "1.25rem" }}
                    >
                      mail
                    </span>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="name@company.com"
                      className="custom-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label
                      htmlFor="password"
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "#434655",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Password
                    </label>
                    <a
                      href="#"
                      style={{ fontSize: "0.75rem", fontWeight: 600, color: "#004ac6", textDecoration: "none" }}
                    >
                      Forgot password?
                    </a>
                  </div>
                  <div
                    className="input-glow"
                    style={{ position: "relative", display: "flex", alignItems: "center", borderRadius: "0.5rem" }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ position: "absolute", left: "0.75rem", color: "#737686", fontSize: "1.25rem" }}
                    >
                      lock
                    </span>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      className="custom-input custom-input-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        right: "0.75rem",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#737686",
                        padding: 0,
                        display: "flex",
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: "1.25rem" }}>
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input id="remember" type="checkbox" style={{ width: "1rem", height: "1rem", cursor: "pointer" }} />
                  <label
                    htmlFor="remember"
                    style={{
                      marginLeft: "0.5rem",
                      fontSize: "0.875rem",
                      color: "#434655",
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                  >
                    Remember me for 30 days
                  </label>
                </div>

                {/* Sign In Button */}
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined" style={{ animation: "spin 1s linear infinite" }}>
                        progress_activity
                      </span>
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                        arrow_forward
                      </span>
                    </>
                  )}
                </button>
              </form>

              {/* Help/Support */}
              <div
                style={{ marginTop: "2rem", paddingTop: "2rem", borderTop: "1px solid #c3c6d7", textAlign: "center" }}
              >
                <p style={{ fontSize: "0.875rem", color: "#434655", margin: 0 }}>
                  Don't have an account?{" "}
                  <a href="#" style={{ color: "#004ac6", fontWeight: 600, textDecoration: "none" }}>
                    Contact Administrator
                  </a>
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer
          style={{
            background: "#faf8ff",
            borderTop: "1px solid #c3c6d7",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1rem 1.5rem",
            width: "100%",
            position: "relative",
            zIndex: 10,
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 900, color: "#191b23" }}>Mahaga Widya Cita</span>
            <span style={{ fontSize: "11px", fontWeight: 500, color: "#54647a" }}>
              © 2026 PT Mahaga Widya Cita. All rights reserved.
            </span>
          </div>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            <a href="#" style={{ fontSize: "11px", fontWeight: 500, color: "#004ac6", textDecoration: "none" }}>
              Privacy Policy
            </a>
            <a href="#" style={{ fontSize: "11px", fontWeight: 500, color: "#004ac6", textDecoration: "none" }}>
              Terms of Service
            </a>
            <a href="#" style={{ fontSize: "11px", fontWeight: 500, color: "#004ac6", textDecoration: "none" }}>
              Security
            </a>
            <a href="#" style={{ fontSize: "11px", fontWeight: 500, color: "#004ac6", textDecoration: "none" }}>
              Help Center
            </a>
          </div>
        </footer>

        <style
          dangerouslySetInnerHTML={{
            __html: `
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `,
          }}
        />
      </div>
    </>
  );
};
