import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Compass,
  Cpu,
  Database,
  GraduationCap,
  Landmark,
  Layers3,
  Lightbulb,
  MessageSquare,
  Network,
  Rocket,
  Route,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { selectCorporateServices } from "@/data/serviceCatalog";
import { localizedAlternatesForLocales } from "@/utils/seo";
import styles from "./page.module.css";

export const revalidate = 300;
type Entry = Record<string, any>;
const capabilityIcons = [Layers3, Network, Cpu, BarChart3, Database, ShieldCheck];
const audienceIcons = [Building2, Landmark, Users, GraduationCap];

function mediaValue(value: unknown): { url?: string | null; alt?: string | null } | null {
  return value && typeof value === "object" ? (value as { url?: string | null; alt?: string | null }) : null;
}

function contactHref(locale: string, service: Entry) {
  const query = new URLSearchParams({ layanan: service.title, sumber: service.slug });
  return `/${locale}/kontak?${query.toString()}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const isEn = locale === "en";
  const payload = await getPayload({ config: configPromise });
  const result = await payload.find({
    collection: "services",
    where: { slug: { equals: slug } },
    locale: locale as "id" | "en",
    fallbackLocale: "none",
    limit: 1,
    depth: 1,
  });
  const service = result.docs[0] as Entry | undefined;
  if (!service) return { title: isEn ? "Service Not Found" : "Layanan Tidak Ditemukan" };
  const title = service.meta?.title || `${service.title} | Mahaga Widya Cita`;
  const description = service.meta?.description || service.description;
  const image = mediaValue(service.meta?.image);
  const alternate = await payload.find({
    collection: "services",
    where: { slug: { equals: service.slug } },
    locale: (isEn ? "id" : "en") as "id" | "en",
    fallbackLocale: "none",
    limit: 1,
    depth: 0,
  });
  const locales = alternate.docs[0]?.title ? [locale, isEn ? "id" : "en"] : [locale];
  return {
    title,
    description,
    alternates: localizedAlternatesForLocales(locale, `/layanan/${service.slug}`, locales),
    openGraph: {
      title,
      description,
      url: `https://www.mahagawidyacita.com/${locale}/layanan/${service.slug}`,
      type: "website",
      images: image?.url ? [{ url: image.url, width: 1200, height: 630, alt: image.alt || service.title }] : [],
    },
    twitter: { card: "summary_large_image", title, description, images: image?.url ? [image.url] : [] },
  };
}

export default async function ServiceDetail({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  if (slug === "human-capital-development") redirect(`/${locale}/layanan/property-management-investment`);
  const isEn = locale === "en";
  const payload = await getPayload({ config: configPromise });
  const [serviceResult, relatedResult] = await Promise.all([
    payload.find({
      collection: "services",
      where: { slug: { equals: slug } },
      locale: locale as "id" | "en",
      fallbackLocale: "none",
      limit: 1,
      depth: 1,
    }),
    payload.find({
      collection: "services",
      where: { slug: { not_equals: slug } },
      locale: locale as "id" | "en",
      fallbackLocale: "none",
      limit: 20,
      sort: "title",
      depth: 0,
    }),
  ]);
  const service = serviceResult.docs[0] as Entry | undefined;
  if (!service) notFound();

  const features = (service.features ?? []).filter((item: Entry) => item.feature || item.title || item.text);
  const benefits = (service.benefits ?? []).filter((item: Entry) => item.title || item.desc);
  const audiences = (service.targetAudience ?? []).filter((item: Entry) => item.audience);
  const heroImage = mediaValue(service.meta?.image);
  const consultationHref = contactHref(locale, service);
  const processSteps = isEn
    ? [
        { icon: Search, title: "Assessment", text: "We map your needs, challenges, and current capabilities." },
        {
          icon: Route,
          title: "Solution roadmap",
          text: "We define priorities, scope, milestones, and measurable outcomes.",
        },
        {
          icon: Rocket,
          title: "Implementation",
          text: "Our specialists deliver the solution through focused collaboration.",
        },
        {
          icon: ClipboardCheck,
          title: "Evaluation",
          text: "We measure impact and identify the next improvement opportunities.",
        },
      ]
    : [
        {
          icon: Search,
          title: "Asesmen kebutuhan",
          text: "Kami memetakan kebutuhan, tantangan, dan kapabilitas yang tersedia.",
        },
        {
          icon: Route,
          title: "Roadmap solusi",
          text: "Kami menyusun prioritas, ruang lingkup, tahapan, dan hasil terukur.",
        },
        {
          icon: Rocket,
          title: "Implementasi",
          text: "Tim spesialis menjalankan solusi melalui kolaborasi yang terarah.",
        },
        {
          icon: ClipboardCheck,
          title: "Evaluasi",
          text: "Kami mengukur dampak dan merumuskan peluang pengembangan berikutnya.",
        },
      ];
  const copy = isEn
    ? {
        badge: "Corporate Solution",
        primary: "Discuss Your Needs",
        secondary: "Explore Our Approach",
        visualLabel: "Integrated approach",
        visualTitle: "From challenge to measurable impact",
        scope: "Service scope",
        overview: "Capabilities designed around your organization",
        overviewText:
          "Every engagement is tailored to your objectives, operating context, and organizational readiness.",
        capabilities: "Key capabilities",
        benefits: "Benefits for your organization",
        value: "Expected value",
        approach: "How we work",
        approachTitle: "A clear path from discovery to impact",
        approachText: "A structured yet adaptable approach keeps stakeholders aligned throughout the engagement.",
        suited: "Best suited for",
        audienceTitle: "Organizations we can support",
        explore: "Explore more",
        related: "Related corporate services",
        link: "View service",
        all: "All services",
        ctaTitle: "Ready to discuss the right solution?",
        ctaText:
          "Tell us about your goals and challenges. Our team will help define a practical next step for your organization.",
        cta: "Contact Our Consultants",
      }
    : {
        badge: "Solusi Korporat",
        primary: "Konsultasikan Kebutuhan Anda",
        secondary: "Pelajari Pendekatan Kami",
        visualLabel: "Pendekatan terintegrasi",
        visualTitle: "Dari tantangan menjadi dampak terukur",
        scope: "Ruang lingkup layanan",
        overview: "Kapabilitas yang dirancang sesuai kebutuhan organisasi",
        overviewText:
          "Setiap pendampingan disesuaikan dengan tujuan, konteks operasional, dan kesiapan organisasi Anda.",
        capabilities: "Kapabilitas utama",
        benefits: "Manfaat bagi organisasi Anda",
        value: "Nilai yang dihasilkan",
        approach: "Cara kami bekerja",
        approachTitle: "Tahapan yang jelas dari asesmen hingga dampak",
        approachText: "Pendekatan yang terstruktur dan adaptif menjaga seluruh pemangku kepentingan tetap selaras.",
        suited: "Cocok untuk",
        audienceTitle: "Organisasi yang dapat kami dukung",
        explore: "Jelajahi layanan",
        related: "Solusi korporat lainnya",
        link: "Lihat layanan",
        all: "Semua layanan",
        ctaTitle: "Siap mendiskusikan solusi yang tepat?",
        ctaText:
          "Ceritakan tujuan dan tantangan Anda. Tim kami akan membantu merumuskan langkah berikutnya yang realistis.",
        cta: "Hubungi Konsultan Kami",
      };
  const relatedServices = selectCorporateServices(relatedResult.docs).slice(0, 3);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    url: `https://www.mahagawidyacita.com/${locale}/layanan/${service.slug}`,
    provider: { "@type": "Organization", name: "PT Mahaga Widya Cita", url: "https://www.mahagawidyacita.com" },
    areaServed: { "@type": "Country", name: "Indonesia" },
  };

  return (
    <>
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
      />
      <main>
        <section className={styles.hero} style={{ background: service.gradient }}>
          <div className={styles.heroGlow} aria-hidden="true" />
          <div className={`container ${styles.heroInner}`}>
            <Breadcrumbs
              locale={locale}
              isDarkBg
              items={[{ label: isEn ? "Services" : "Layanan", href: `/${locale}/layanan` }, { label: service.title }]}
            />
            <div className={styles.heroGrid}>
              <div className={styles.heroCopy}>
                <span className={styles.eyebrowLight}>
                  <Sparkles size={15} />
                  {copy.badge}
                </span>
                <h1>{service.title}</h1>
                <p className={styles.tagline}>{service.tagline}</p>
                {service.description && service.description !== service.tagline && (
                  <p className={styles.description}>{service.description}</p>
                )}
                <div className={styles.heroActions}>
                  <Link href={consultationHref} className={styles.primaryButton}>
                    {copy.primary}
                    <ArrowRight size={18} />
                  </Link>
                  <a href="#pendekatan" className={styles.secondaryButton}>
                    {copy.secondary}
                  </a>
                </div>
              </div>
              <div className={styles.heroVisual} aria-label={copy.visualTitle}>
                {heroImage?.url ? (
                  <Image
                    src={heroImage.url}
                    alt={heroImage.alt || service.title}
                    className={styles.heroImage}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 45vw"
                  />
                ) : (
                  <div className={styles.visualCanvas} aria-hidden="true">
                    <div className={styles.visualOrbit} />
                    <div className={`${styles.visualCard} ${styles.visualCardMain}`}>
                      <Target size={26} />
                      <span>{copy.visualLabel}</span>
                      <strong>{service.title}</strong>
                    </div>
                    <div className={`${styles.visualCard} ${styles.visualCardTop}`}>
                      <Lightbulb size={21} />
                      <span>Insight</span>
                    </div>
                    <div className={`${styles.visualCard} ${styles.visualCardBottom}`}>
                      <BarChart3 size={21} />
                      <span>Impact</span>
                    </div>
                  </div>
                )}
                <div className={styles.visualCaption}>
                  <CheckCircle2 size={19} />
                  <span>{copy.visualTitle}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <nav className={styles.sectionNav} aria-label={isEn ? "Service page sections" : "Bagian halaman layanan"}>
          <div className="container">
            <a href="#kapabilitas">{copy.capabilities}</a>
            <a href="#pendekatan">{copy.approach}</a>
            {benefits.length > 0 && <a href="#manfaat">{copy.benefits}</a>}
            {audiences.length > 0 && <a href="#audiens">{copy.suited}</a>}
          </div>
        </nav>

        <section id="kapabilitas" className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeading}>
              <span className={styles.eyebrow}>{copy.scope}</span>
              <h2>{copy.overview}</h2>
              <p>{copy.overviewText}</p>
            </div>
            {features.length > 0 && (
              <div className={styles.capabilityGrid}>
                {features.map((feature: Entry, index: number) => {
                  const Icon = capabilityIcons[index % capabilityIcons.length];
                  return (
                    <article className={styles.capabilityCard} key={feature.id || index}>
                      <div className={styles.iconBox} style={{ color: service.color }}>
                        <Icon size={25} />
                      </div>
                      <span className={styles.cardNumber}>{String(index + 1).padStart(2, "0")}</span>
                      <h3>{feature.feature || feature.title || feature.text}</h3>
                      {feature.description && <p>{feature.description}</p>}
                    </article>
                  );
                })}
              </div>
            )}
            {benefits.length > 0 && (
              <div id="manfaat" className={styles.benefitPanel}>
                <div className={styles.benefitIntro}>
                  <span className={styles.eyebrow}>{copy.value}</span>
                  <h2>{copy.benefits}</h2>
                </div>
                <div className={styles.benefitList}>
                  {benefits.map((benefit: Entry, index: number) => (
                    <article key={benefit.id || index}>
                      <CheckCircle2 size={22} style={{ color: service.color }} />
                      <div>
                        <h3>{benefit.title}</h3>
                        {(benefit.desc || benefit.description) && <p>{benefit.desc || benefit.description}</p>}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <section id="pendekatan" className={`${styles.section} ${styles.processSection}`}>
          <div className="container">
            <div className={styles.sectionHeading}>
              <span className={styles.eyebrow}>{copy.approach}</span>
              <h2>{copy.approachTitle}</h2>
              <p>{copy.approachText}</p>
            </div>
            <div className={styles.processGrid}>
              {processSteps.map(({ icon: Icon, title, text }, index) => (
                <article className={styles.processCard} key={title}>
                  <span className={styles.processNumber}>{String(index + 1).padStart(2, "0")}</span>
                  <div className={styles.processIcon}>
                    <Icon size={23} />
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  {index < processSteps.length - 1 && (
                    <ChevronRight className={styles.processArrow} aria-hidden="true" />
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        {audiences.length > 0 && (
          <section id="audiens" className={styles.audienceSection}>
            <div className="container">
              <div className={styles.audienceLayout}>
                <div>
                  <span className={styles.eyebrowLight}>{copy.suited}</span>
                  <h2>{copy.audienceTitle}</h2>
                </div>
                <div className={styles.audienceGrid}>
                  {audiences.map((item: Entry, index: number) => {
                    const Icon = audienceIcons[index % audienceIcons.length];
                    return (
                      <article key={item.id || index}>
                        <Icon size={22} />
                        <span>{item.audience}</span>
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {relatedServices.length > 0 && (
          <section className={styles.relatedSection}>
            <div className="container">
              <div className={styles.relatedHeader}>
                <div>
                  <span className={styles.eyebrow}>{copy.explore}</span>
                  <h2>{copy.related}</h2>
                </div>
                <Link href={`/${locale}/layanan`}>
                  {copy.all}
                  <ArrowRight size={17} />
                </Link>
              </div>
              <div className={styles.relatedGrid}>
                {relatedServices.map((item: Entry) => (
                  <Link href={`/${locale}/layanan/${item.slug}`} className={styles.relatedCard} key={item.id}>
                    <span className={styles.relatedIcon}>
                      <Compass size={22} />
                    </span>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.tagline || item.description}</p>
                      <span>
                        {copy.link}
                        <ArrowRight size={16} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className={styles.ctaSection}>
          <div className="container">
            <div className={styles.ctaCard} style={{ background: service.gradient }}>
              <div className={styles.ctaIcon}>
                <MessageSquare size={28} />
              </div>
              <div>
                <h2>{copy.ctaTitle}</h2>
                <p>{copy.ctaText}</p>
              </div>
              <Link href={consultationHref}>
                {copy.cta}
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer locale={locale} />
      <WhatsAppFloat locale={locale} />
    </>
  );
}
