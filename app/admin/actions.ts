"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkCredentials, createSession, destroySession, requireAdmin } from "@/lib/admin-auth";
import {
  deriveFromHtml,
  nowLocal,
  readStore,
  sanitizeHtml,
  slugify,
  writeStore,
  type StoredPost,
} from "@/lib/blog";

export type FormState = { error: string } | null;

export async function login(_: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!checkCredentials(email, password)) {
    // A pause on every failure makes guessing passwords painfully slow.
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { error: "E-mail ou senha incorretos." };
  }
  await createSession(email.trim().toLowerCase());
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

function parseJson<T>(value: FormDataEntryValue | null, fallback: T): T {
  try {
    return value ? (JSON.parse(String(value)) as T) : fallback;
  } catch {
    return fallback;
  }
}

function revalidateBlog(slug: string) {
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
}

export async function savePost(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const intent = formData.get("intent") === "publish" ? "published" : "draft";
  const id = Number(formData.get("id")) || null;
  const title = String(formData.get("title") ?? "").trim();
  const contentHtml = sanitizeHtml(String(formData.get("contentHtml") ?? "")).trim();
  const slug = slugify(String(formData.get("slug") ?? "")) || slugify(title);

  if (!title) return { error: "Escreva um título." };
  if (!slug) return { error: "O endereço (slug) ficou vazio. Use letras ou números." };
  if (intent === "published" && !contentHtml.replace(/<[^>]+>/g, "").trim()) {
    return { error: "O artigo está sem texto. Escreva algo antes de publicar." };
  }

  const posts = await readStore();
  if (posts.some((post) => post.slug === slug && post.id !== id)) {
    return { error: `Já existe outro artigo com o endereço “${slug}”. Troque o slug.` };
  }

  const derived = deriveFromHtml(contentHtml);
  const excerpt = String(formData.get("excerpt") ?? "").trim() || derived.excerpt;
  const categories = parseJson<{ name: string; slug: string }[]>(formData.get("categories"), []).filter(
    (category) => category.name && category.slug,
  );
  const coverSrc = String(formData.get("coverSrc") ?? "").trim();
  const cover = coverSrc
    ? {
        src: coverSrc,
        width: Number(formData.get("coverWidth")) || 1200,
        height: Number(formData.get("coverHeight")) || 675,
        alt: String(formData.get("coverAlt") ?? "").trim(),
      }
    : null;
  // <input type="datetime-local"> gives "2026-10-07T14:30"; keep seconds.
  const rawDate = String(formData.get("date") ?? "");
  const date = rawDate ? (rawDate.length === 16 ? `${rawDate}:00` : rawDate) : nowLocal();

  const existing = id ? posts.find((post) => post.id === id) : undefined;
  const saved: StoredPost = {
    id: existing?.id ?? Math.max(0, ...posts.map((post) => post.id)) + 1,
    slug,
    title,
    excerpt,
    description: excerpt,
    date,
    readMinutes: derived.readMinutes,
    categories,
    image: cover,
    cardImage: cover,
    contentHtml,
    hideEndCta: formData.get("hideEndCta") === "on",
    status: intent,
  };

  await writeStore(existing ? posts.map((post) => (post.id === saved.id ? saved : post)) : [...posts, saved]);
  revalidateBlog(slug);
  if (existing && existing.slug !== slug) revalidateBlog(existing.slug);
  redirect(`/admin?aviso=${intent === "published" ? "publicado" : "rascunho"}`);
}

export async function deletePost(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const posts = await readStore();
  const target = posts.find((post) => post.id === id);
  if (!target) redirect("/admin");
  await writeStore(posts.filter((post) => post.id !== id));
  revalidateBlog(target.slug);
  redirect("/admin?aviso=excluido");
}
