import type { MarkdownInstance } from "astro";

import { registry } from "./registry";

type SkillFrontmatter = {
  name?: string;
  description?: string;
  label?: string;
};

export type Skill = {
  slug: string;
  pathSlug: string;
  sourceKey?: string;
  sourceLabel?: string;
  name: string;
  label: string;
  description?: string;
  isRegistry?: boolean;
};

const skillModules = import.meta.glob<MarkdownInstance<SkillFrontmatter>>(
  "/skills/*/SKILL.md",
  { eager: true },
);

const titleize = (value: string) =>
  value
    .split("-")
    .map((word) => {
      if (word.toLowerCase() === "ui") {
        return "UI";
      }

      return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
    })
    .join(" ");

const localSkills: Skill[] = Object.entries(skillModules).map(
  ([path, module]) => {
    const slug = path.split("/").at(-2) ?? "";
    const name = module.frontmatter.name ?? slug;

    return {
      slug,
      pathSlug: slug,
      sourceKey: "local",
      sourceLabel: "Local",
      name,
      label: module.frontmatter.label ?? titleize(name),
      description: module.frontmatter.description,
    };
  },
);

const registrySkills: Skill[] = registry
  .filter((s) => !localSkills.some((ls) => ls.pathSlug === s.pathSlug))
  .map((s) => ({
    slug: s.slug,
    pathSlug: s.pathSlug,
    sourceKey: s.sourceKey,
    sourceLabel: s.sourceLabel,
    name: s.name ?? s.slug,
    label: titleize(s.name ?? s.slug),
    description: s.description,
    isRegistry: true,
  }));

export const skills: Skill[] = [...localSkills, ...registrySkills].sort(
  (a, b) => {
    if (a.slug === "baseline-ui") return -1;
    if (b.slug === "baseline-ui") return 1;

    if (!a.isRegistry && b.isRegistry) return -1;
    if (a.isRegistry && !b.isRegistry) return 1;

    return a.pathSlug.localeCompare(b.pathSlug);
  },
);
