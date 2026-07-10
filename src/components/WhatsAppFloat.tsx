import { MessageCircle } from "lucide-react";
import { getPayload } from "payload";
import configPromise from "@payload-config";

export default async function WhatsAppFloat() {
  const payload = await getPayload({ config: configPromise });
  const kontakData = await payload.findGlobal({ slug: "kontak" });
  
  const rawPhone = kontakData?.phone || "082332567816";
  const waNumber = rawPhone.replace(/\D/g, '').replace(/^0/, '62');
  
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
