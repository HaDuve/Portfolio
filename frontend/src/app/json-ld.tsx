import type { Locale } from "@/lib/i18n";
import { buildSiteJsonLdGraph } from "@/lib/siteJsonLd";

export function JsonLd({ locale }: { locale: Locale }) {
  const payload = {
    "@context": "https://schema.org",
    "@graph": buildSiteJsonLdGraph(locale),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
