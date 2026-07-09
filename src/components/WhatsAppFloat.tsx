"use client";
import { MessageCircle } from "lucide-react";

export default function WhatsAppFloat() {
  const waNumber = "6221123456789";
  const waMessage = encodeURIComponent(
    "Halo PT Mahaga Widya Cita, saya ingin mengetahui lebih lanjut mengenai layanan Anda."
  );
  const waUrl = `https://wa.me/${waNumber}?text=${waMessage}`;

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Hubungi kami via WhatsApp"
      id="whatsapp-float-btn"
    >
      <MessageCircle size={28} fill="white" color="white" />
    </a>
  );
}
