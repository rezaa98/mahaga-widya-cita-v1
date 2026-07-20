import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { IconInstagram, IconYoutube, IconLinkedin, IconXTwitter } from "./icons/SocialIcons";

const defaultFooterLinks = {
  company: [
    { label: "Profil Perusahaan", url: "/tentang-kami" },
    { label: "Manajemen", url: "/tentang-kami#manajemen" },
    { label: "Tenaga Ahli", url: "/tentang-kami#ahli" },
    { label: "Mitra", url: "/mitra" },
    { label: "Karir", url: "/karir" },
  ],
  services: [
    { label: "Smart Consulting", url: "/layanan/konsultasi" },
    { label: "Smart Executive Education", url: "/layanan/edukasi" },
    { label: "Smart Software Service", url: "/layanan/software" },
    { label: "Smart Governance Review", url: "/layanan/governance-review" },
    { label: "Smart Online Course", url: "/kursus" },
    { label: "Smart Digital Conference", url: "/webinar" },
  ],
};

const socialIconsMap: Record<string, any> = {
  instagram: IconInstagram,
  youtube: IconYoutube,
  linkedin: IconLinkedin,
  twitter: IconXTwitter,
};

export default async function Footer({ locale = 'id' }: { locale?: string }) {
  const isEn = locale === 'en';
  const payload = await getPayload({ config: configPromise });
  const kontakData = await payload.findGlobal({ slug: "kontak", locale: locale as any });
  let footerData: any = null;
  try {
    footerData = await payload.findGlobal({ slug: "footer", locale: locale as any });
  } catch (e) {
    console.error("Footer global not found, using defaults");
  }
  
  let dynamicServicesLinks: any[] = [];
  try {
    const servicesRes = await payload.find({
      collection: "services",
      locale: locale as any,
      limit: 7,
    });
    dynamicServicesLinks = servicesRes.docs.map(s => ({
      label: s.title,
      url: `/layanan/${s.slug}`,
    }));
  } catch (e) {
    console.error("Failed to fetch services for footer");
  }

  const phone = kontakData?.phone || "+62 21 1234 5678";
  const email = kontakData?.email || "info@mahagawidyacita.co.id";
  const address = kontakData?.address || "Jakarta, Indonesia";

  const companyDesc = footerData?.companyDescription || "Platform terdepan untuk edukasi profesional dan penguatan tata kelola bagi ASN dan profesional Indonesia.";
  const copyrightText = footerData?.copyrightText || "PT Mahaga Widya Cita. Hak Cipta Dilindungi.";
  
  let featureSettings: any = null;
  try {
    featureSettings = await payload.findGlobal({ slug: "pengaturan-fitur" as any });
  } catch (e) {
    // default true
  }
  const isPolicyReviewsEnabled = featureSettings?.enablePolicyReviews !== false;

  let displayCompanyLinks = footerData?.linksCompany?.length > 0 ? footerData.linksCompany : defaultFooterLinks.company;
  let displayServicesLinks = dynamicServicesLinks.length > 0 
    ? dynamicServicesLinks 
    : (footerData?.linksServices?.length > 0 ? footerData.linksServices : defaultFooterLinks.services);

  if (!isPolicyReviewsEnabled) {
    displayCompanyLinks = displayCompanyLinks.filter((l: any) => !l.url?.includes('/policy-reviews') && l.label?.toLowerCase() !== 'policy review');
    displayServicesLinks = displayServicesLinks.filter((l: any) => !l.url?.includes('/policy-reviews') && l.label?.toLowerCase() !== 'policy review');
  }
  
  const displaySocials = footerData?.socialMedia?.length > 0 ? footerData.socialMedia : [
    { platform: "instagram", url: "#" },
    { platform: "youtube", url: "#" },
    { platform: "linkedin", url: "#" },
    { platform: "twitter", url: "#" },
  ];

  return (
    <footer
      style={{
        background: "linear-gradient(180deg, var(--color-primary-900) 0%, #061e4f 100%)",
        color: "rgba(255,255,255,0.85)",
        padding: "4rem 0 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative grid pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)",
          backgroundSize: "32px 32px",
          pointerEvents: "none",
        }}
      />

      <div className="container" style={{ position: "relative" }}>
        {/* Main footer grid */}
        <div
          className="footer-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "3rem",
            marginBottom: "3rem",
          }}
        >
          {/* Brand column */}
          <div style={{ gridColumn: "span 1" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <Image 
                src="/logo-transparent.png" 
                alt="Logo PT Mahaga Widya Cita" 
                width={44} 
                height={44} 
                style={{ objectFit: 'contain' }}
              />
              <div>
                <div
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: "700",
                    fontSize: "1rem",
                    color: "white",
                    lineHeight: "1.2",
                  }}
                >
                  PT Mahaga Widya Cita
                </div>
              </div>
            </div>
            <p style={{ fontSize: "0.875rem", lineHeight: "1.7", marginBottom: "1.5rem", color: "rgba(255,255,255,0.65)", whiteSpace: "pre-line" }}>
              {companyDesc}
            </p>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              {displaySocials.map(({ platform, url }: any) => {
                const Icon = socialIconsMap[platform] || IconInstagram;
                return (
                  <a
                    key={platform}
                    href={url}
                    aria-label={platform}
                    className="footer-social"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: "36px",
                      height: "36px",
                      borderWidth: "1px",
                      borderStyle: "solid",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Perusahaan */}
          <div>
            <h4 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "0.875rem", fontWeight: "600", color: "white", marginBottom: "1.25rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {isEn ? 'Company' : 'Perusahaan'}
            </h4>
            <ul style={{ listStyle: "none" }}>
              {displayCompanyLinks.map((link: any) => (
                <li key={link.label} style={{ marginBottom: "0.625rem" }}>
                  <Link
                    href={(link.url && link.url.startsWith('/')) ? `/${locale}${link.url}` : (link.url || '#')}
                    className="footer-link"
                    style={{ fontSize: "0.875rem" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Layanan */}
          <div>
            <h4 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "0.875rem", fontWeight: "600", color: "white", marginBottom: "1.25rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {isEn ? 'Services' : 'Layanan'}
            </h4>
            <ul style={{ listStyle: "none" }}>
              {displayServicesLinks.map((link: any) => (
                <li key={link.label} style={{ marginBottom: "0.625rem" }}>
                  <Link
                    href={(link.url && link.url.startsWith('/')) ? `/${locale}${link.url}` : (link.url || '#')}
                    className="footer-link"
                    style={{ fontSize: "0.875rem" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h4 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "0.875rem", fontWeight: "600", color: "white", marginBottom: "1.25rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {isEn ? 'Contact' : 'Kontak'}
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {[
                { icon: Phone, text: phone },
                { icon: Mail, text: email },
                { icon: MapPin, text: address },
              ].map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Icon size={14} color="var(--color-primary-300)" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.65)", whiteSpace: "pre-line", lineHeight: "1.5" }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>


        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            padding: "1.25rem 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <p style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.45)", textAlign: "center" }}>
            © {new Date().getFullYear()} {copyrightText}
          </p>
        </div>
      </div>
    </footer>
  );
}
