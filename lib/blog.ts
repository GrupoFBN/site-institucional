// Blog content lives in content/posts.json, the store the admin panel
// reads and writes. On first run it is seeded from content/blog.json — the
// snapshot of the old WordPress (`npm run blog:sync`) — so the ~190
// existing posts are there from day one. Public pages only see published
// posts; the admin sees drafts too. Server-only (touches the filesystem).
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { slugify } from "./blog-format";
import { renderCtasInHtml } from "./cta";

export { slugify };

export const BLOG_ORIGIN = new URL(
  process.env.BLOG_API_URL ?? "https://blog.grupofbn.com.br/wp-json/wp/v2",
).origin;

export type BlogCategory = { id: number; name: string; slug: string; count: number };

export type BlogImage = { src: string; width: number; height: number; alt: string };

export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  date: string;
  readMinutes: number;
  categories: { name: string; slug: string }[];
  image: BlogImage | null;
  // Same image at card size, so the listing doesn't ship full-size PNGs.
  cardImage: BlogImage | null;
  contentHtml: string;
  // Set in the admin when the article carries its own CTAs mid-text.
  hideEndCta?: boolean;
};

// What the listing page needs — no article body, so the 190-post list
// serialized into the page stays small.
export type BlogPostSummary = Omit<BlogPost, "contentHtml" | "description" | "image">;

type WpSize = { source_url: string; width: number; height: number };
type WpMedia = {
  source_url: string;
  alt_text?: string;
  media_details?: { width: number; height: number; sizes?: Record<string, WpSize> };
};
type WpTerm = { id: number; name: string; slug: string; taxonomy: string };
type WpPost = {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  yoast_head_json?: { og_description?: string; description?: string };
  _embedded?: { "wp:featuredmedia"?: WpMedia[]; "wp:term"?: WpTerm[][] };
};

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#039;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
  "&hellip;": "…",
  "&ndash;": "–",
  "&mdash;": "—",
  "&rsquo;": "’",
  "&lsquo;": "‘",
  "&rdquo;": "”",
  "&ldquo;": "“",
};

function decodeEntities(text: string) {
  return text
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&[a-z]+;|&#039;/gi, (entity) => ENTITIES[entity.toLowerCase()] ?? entity);
}

function plainText(html: string) {
  return decodeEntities(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

function pickImage(media: WpMedia | undefined, preferred: string[]): BlogImage | null {
  if (!media?.source_url) return null;
  const sizes = media.media_details?.sizes ?? {};
  const alt = media.alt_text ?? "";
  for (const key of preferred) {
    const size = sizes[key];
    if (size) return { src: size.source_url, width: size.width, height: size.height, alt };
  }
  return {
    src: media.source_url,
    width: media.media_details?.width ?? 1200,
    height: media.media_details?.height ?? 675,
    alt,
  };
}

export function toPost(raw: WpPost): BlogPost {
  const media = raw._embedded?.["wp:featuredmedia"]?.[0];
  const terms = raw._embedded?.["wp:term"]?.flat() ?? [];
  const content = raw.content.rendered;
  const words = plainText(content).split(" ").length;
  const excerpt = plainText(raw.excerpt.rendered);
  return {
    id: raw.id,
    slug: raw.slug,
    title: plainText(raw.title.rendered),
    excerpt,
    description: raw.yoast_head_json?.og_description ?? raw.yoast_head_json?.description ?? excerpt,
    date: raw.date,
    readMinutes: Math.max(1, Math.round(words / 200)),
    categories: terms
      .filter((term) => term.taxonomy === "category")
      .map((term) => ({ name: decodeEntities(term.name), slug: term.slug })),
    image: pickImage(media, ["large", "full"]),
    cardImage: pickImage(media, ["medium_large", "large", "full"]),
    contentHtml: content,
  };
}

export type PostStatus = "draft" | "published";
export type StoredPost = BlogPost & { status: PostStatus };

const STORE_FILE = path.join(process.cwd(), "content", "posts.json");
const SEED_FILE = path.join(process.cwd(), "content", "blog.json");

async function seed(): Promise<StoredPost[]> {
  let json: string;
  try {
    json = await readFile(SEED_FILE, "utf8");
  } catch {
    // No snapshot either: start with an empty blog instead of failing.
    return [];
  }
  return (JSON.parse(json) as WpPost[]).map((raw) => ({ ...toPost(raw), status: "published" as const }));
}

// Re-read on every call (no memo): edits made in the admin have to show up
// on the very next page view, and parsing ~2 MB takes a few milliseconds.
export async function readStore(): Promise<StoredPost[]> {
  try {
    return JSON.parse(await readFile(STORE_FILE, "utf8")) as StoredPost[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    const posts = await seed();
    await writeStore(posts);
    return posts;
  }
}

// Write to a temp file and rename, so a crash mid-write can't leave a
// half-written posts.json behind.
export async function writeStore(posts: StoredPost[]) {
  await mkdir(path.dirname(STORE_FILE), { recursive: true });
  const temp = `${STORE_FILE}.tmp`;
  await writeFile(temp, JSON.stringify(posts));
  await rename(temp, STORE_FILE);
}

function newestFirst(posts: StoredPost[]) {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date));
}

// Post dates are naive local timestamps ("2026-10-05T12:00:00", the same
// shape WordPress gave us), so "now" is São Paulo wall-clock time too.
export function nowLocal() {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
    .format(new Date())
    .replace(" ", "T");
}

// The editor is admin-only, but the HTML is published to everyone, so the
// obvious script vectors are stripped on save anyway.
export function sanitizeHtml(html: string) {
  return html
    .replace(/<\s*(script|iframe|object|embed|style)[\s\S]*?<\s*\/\s*\1\s*>/gi, "")
    .replace(/<\s*\/?\s*(script|iframe|object|embed|style)[^>]*>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/(href|src)\s*=\s*("|')\s*javascript:[^"']*\2/gi, '$1="#"');
}

// Public view: published and not scheduled for the future.
export async function getPosts(): Promise<BlogPost[]> {
  const now = nowLocal();
  return newestFirst(await readStore()).filter(
    (post) => post.status === "published" && post.date <= now,
  );
}

// Admin view: everything, drafts and scheduled included.
export async function getAdminPosts(): Promise<StoredPost[]> {
  return newestFirst(await readStore());
}

export async function getPost(slug: string) {
  return (await getPosts()).find((post) => post.slug === slug) ?? null;
}

// Plain-text helpers reused by the admin when it derives excerpt/reading time.
export function deriveFromHtml(html: string) {
  const text = plainText(html);
  return {
    excerpt: text.length > 200 ? `${text.slice(0, 197).trimEnd()}…` : text,
    readMinutes: Math.max(1, Math.round(text.split(" ").length / 200)),
  };
}

export function toSummary(post: BlogPost): BlogPostSummary {
  // Deliberately drops `contentHtml`, `description` and `image`.
  const { contentHtml, description, image, ...summary } = post;
  void contentHtml;
  void description;
  void image;
  return { ...summary, excerpt: summary.excerpt.slice(0, 180) };
}

// Categories that actually have posts, biggest first. "Uncategorized" is
// WordPress's default bucket, not a topic worth a filter chip.
export async function getCategories(posts?: BlogPost[]): Promise<BlogCategory[]> {
  const counts = new Map<string, BlogCategory>();
  for (const post of posts ?? (await getPosts())) {
    for (const category of post.categories) {
      if (category.slug === "uncategorized") continue;
      const current = counts.get(category.slug);
      if (current) current.count += 1;
      else counts.set(category.slug, { id: 0, name: category.name, slug: category.slug, count: 1 });
    }
  }
  return [...counts.values()].sort((a, b) => b.count - a.count);
}

// Article HTML as WordPress renders it: strip the block-editor classes and
// point links to other blog posts at this site's own /blog/<slug> pages.
export function cleanContent(html: string, knownSlugs: Set<string>, slug?: string) {
  const cleaned = html
    .replace(/\sclass="[^"]*"/g, "")
    .replace(/\sstyle="[^"]*"/g, "")
    .replace(/<img /g, '<img loading="lazy" decoding="async" ')
    .replace(
      new RegExp(`href="${BLOG_ORIGIN.replace(/[.]/g, "\\.")}/([a-z0-9-]+)/?"`, "gi"),
      // Plain <a> inside raw HTML isn't prefixed by Next, so the subpath
      // build (BASE_PATH=/site-teste) has to add it by hand.
      (match, target: string) =>
        knownSlugs.has(target) ? `href="${process.env.BASE_PATH ?? ""}/blog/${target}/"` : match,
    );
  // Last, so the classes on the generated CTA markup aren't stripped above.
  return renderCtasInHtml(cleaned, { slug });
}
