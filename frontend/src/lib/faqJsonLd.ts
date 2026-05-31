import type { FaqItem } from "@/data/appEntwickelnFreelancer";
import type { Locale } from "./i18n";

export function buildFaqJsonLdPayload(items: FaqItem[], locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale === "en" ? "en" : "de-DE",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
