export type SkillsCategory = {
  nameDe: string;
  nameEn: string;
  items: string[];
};

/** Flat, deduped skill tags for the compact home skills section. */
export function skillsCompactTags(categories: SkillsCategory[]): string[] {
  const seen = new Set<string>();
  const tags: string[] = [];
  for (const cat of categories) {
    for (const item of cat.items) {
      if (seen.has(item)) continue;
      seen.add(item);
      tags.push(item);
    }
  }
  return tags;
}
