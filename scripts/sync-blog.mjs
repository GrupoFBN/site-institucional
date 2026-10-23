// Downloads every post from the WordPress blog into content/blog.json.
// blog.grupofbn.com.br's API is slow (minutes for the full archive), so the
// site reads this snapshot instead of calling it on every dev reload/build.
// Run `npm run blog:sync` whenever new posts should show up.
import { mkdir, writeFile } from "node:fs/promises";

const API = process.env.BLOG_API_URL ?? "https://blog.grupofbn.com.br/wp-json/wp/v2";
const FIELDS =
  "id,slug,date,title,excerpt,content,yoast_head_json.og_description,yoast_head_json.description,_links,_embedded";
const PER_PAGE = 25;
const KEEP_SIZES = ["medium_large", "large"];

async function getPage(page) {
  const url = `${API}/posts?per_page=${PER_PAGE}&page=${page}&_embed=1&orderby=date&order=desc&_fields=${FIELDS}`;
  const response = await fetch(url, { signal: AbortSignal.timeout(300_000) });
  if (!response.ok) throw new Error(`Blog API ${response.status} on page ${page}`);
  return {
    posts: await response.json(),
    totalPages: Number(response.headers.get("x-wp-totalpages") ?? 1),
  };
}

// Keep only what lib/blog.ts reads, so the snapshot stays a few MB.
function slim(post) {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  const sizes = {};
  for (const key of KEEP_SIZES) {
    const size = media?.media_details?.sizes?.[key];
    if (size) sizes[key] = { source_url: size.source_url, width: size.width, height: size.height };
  }
  return {
    id: post.id,
    slug: post.slug,
    date: post.date,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    yoast_head_json: {
      og_description: post.yoast_head_json?.og_description,
      description: post.yoast_head_json?.description,
    },
    _embedded: {
      "wp:featuredmedia": media
        ? [
            {
              source_url: media.source_url,
              alt_text: media.alt_text,
              media_details: {
                width: media.media_details?.width,
                height: media.media_details?.height,
                sizes,
              },
            },
          ]
        : [],
      "wp:term": (post._embedded?.["wp:term"] ?? []).map((group) =>
        group.map(({ id, name, slug, taxonomy }) => ({ id, name, slug, taxonomy })),
      ),
    },
  };
}

const first = await getPage(1);
const all = [...first.posts];
console.log(`page 1/${first.totalPages}`);
for (let page = 2; page <= first.totalPages; page += 1) {
  all.push(...(await getPage(page)).posts);
  console.log(`page ${page}/${first.totalPages}`);
}

await mkdir("content", { recursive: true });
await writeFile("content/blog.json", JSON.stringify(all.map(slim)));
console.log(`saved ${all.length} posts to content/blog.json`);
