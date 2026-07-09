import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PT Mahaga Widya Cita",
    short_name: "Mahaga",
    description: "Mitra Terpercaya untuk Edukasi dan Tata Kelola Profesional Indonesia.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0B2D6B",
    icons: [
      {
        src: "/icon",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
