// Kept apart from lib/blog.ts so client components can format dates and slugs
// without pulling the build-time WordPress fetching into the browser bundle.
const DATE_FORMAT = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "America/Sao_Paulo",
});

export function formatDate(date: string) {
  return DATE_FORMAT.format(new Date(date));
}

export function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}
