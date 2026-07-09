import React from 'react';

interface WaveDividerProps {
  fill?: string;
  className?: string;
  style?: React.CSSProperties;
  top?: boolean;
}

export const WaveDivider = ({ 
  fill = "var(--color-neutral-50)", 
  className,
  style,
  top = false
}: WaveDividerProps) => {
  return (
    <div style={{ position: "absolute", [top ? "top" : "bottom"]: 0, left: 0, right: 0, lineHeight: 0, transform: top ? "rotate(180deg)" : "none", ...style }} className={className}>
      <svg viewBox="0 0 1440 48" style={{ display: "block", width: "100%", height: "48px" }}>
        <path d="M0,48 L1440,48 L1440,16 Q1080,48 720,24 Q360,0 0,24 Z" fill={fill} />
      </svg>
    </div>
  );
};
