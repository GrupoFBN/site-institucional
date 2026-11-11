import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { BlogCard, CategoryChip, PostMeta } from "@/components/blog-card";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { CtaForms } from "@/components/cta-forms";
import { cleanContent, getPost, getPosts, toSummary } from "@/lib/blog";
import { SITE_NAME, SITE_URL } from "@/lib/site";

// Posts come from the admin's store, so a new or edited article has to show
// up on the next request, not after a rebuild.
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return {};
  const path = `/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      ...(post.image
        ? { images: [{ url: post.image.src, width: post.image.width, height: post.image.height }] }
        : {}),
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.description },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [post, posts] = await Promise.all([getPost(slug), getPosts()]);
  if (!post) notFound();

  const html = cleanContent(post.contentHtml, new Set(posts.map((p) => p.slug)), post.slug);
  const topic = post.categories[0]?.slug;
  const others = posts.filter((p) => p.slug !== post.slug);
  // Same topic first, topped up with the newest posts so there are always three.
  const related = [
    ...others.filter((p) => topic && p.categories.some((c) => c.slug === topic)),
    ...others,
  ]
    .filter((p, i, all) => all.findIndex((q) => q.slug === p.slug) === i)
    .slice(0, 3);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    inLanguage: "pt-BR",
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
    ...(post.image ? { image: post.image.src } : {}),
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <CtaForms />
      <Header solid />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <article className="px-6 pb-20 pt-32 sm:px-10 lg:pb-28 lg:pt-40">
          <div className="mx-auto max-w-5xl">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-brand-dark"
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              Blog
            </Link>

            <header className="mt-8 flex flex-col items-start gap-5">
              <ul className="flex flex-wrap gap-2">
                {post.categories.map((category) => (
                  <li key={category.slug}>
                    <CategoryChip name={category.name} />
                  </li>
                ))}
              </ul>
              <h1 className="max-w-4xl text-4xl font-medium leading-[1.1] tracking-tight text-brand-dark text-balance sm:text-5xl lg:text-6xl">
                {post.title}
              </h1>
              <PostMeta date={post.date} readMinutes={post.readMinutes} />
            </header>

            {post.image ? (
              <Image
                src={post.image.src}
                alt={post.image.alt}
                width={post.image.width}
                height={post.image.height}
                priority
                className="mt-10 aspect-[16/9] w-full rounded-lg bg-gray-100 object-cover lg:mt-14"
              />
            ) : null}

            <div
              className="blog-prose mx-auto mt-12 max-w-2xl lg:mt-16"
              dangerouslySetInnerHTML={{ __html: html }}
            />

            {post.hideEndCta ? null : (
            <aside className="mx-auto mt-16 flex max-w-2xl flex-col items-start gap-5 rounded-lg bg-gray-100 p-8">
              <p className="text-2xl font-semibold leading-snug text-brand-dark text-balance">
                Quer entender o que isso muda para a sua empresa?
              </p>
              <p className="text-gray-600">
                Peça um estudo sem compromisso. Um só contato da FBN cuida da cotação até o pós-venda.
              </p>
              <Button asChild size="lg">
                <Link href="#contato">Fale com a gente</Link>
              </Button>
            </aside>
            )}
          </div>
        </article>

        <section aria-labelledby="relacionados" className="border-t border-gray-200 px-6 py-16 sm:px-10 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <h2 id="relacionados" className="text-2xl font-semibold text-brand-dark lg:text-3xl">
              Continue lendo
            </h2>
            <ul className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
              {related.map((item) => (
                <li key={item.slug}>
                  <BlogCard post={toSummary(item)} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
