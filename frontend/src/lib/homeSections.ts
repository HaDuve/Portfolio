/** Section ids removed from the home page by ADR-0002 / issue #5. */
export const REMOVED_HOME_SECTION_IDS = [
  "app-entwickeln",
  "zusammenarbeit",
  "ablauf",
] as const;

/** Section ids rendered on the locale home page (scroll targets + scroll-spy). */
export const HOME_PAGE_SECTION_IDS = [
  "hero",
  "hub",
  "freelance",
  "coaching",
  "projects",
  "skills",
  "contact",
] as const;

export type HomePageSectionId = (typeof HOME_PAGE_SECTION_IDS)[number];

export type HomeNavSection = {
  hash: HomePageSectionId;
  labelDe: string;
  labelEn: string;
  id: HomePageSectionId;
};

/** Sticky header nav + scroll-spy — must match ids on the home layout. */
export const HOME_NAV_SECTIONS: readonly HomeNavSection[] = [
  { hash: "hero", labelDe: "Start", labelEn: "Start", id: "hero" },
  {
    hash: "hub",
    labelDe: "Angebote",
    labelEn: "Explore",
    id: "hub",
  },
  {
    hash: "freelance",
    labelDe: "Freelance",
    labelEn: "Freelance",
    id: "freelance",
  },
  {
    hash: "coaching",
    labelDe: "Coaching",
    labelEn: "Coaching",
    id: "coaching",
  },
  {
    hash: "projects",
    labelDe: "Projekte",
    labelEn: "Projects",
    id: "projects",
  },
  { hash: "skills", labelDe: "Stack", labelEn: "Stack", id: "skills" },
  {
    hash: "contact",
    labelDe: "Kontakt",
    labelEn: "Contact",
    id: "contact",
  },
];
