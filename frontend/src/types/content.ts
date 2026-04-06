export type ProjectMediaItem = {
  src: string;
  altDe?: string;
  altEn?: string;
};

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
  /** One or more images; carousel in the card when length > 1 */
  media: ProjectMediaItem[];
  /** App screenshots (portrait phone) vs web; drives image fit and framing in the card */
  mediaKind?: "app" | "web";
  githubUrl: string | null;
  liveUrl: string | null;
  /** Google Play or secondary store link (shown when set) */
  playStoreUrl?: string | null;
  /** When true, shown as the large featured block above the grid */
  featured?: boolean;
  year?: string;
  /** Shown as secondary line (German preferred) */
  role?: string;
  roleEn?: string;
};

/** Shape of `projects.json` before normalization (legacy `imageUrl` + optional `media`) */
export type RawProject = Omit<Project, "media"> & {
  media?: ProjectMediaItem[];
  imageUrl?: string | null;
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
  /** Public headshot under /public (e.g. /profile.jpg) */
  portraitSrc?: string;
  phone?: string;
  addressDe?: string;
  addressEn?: string;
  /** Short ballpark rates for freelancers (HTML-free plain text) */
  ratesDe?: string;
  ratesEn?: string;
  social: {
    label: string;
    href: string;
  }[];
};
