import { describe, it, expect } from "vitest";
import { siteChromeCopy } from "./siteChromeCopy";

describe("siteChromeCopy — header CTA", () => {
  it("uses Gespräch buchen with header placement in DE", () => {
    const chrome = siteChromeCopy("de");
    expect(chrome.headerCta.label).toBe("Gespräch buchen");
    expect(chrome.headerCta.placement).toBe("header");
  });

  it("uses Book a call with header placement in EN", () => {
    const chrome = siteChromeCopy("en");
    expect(chrome.headerCta.label).toBe("Book a call");
    expect(chrome.headerCta.placement).toBe("header");
  });
});

describe("siteChromeCopy — mobile nav CTAs", () => {
  it("maps dual mobile CTAs to hero placements", () => {
    const de = siteChromeCopy("de");
    expect(de.mobileFreelanceCta.placement).toBe("hero-freelance");
    expect(de.mobileCoachingCta.placement).toBe("hero-coaching");
    expect(de.mobileFreelanceCta.label).toBe("Projekt anfragen");
    expect(de.mobileCoachingCta.label).toBe("Coaching buchen");
  });
});

describe("siteChromeCopy — contact", () => {
  it("maps split contact CTAs to offering-aware placements in DE", () => {
    const contact = siteChromeCopy("de").contact;
    expect(contact.freelanceCta.placement).toBe("contact-freelance");
    expect(contact.coachingCta.placement).toBe("contact-coaching");
    expect(contact.freelanceCta.label).toBe("Projekt anfragen");
    expect(contact.coachingCta.label).toBe("Coaching buchen");
  });

  it("uses EN contact lane copy", () => {
    const contact = siteChromeCopy("en").contact;
    expect(contact.title).toBe("Book a call");
    expect(contact.freelanceLaneTitle).toBe("Request a project");
    expect(contact.coachingLaneTitle).toBe("Book coaching");
  });
});

describe("siteChromeCopy — skills", () => {
  it("uses compact skills heading copy in DE", () => {
    const skills = siteChromeCopy("de").skills;
    expect(skills.title).toBe("Was ich in Projekten einsetze");
    expect(skills.eyebrow).toBe("Stack");
  });
});
