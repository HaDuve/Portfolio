import type { ServiceLandingBodySection } from "@/components/ServiceLandingPage";

export const COACHING_TOOLS_SECTION_ID = "tools" as const;

type FreelanceSectionCopy = {
  stackTitle: string;
  stack: string;
  fitTitle: string;
  fit: string;
  processTitle: string;
  processSteps: readonly string[];
};

type CoachingSectionCopy = {
  toolsTitle: string;
  tools: string;
  fitTitle: string;
  fit: string;
  alsoFit: string;
  processTitle: string;
  processSteps: readonly string[];
};

export function freelanceLandingSections(
  copy: FreelanceSectionCopy,
): ServiceLandingBodySection[] {
  return [
    {
      id: "stack",
      title: copy.stackTitle,
      paragraphs: [copy.stack],
    },
    {
      id: "fit",
      title: copy.fitTitle,
      paragraphs: [copy.fit],
    },
    {
      id: "process",
      title: copy.processTitle,
      steps: copy.processSteps,
    },
  ];
}

export function coachingLandingSections(
  copy: CoachingSectionCopy,
): ServiceLandingBodySection[] {
  return [
    {
      id: COACHING_TOOLS_SECTION_ID,
      title: copy.toolsTitle,
      paragraphs: [copy.tools],
    },
    {
      id: "fit",
      title: copy.fitTitle,
      paragraphs: [copy.fit, copy.alsoFit],
    },
    {
      id: "process",
      title: copy.processTitle,
      steps: copy.processSteps,
    },
  ];
}

export const COACHING_TOOL_LABELS = ["Cursor", "Claude"] as const;
