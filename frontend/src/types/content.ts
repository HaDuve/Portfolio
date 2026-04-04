export type Project = {
  id: string;
  title: string;
  slug: string;
  description: string;
  tech: string[];
  imageUrl: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  /** When true, shown as the large featured block above the grid */
  featured?: boolean;
  year?: string;
  role?: string;
};

export type SkillCategory = {
  name: string;
  items: string[];
};

export type SkillsData = {
  categories: SkillCategory[];
};

export type Profile = {
  name: string;
  tagline: string;
  bio: string;
  location: string;
  email: string;
  social: {
    label: string;
    href: string;
  }[];
};
