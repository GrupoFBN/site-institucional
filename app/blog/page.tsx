import type { Metadata } from "next";
import { BlogIndex } from "@/components/blog-index";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { getCategories, getPosts, toSummary } from "@/lib/blog";

// Same reason as the article page: published posts appear immediately.
export const dynamic = "force-dynamic";

const DESCRIPTION =
  "Artigos sobre seguros empresariais, planos de saúde, benefícios corporativos, consórcio e gestão de riscos para PMEs.";

export const metadata: Metadata = {
  title: "Blog",
  description: DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: { url: "/blog", title: "Blog | Grupo FBN", description: DESCRIPTION },
};

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([getPosts(), getCategories()]);

  return (
    <>
      <Header solid />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <BlogIndex posts={posts.map(toSummary)} categories={categories} />
      </main>
      <Footer />
    </>
  );
}
