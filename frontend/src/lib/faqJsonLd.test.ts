import { describe, it, expect } from "vitest";
import { buildFaqJsonLdPayload } from "./faqJsonLd";

describe("buildFaqJsonLdPayload", () => {
  const items = [
    { question: "Q1?", answer: "A1." },
    { question: "Q2?", answer: "A2." },
  ];

  it("emits FAQPage with de-DE inLanguage for DE", () => {
    const payload = buildFaqJsonLdPayload(items, "de");
    expect(payload["@type"]).toBe("FAQPage");
    expect(payload.inLanguage).toBe("de-DE");
    expect(payload.mainEntity).toHaveLength(2);
    expect(payload.mainEntity[0]).toMatchObject({
      "@type": "Question",
      name: "Q1?",
      acceptedAnswer: { "@type": "Answer", text: "A1." },
    });
  });

  it("emits FAQPage with en inLanguage for EN", () => {
    expect(buildFaqJsonLdPayload(items, "en").inLanguage).toBe("en");
  });
});
