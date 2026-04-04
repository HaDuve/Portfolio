import { PortfolioHome } from "@/components/PortfolioHome";
import profile from "@/data/profile.json";
import projectsData from "@/data/projects.json";
import skillsData from "@/data/skills.json";
import { isLocale, type Locale } from "@/lib/i18n";
import type { Profile, Project } from "@/types/content";
import { notFound } from "next/navigation";

const projects = projectsData as Project[];
const profileTyped = profile as Profile;

type Props = { params: Promise<{ locale: string }> };

export default async function LocaleHomePage({ params }: Props) {
  const { locale: l } = await params;
  if (!isLocale(l)) {
    notFound();
  }
  const locale = l as Locale;

  return (
    <PortfolioHome
      locale={locale}
      profile={profileTyped}
      projects={projects}
      skillsData={skillsData}
    />
  );
}
