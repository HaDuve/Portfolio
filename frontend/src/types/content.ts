export type Project = {
  id: string;
  /** Primary (German) title */
  title: string;
  titleEn?: string;
  slug: string;
  /** Primary (German) description */
  description: string;
  descriptionEn?: string;
  tech: string[];
  imageUrl: string | null;
  /** App screenshots (portrait phone) vs web; drives image fit and framing in the card */
  mediaKind?: "app" | "web";
  githubUrl: string | null;
  liveUrl: string | null;
  /** When true, shown as the large featured block above the grid */
  featured?: boolean;
  year?: string;
  /** Shown as secondary line (German preferred) */
  role?: string;
  roleEn?: string;
  /** Image alt text for SEO / a11y (German primary) */
  imageAltDe?: string;
  imageAltEn?: string;
};

export type SkillCategory = {
  nameDe: string;
  nameEn: string;
  items: string[];
};

export type SkillsData = {
  categories: SkillCategory[];
};

export type Profile = {
  name: string;
  taglineDe: string;
  taglineEn: string;
  bioDe: string;
  bioEn: string;
  locationDe: string;
  locationEn: string;
  email: string;
  /** Cal.com / Calendly / etc. — shown as primary CTA */
  schedulingUrl: string;
  social: {
    label: string;
    href: string;
  }[];
};
