import { marked } from "marked";

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character] ?? character,
  );

const getSafeUrl = (value: string, baseUrl: string) => {
  if (value.startsWith("#") || value.startsWith("mailto:")) {
    return value;
  }

  try {
    const url = new URL(value, baseUrl);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return url.toString();
    }
  } catch {
    // Invalid URLs are rendered as plain link text.
  }

  return undefined;
};

export const renderSkillMarkdown = async (
  markdown: string,
  baseUrl: string,
) => {
  const content = markdown.startsWith("---")
    ? markdown.split("---").slice(2).join("---").trim()
    : markdown;
  const renderer = new marked.Renderer();

  renderer.html = () => "";
  renderer.image = () => "";
  renderer.link = function ({ href, title, tokens }) {
    const text = this.parser.parseInline(tokens);
    const safeUrl = getSafeUrl(href, baseUrl);

    if (!safeUrl) {
      return text;
    }

    const titleAttribute = title ? ` title="${escapeHtml(title)}"` : "";
    return `<a href="${escapeHtml(safeUrl)}"${titleAttribute}>${text}</a>`;
  };

  return marked.parse(content, {
    renderer,
  });
};
