import { PostEditor } from "@/components/admin/post-editor";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminPosts, nowLocal } from "@/lib/blog";

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  await requireAdmin();
  const posts = await getAdminPosts();
  const categories = [...new Map(posts.flatMap((post) => post.categories).map((c) => [c.slug, c])).values()]
    .filter((category) => category.slug !== "uncategorized")
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

  return (
    <PostEditor
      post={{
        id: null,
        title: "",
        slug: "",
        excerpt: "",
        date: nowLocal(),
        status: "draft",
        categories: [],
        cover: null,
        contentHtml: "",
        hideEndCta: false,
      }}
      knownCategories={categories}
    />
  );
}
