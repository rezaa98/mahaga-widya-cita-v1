import React from "react";
import Image from "next/image";

export const Icon = () => {
  return (
    <Image
      src="/logo-icon.png"
      alt="Mahaga Widya Cita Icon"
      width={28}
      height={28}
      style={{ height: "28px", width: "28px", objectFit: "contain", display: "block" }}
    />
  );
};
