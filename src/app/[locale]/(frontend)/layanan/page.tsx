import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Building2,
  Calculator,
  CheckCircle2,
  ClipboardList,
  MonitorSmartphone,
  Sparkles,
  TrendingUp,
  UserPlus,
} from "lucide-react";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { selectCorporateServices } from "@/data/serviceCatalog";
import { localizedAlternates } from "@/utils/seo";
import styles from "./page.module.css";

export const revalidate = 300;
type Entry = Record<string, any>;
const serviceIcons: Record<string, typeof CheckCircle2> = {
  "research-strategic-studies": ClipboardList,
  "technology-digital-solutions": MonitorSmartphone,
  "tax-financial-advisory": Calculator,
  "workforce-solutions": UserPlus,
  "business-investment-advisory": TrendingUp,
  "property-management-investment": Building2,
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  return {
    title: isEn ? "Corporate Services" : "Layanan Korporat",
    description: isEn
      ? "Explore strategic studies, digital transformation, financial and tax advisory, talent management, business advisory, and property management solutions."
      : "Temukan solusi kajian strategis, transformasi digital, konsultasi keuangan dan pajak, manajemen talenta, konsultasi bisnis, serta pengelolaan properti.",
    alternates: localizedAlternates(locale, "/layanan"),
  };
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEn = locale === "en";
  const payload = await getPayload({ config: configPromise });
  const result = await payload.find({
    collection: "services",
    locale: locale as "id" | "en",
    fallbackLocale: "none",
    limit: 50,
    depth: 1,
  });
  const services = selectCorporateServices(result.docs as Entry[]);
  const copy = isEn
    ? {
        eyebrow: "Your Next Move",
        title: "Turn possibilities into meaningful progress.",
        description:
          "We help you identify opportunities, make the right move, and develop potential into sustainable value.",
        closing: "Let’s see what’s possible.",
        primary: "Discuss Your Needs",
        secondary: "Explore Our Services",
        sectionLabel: "Our expertise",
        sectionTitle: "Integrated solutions for every stage of growth",
        sectionText:
          "Each service combines strategic thinking, practical execution, and measurable outcomes tailored to your organization.",
        scope: "Core capabilities",
        more: "View Service",
        ctaTitle: "Not sure where to begin?",
        ctaText:
          "Tell us about your challenge. We will help identify the most relevant service and practical next step.",
        cta: "Talk to Our Team",
      }
    : {
        eyebrow: "Your Next Move",
        title: "Ubah peluang menjadi langkah yang berarti.",
        description:
          "Kami membantu Anda melihat peluang, mengambil langkah yang tepat, dan mengembangkan potensi menjadi sesuatu yang bernilai.",
        closing: "Let’s see what’s possible.",
        primary: "Konsultasikan Kebutuhan Anda",
        secondary: "Jelajahi Layanan Kami",
        sectionLabel: "Keahlian kami",
        sectionTitle: "Solusi terintegrasi untuk setiap tahap pertumbuhan",
        sectionText:
          "Setiap layanan memadukan pemikiran strategis, eksekusi praktis, dan hasil terukur yang disesuaikan dengan kebutuhan organisasi Anda.",
        scope: "Kapabilitas utama",
        more: "Lihat Layanan",
        ctaTitle: "Belum yakin harus mulai dari mana?",
        ctaText:
          "Ceritakan tantangan Anda. Kami akan membantu memilih layanan yang relevan dan merumuskan langkah berikutnya.",
        cta: "Diskusikan dengan Tim Kami",
      };

  return (
    <>
      <Navbar />
      <main>
        <section className={styles.hero}>
          <div className={styles.heroGlow} aria-hidden="true" />
          <div className={`container ${styles.heroGrid}`}>
            <div className={styles.heroCopy}>
              <span className={styles.eyebrow}>
                <Sparkles size={16} />
                {copy.eyebrow}
              </span>
              <h1>{copy.title}</h1>
              <p>{copy.description}</p>
              <strong>{copy.closing}</strong>
              <div className={styles.heroActions}>
                <Link href={`/${locale}/kontak?sumber=halaman-layanan`} className={styles.primaryButton}>
                  {copy.primary}
                  <ArrowRight size={18} />
                </Link>
                <a href="#daftar-layanan" className={styles.secondaryButton}>
                  {copy.secondary}
                </a>
              </div>
            </div>
            <div className={styles.heroVisual} aria-hidden="true">
              <div className={styles.visualRing} />
              <div className={styles.visualCardMain}>
                <BarChart3 size={30} />
                <span>Strategy</span>
                <strong>Opportunity → Value</strong>
              </div>
              <div className={styles.visualCardTop}>
                <Sparkles size={20} />
                <span>Insight</span>
              </div>
              <div className={styles.visualCardBottom}>
                <CheckCircle2 size={20} />
                <span>Impact</span>
              </div>
            </div>
          </div>
        </section>
        <section id="daftar-layanan" className={styles.servicesSection}>
          <div className="container">
            <div className={styles.sectionHeading}>
              <span>{copy.sectionLabel}</span>
              <h2>{copy.sectionTitle}</h2>
              <p>{copy.sectionText}</p>
            </div>
            <div className={styles.servicesGrid}>
              {services.map((service: Entry, index: number) => {
                const Icon = serviceIcons[service.slug] || CheckCircle2;
                const features = (service.features ?? []).filter((item: Entry) => item.feature).slice(0, 3);
                return (
                  <article className={styles.serviceCard} key={service.id}>
                    <div className={styles.cardTop}>
                      <span className={styles.iconBox} style={{ color: service.color }}>
                        <Icon size={27} />
                      </span>
                      <span className={styles.cardNumber}>{String(index + 1).padStart(2, "0")}</span>
                    </div>
                    <h2>{service.title}</h2>
                    <p>{service.tagline || service.description}</p>
                    {features.length > 0 && (
                      <div className={styles.featurePreview}>
                        <span>{copy.scope}</span>
                        <ul>
                          {features.map((item: Entry, itemIndex: number) => (
                            <li key={item.id || itemIndex}>{item.feature}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <Link href={`/${locale}/layanan/${service.slug}`}>
                      {copy.more}
                      <ArrowRight size={17} />
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
        <section className={styles.ctaSection}>
          <div className={`container ${styles.ctaCard}`}>
            <div>
              <span>{isEn ? "Start a conversation" : "Mulai percakapan"}</span>
              <h2>{copy.ctaTitle}</h2>
              <p>{copy.ctaText}</p>
            </div>
            <Link href={`/${locale}/kontak?sumber=halaman-layanan`}>
              {copy.cta}
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>
      <Footer locale={locale} />
      <WhatsAppFloat locale={locale} />
    </>
  );
}
