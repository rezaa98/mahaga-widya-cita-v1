"use client";

import Image from "next/image";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  description: string;
  title: string;
};

export const AdminAuthShell = ({ children, description, title }: Props) => (
  <div className="admin-auth-shell">
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
      @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
      .admin-auth-shell { position: fixed; inset: 0; z-index: 1000; display: grid; grid-template-columns: minmax(400px, 44%) 1fr; overflow: auto; background: #f5f8fd; color: #15233b; font-family: Inter,system-ui,sans-serif; }
      .admin-auth-brand { position: relative; min-height: 100vh; overflow: hidden; padding: clamp(36px,5vw,72px); display: flex; flex-direction: column; justify-content: space-between; color: #fff; background: linear-gradient(145deg,#071d47 0%,#0a3f91 52%,#1269d9 100%); }
      .admin-auth-brand::before { content: ''; position: absolute; width: 620px; height: 620px; right: -360px; top: -240px; border-radius: 50%; background: rgba(255,255,255,.09); }
      .admin-auth-brand::after { content: ''; position: absolute; width: 430px; height: 430px; left: -260px; bottom: -210px; border-radius: 50%; border: 1px solid rgba(255,255,255,.2); }
      .admin-auth-grid { position: absolute; inset: 0; opacity: .12; background-image: linear-gradient(rgba(255,255,255,.25) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.25) 1px,transparent 1px); background-size: 48px 48px; mask-image: linear-gradient(to bottom,black,transparent 80%); }
      .admin-auth-brand-inner,.admin-auth-brand-foot { position: relative; z-index: 1; }
      .admin-auth-logo { display: flex; align-items: center; gap: 14px; font-size: 17px; font-weight: 700; letter-spacing: -.02em; }
      .admin-auth-message { max-width: 500px; margin-top: clamp(80px,14vh,160px); }
      .admin-auth-kicker { display: inline-flex; align-items: center; gap: 8px; padding: 8px 12px; border: 1px solid rgba(255,255,255,.24); border-radius: 999px; background: rgba(255,255,255,.1); font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; }
      .admin-auth-message h2 { max-width: 470px; margin: 24px 0 18px; font-size: clamp(40px,4.8vw,68px); line-height: 1.02; letter-spacing: -.055em; }
      .admin-auth-message p { max-width: 450px; margin: 0; color: #d8e7ff; font-size: 15px; line-height: 1.8; }
      .admin-auth-brand-foot { display: flex; align-items: center; gap: 8px; color: #c5d9f8; font-size: 12px; }
      .admin-auth-content { min-height: 100vh; display: grid; place-items: center; padding: clamp(28px,6vw,88px); position: relative; }
      .admin-auth-content::before { content: ''; position: absolute; inset: 0; opacity: .45; background-image: radial-gradient(#bbcae0 .7px,transparent .7px); background-size: 20px 20px; pointer-events: none; }
      .admin-auth-card { position: relative; z-index: 1; width: min(100%,460px); box-sizing: border-box; padding: clamp(28px,4vw,44px); border: 1px solid #dee6f2; border-radius: 22px; background: rgba(255,255,255,.96); box-shadow: 0 30px 80px rgba(27,55,96,.14); }
      .admin-auth-card-logo { width: 58px; height: 58px; margin-bottom: 24px; display: grid; place-items: center; border: 1px solid #e2e9f4; border-radius: 16px; background: #f7faff; }
      .admin-auth-card h1 { margin: 0; color: #142541; font-size: 29px; line-height: 1.2; letter-spacing: -.035em; }
      .admin-auth-description { margin: 10px 0 30px; color: #62718a; font-size: 14px; line-height: 1.7; }
      .admin-auth-form { display: flex; flex-direction: column; gap: 20px; }
      .admin-auth-field { display: flex; flex-direction: column; gap: 8px; }
      .admin-auth-label-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
      .admin-auth-label { color: #33445e; font-size: 11px; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; }
      .admin-auth-link { color: #0759c7; font-size: 12px; font-weight: 650; text-decoration: none; }
      .admin-auth-input-wrap { position: relative; display: flex; align-items: center; }
      .admin-auth-input-icon { position: absolute; left: 14px; z-index: 1; color: #8290a6; font-size: 20px; pointer-events: none; }
      .admin-auth-input { width: 100% !important; height: 50px; box-sizing: border-box !important; padding: 0 44px !important; border: 1px solid #cbd6e5; border-radius: 11px; outline: 0; background: #fff; color: #17233a; font-size: 14px; transition: border-color .2s,box-shadow .2s; }
      .admin-auth-input:focus { border-color: #1263cf; box-shadow: 0 0 0 4px rgba(18,99,207,.11); }
      .admin-auth-trailing { position: absolute; right: 12px; z-index: 1; padding: 4px; display: flex; border: 0; background: transparent; color: #738199; cursor: pointer; }
      .admin-auth-button { width: 100%; height: 50px; display: flex; align-items: center; justify-content: center; gap: 8px; border: 0; border-radius: 11px; background: linear-gradient(135deg,#074da9,#126be0); color: #fff; cursor: pointer; font-size: 13px; font-weight: 700; box-shadow: 0 12px 24px rgba(13,91,193,.23); transition: transform .2s,box-shadow .2s,opacity .2s; }
      .admin-auth-button:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 16px 30px rgba(13,91,193,.3); }
      .admin-auth-button:disabled { cursor: wait; opacity: .7; }
      .admin-auth-error { margin: 0; padding: 11px 13px; border-radius: 9px; background: #fff0ee; color: #a42920; font-size: 12px; line-height: 1.5; }
      .admin-auth-divider { margin-top: 28px; padding-top: 22px; border-top: 1px solid #e2e8f1; text-align: center; color: #6d7b90; font-size: 12px; }
      .admin-auth-success { width: 62px; height: 62px; margin-bottom: 22px; display: grid; place-items: center; border-radius: 18px; background: #eaf4ff; color: #0759c7; }
      .admin-auth-note { margin-top: 20px; padding: 13px 15px; border-radius: 10px; background: #f5f8fc; color: #64738a; font-size: 12px; line-height: 1.6; }
      @keyframes auth-spin { to { transform: rotate(360deg); } } .admin-auth-spin { animation: auth-spin 1s linear infinite; }
      @media (max-width: 900px) { .admin-auth-shell { grid-template-columns: 1fr; } .admin-auth-brand { min-height: auto; padding: 20px 24px; } .admin-auth-message,.admin-auth-brand-foot,.admin-auth-grid { display: none; } .admin-auth-content { min-height: calc(100vh - 84px); padding: 26px 18px 42px; } }
      @media (max-width: 520px) { .admin-auth-card { padding: 28px 22px; border-radius: 18px; } }
    `}</style>

    <aside className="admin-auth-brand">
      <div className="admin-auth-grid" />
      <div className="admin-auth-brand-inner">
        <div className="admin-auth-logo">
          <Image src="/logo-transparent.png" width={48} height={48} alt="PT Mahaga Widya Cita" />
          <span>PT Mahaga Widya Cita</span>
        </div>
        <div className="admin-auth-message">
          <span className="admin-auth-kicker">
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>
              verified_user
            </span>{" "}
            Portal administrator
          </span>
          <h2>Kelola konten. Bangun kepercayaan.</h2>
          <p>
            Ruang kerja terpusat untuk mengelola konten korporat, publikasi, tim, dan pengalaman digital Mahaga Widya
            Cita.
          </p>
        </div>
      </div>
      <div className="admin-auth-brand-foot">
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
          lock
        </span>{" "}
        Akses terenkripsi dan terlindungi
      </div>
    </aside>

    <section className="admin-auth-content">
      <div className="admin-auth-card">
        <div className="admin-auth-card-logo">
          <Image src="/logo-transparent.png" width={46} height={46} alt="Mahaga Widya Cita" />
        </div>
        <h1>{title}</h1>
        <p className="admin-auth-description">{description}</p>
        {children}
      </div>
    </section>
  </div>
);
