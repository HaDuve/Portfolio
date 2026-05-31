import type { FaqItem } from "@/data/appEntwickelnFreelancer";
import { buildFaqJsonLdPayload } from "@/lib/faqJsonLd";
import type { Locale } from "@/lib/i18n";

type Props = { items: FaqItem[]; locale: Locale };

export function FaqJsonLd({ items, locale }: Props) {
  const payload = buildFaqJsonLdPayload(items, locale);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
