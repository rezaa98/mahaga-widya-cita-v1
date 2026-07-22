import React from "react";
import { WaveDivider } from "@/components/ui/WaveDivider";

interface PageHeroProps {
  badge?: React.ReactNode;
  title: React.ReactNode;
  titleHighlight?: React.ReactNode;
  description?: React.ReactNode;
  backgroundImageUrl?: string;
  align?: "center" | "left";
  children?: React.ReactNode;
  waveFill?: string;
  className?: string;
}

export function PageHero({
  badge,
  title,
  titleHighlight,
  description,
  backgroundImageUrl,
  align = "center",
  children,
  waveFill = "var(--color-neutral-50)",
  className,
}: PageHeroProps) {
  const isLeft = align === "left";

  return (
    <section
      className={className}
      style={{
        background: backgroundImageUrl
          ? `linear-gradient(135deg, rgba(11, 45, 107, 0.9) 0%, rgba(18, 71, 168, 0.8) 100%), url(${backgroundImageUrl}) center/cover no-repeat`
          : "linear-gradient(135deg, var(--color-primary-900) 0%, var(--color-primary-700) 100%)",
        paddingTop: "calc(72px + 4rem)",
        paddingBottom: "4rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
          pointerEvents: "none",
        }}
      />
      <div className="container" style={{ position: "relative" }}>
        <div
          style={{
            maxWidth: isLeft ? "640px" : "800px",
            margin: isLeft ? "0" : "0 auto",
            textAlign: isLeft ? "left" : "center",
          }}
        >
          {badge && (
            <div
              className="badge"
              style={{
                background: "rgba(255,255,255,0.25)",
                color: "#ffffff",
                fontWeight: "600",
                marginBottom: "1.25rem",
                display: "inline-block",
                backdropFilter: "blur(4px)",
              }}
            >
              {badge}
            </div>
          )}
          <h1 className="text-display" style={{ color: "white", marginBottom: "1rem" }}>
            {title}
            {titleHighlight && (
              <>
                <br />
                <span style={{ color: "var(--color-gold-300)" }}>{titleHighlight}</span>
              </>
            )}
          </h1>
          {description && (
            <p style={{ color: "rgba(255,255,255,0.95)", fontSize: "1.125rem", lineHeight: "1.7", marginBottom: "0" }}>
              {description}
            </p>
          )}
          {children}
        </div>
      </div>

      <WaveDivider fill={waveFill} />
    </section>
  );
}
