export type Project = {
  id: string;
  title: string;
  slug: string;
  description: string;
  tech: string[];
  imageUrl: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
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
