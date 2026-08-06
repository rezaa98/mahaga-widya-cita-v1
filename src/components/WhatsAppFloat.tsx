import { MessageCircle } from "lucide-react";
import { getPayload } from "payload";
import configPromise from "@payload-config";

export default async function WhatsAppFloat({ locale = "id" }: { locale?: string }) {
  const isEn = locale === "en";
  const payload = await getPayload({ config: configPromise });
  const kontakData = await payload.findGlobal({
    slug: "kontak",
    locale: locale as "id" | "en",
  });

  const rawPhone = kontakData?.phone || "082332567816";
  const waNumber = rawPhone.replace(/\D/g, "").replace(/^0/, "62");

  const defaultMessage = isEn
    ? "Hello PT Mahaga Widya Cita, I would like to learn more about your services."
    : "Halo PT Mahaga Widya Cita, saya ingin mengetahui lebih lanjut mengenai layanan Anda.";

  const waMessage = encodeURIComponent(kontakData?.whatsappCta?.defaultMessage || defaultMessage);
  const waUrl = `https://wa.me/${waNumber}?text=${waMessage}`;

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label={isEn ? "Contact us via WhatsApp" : "Hubungi kami via WhatsApp"}
      id="whatsapp-float-btn"
    >
      <MessageCircle size={28} fill="white" color="white" />
    </a>
  );
}
