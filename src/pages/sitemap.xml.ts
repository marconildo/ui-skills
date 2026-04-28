import type { APIRoute } from "astro";
import { skills, type Skill } from "../data/skills";

const SITE_URL = "https://ui-skills.com";

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");

const buildGroupPaths = (allSkills: Skill[]) =>
  Array.from(
    new Set(
      allSkills.flatMap((skill) => {
        const segments = skill.pathSlug.split("/");
        if (segments.length <= 1) {
          return [];
        }

        return segments
          .slice(0, -1)
          .map((_, index) => segments.slice(0, index + 1).join("/"));
      }),
    ),
  );

export const GET: APIRoute = ({ site }) => {
  const origin = site?.origin ?? SITE_URL;
  const lastmod = new Date().toISOString();

  const staticRoutes = ["/", "/skills"];
  const groupRoutes = buildGroupPaths(skills).map((path) => `/skills/${path}`);
  const skillRoutes = skills.map((skill) => `/skills/${skill.pathSlug}`);
  const allRoutes = Array.from(new Set([...staticRoutes, ...groupRoutes, ...skillRoutes]));

  const urlset = allRoutes
    .map((route) => {
      const loc = new URL(route, origin).toString();
      return `<url><loc>${escapeXml(loc)}</loc><lastmod>${lastmod}</lastmod></url>`;
    })
    .join("");

  const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlset}</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
