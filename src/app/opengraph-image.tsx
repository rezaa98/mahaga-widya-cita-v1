import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "PT Mahaga Widya Cita";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0B2D6B, #061e4f)",
          padding: "80px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "120px",
            height: "120px",
            background: "linear-gradient(135deg, #D4AF37, #A07508)",
            borderRadius: "30px",
            color: "white",
            fontSize: "64px",
            fontWeight: 800,
            fontFamily: "sans-serif",
            marginBottom: "40px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
          }}
        >
          M
        </div>
        <h1
          style={{
            fontSize: "72px",
            fontWeight: 800,
            color: "white",
            lineHeight: 1.1,
            fontFamily: "sans-serif",
            marginBottom: "20px",
          }}
        >
          PT Mahaga Widya Cita
        </h1>
        <p
          style={{
            fontSize: "36px",
            color: "rgba(255,255,255,0.8)",
            lineHeight: 1.4,
            fontFamily: "sans-serif",
          }}
        >
          Mitra Terpercaya untuk Edukasi dan Tata Kelola Profesional Indonesia
        </p>
      </div>
    ),
    { ...size }
  );
}
