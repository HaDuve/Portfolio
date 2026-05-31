"use client";

import { SectionHeading } from "@/components/SectionHeading";
import { SectionHeadingReveal } from "@/components/SectionHeadingReveal";

type Props = {
  scrollReveal: boolean;
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionHeadingMotion({
  scrollReveal,
  eyebrow,
  title,
  description,
}: Props) {
  if (!scrollReveal) {
    return (
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        description={description}
      />
    );
  }

  return (
    <SectionHeadingReveal
      eyebrow={eyebrow}
      title={title}
      description={description}
    />
  );
}
