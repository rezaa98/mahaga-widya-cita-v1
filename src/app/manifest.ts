import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PT Mahaga Widya Cita",
    short_name: "Mahaga",
    description: "Integrated consulting, technology, research, and human resource development solutions.",
    start_url: "/id",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0B2D6B",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
