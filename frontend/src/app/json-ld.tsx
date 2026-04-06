import profile from "@/data/profile.json";
import type { Locale } from "@/lib/i18n";
import type { Profile } from "@/types/content";

const BASE = "https://hannesduve.com";

export function JsonLd({ locale }: { locale: Locale }) {
  const p = profile as Profile;
  const isEn = locale === "en";

  const personJob = isEn
    ? "Freelance Senior Full-Stack and Mobile Developer"
    : "Freelance Senior Full-Stack- und Mobile-Entwickler";

  const websiteDesc = isEn
    ? "Web and mobile apps (React Native/Expo) and full-stack development for SMEs in the DACH region."
    : "Web-Apps, Mobile Apps (React Native/Expo) und Full-Stack-Entwicklung für KMU im DACH-Raum.";

  const serviceName = isEn
    ? "Hannes Duve — Software development"
    : "Hannes Duve — Softwareentwicklung";

  const serviceDesc = isEn
    ? "Websites, web applications, mobile apps, and full-stack systems for small and medium businesses."
    : "Entwicklung von Websites, Webanwendungen, Mobile Apps und Full-Stack-Systemen für kleine und mittlere Unternehmen.";

  const serviceTypes = isEn
    ? [
        "Web development",
        "Website development",
        "Mobile app development",
        "Backend development",
        "Full-stack development",
        "React",
        "Next.js",
        "React Native",
        "Expo",
      ]
    : [
        "Webentwicklung",
        "Website erstellen",
        "App-Entwicklung",
        "Mobile App Entwicklung",
        "Backend-Entwicklung",
        "Full-Stack-Entwicklung",
        "React",
        "Next.js",
        "React Native",
        "Expo",
      ];

  const graph = [
    {
      "@type": "Person",
      "@id": `${BASE}/#person`,
      name: p.name,
      url: `${BASE}/${locale}/`,
      image: `${BASE}/profile.jpg`,
      email: p.email,
      jobTitle: personJob,
      knowsLanguage: ["de", "en"],
      sameAs: p.social.map((s) => s.href),
    },
    {
      "@type": "WebSite",
      "@id": `${BASE}/#website`,
      url: `${BASE}/${locale}/`,
      name: "Hannes Duve — Freelance Full-Stack & Mobile",
      description: websiteDesc,
      inLanguage: isEn ? ["en", "de-DE"] : ["de-DE", "en"],
      publisher: { "@id": `${BASE}/#person` },
    },
    {
      "@type": "ProfessionalService",
      "@id": `${BASE}/#service`,
      name: serviceName,
      url: `${BASE}/${locale}/`,
      description: serviceDesc,
      provider: { "@id": `${BASE}/#person` },
      priceRange: isEn
        ? "€60–€4800 depending on engagement"
        : "60–4800 € je nach Auftrag",
      areaServed: [
        { "@type": "Country", name: "Germany" },
        { "@type": "Country", name: "Austria" },
        { "@type": "Country", name: "Switzerland" },
      ],
      serviceType: serviceTypes,
    },
  ];

  const payload = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
