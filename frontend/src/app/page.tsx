import { PortfolioHome } from "@/components/PortfolioHome";
import profile from "@/data/profile.json";
import projectsData from "@/data/projects.json";
import skillsData from "@/data/skills.json";
import type { Project } from "@/types/content";

const projects = projectsData as Project[];

export default function Home() {
  return (
    <PortfolioHome profile={profile} projects={projects} skillsData={skillsData} />
  );
}
