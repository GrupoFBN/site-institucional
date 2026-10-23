import { notFound } from "next/navigation";
import { PostEditor } from "@/components/admin/post-editor";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminPosts } from "@/lib/blog";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const posts = await getAdminPosts();
  const post = posts.find((item) => String(item.id) === id);
  if (!post) notFound();

  const categories = [...new Map(posts.flatMap((p) => p.categories).map((c) => [c.slug, c])).values()]
    .filter((category) => category.slug !== "uncategorized")
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

  return (
    <PostEditor
      key={post.id}
      post={{
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        date: post.date,
        status: post.status,
        categories: post.categories,
        cover: post.image,
        // WordPress block classes/styles mean nothing to the editor.
        hideEndCta: post.hideEndCta ?? false,
        contentHtml: post.contentHtml.replace(/\s(class|style)="[^"]*"/g, ""),
      }}
      knownCategories={categories}
    />
  );
}
