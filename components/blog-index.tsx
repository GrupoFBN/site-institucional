"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { BlogCard, CategoryChip, PostMeta } from "@/components/blog-card";
import type { BlogCategory, BlogPostSummary } from "@/lib/blog";

const PAGE_SIZE = 12;
const FEATURED_SIDE = 3;

// Accent- and case-insensitive, so "saude" finds "Saúde".
function normalize(text: string) {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

export function BlogIndex({
  posts,
  categories,
}: {
  posts: BlogPostSummary[];
  categories: BlogCategory[];
}) {
  const [category, setCategory] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(PAGE_SIZE);

  const filtering = category !== null || query.trim() !== "";

  const matches = useMemo(() => {
    const needle = normalize(query.trim());
    return posts.filter(
      (post) =>
        (category === null || post.categories.some((c) => c.slug === category)) &&
        (needle === "" || normalize(`${post.title} ${post.excerpt}`).includes(needle)),
    );
  }, [posts, category, query]);

  // Unfiltered: the newest post is featured with the next three beside it,
  // and the grid below carries on from there — nothing is shown twice.
  const featured = filtering ? [] : posts.slice(0, 1 + FEATURED_SIDE);
  const gridPosts = filtering ? matches : posts.slice(featured.length);
  const visible = gridPosts.slice(0, limit);
  const [lead, ...side] = featured;
  const activeName = categories.find((c) => c.slug === category)?.name;

  function pickCategory(slug: string | null) {
    setCategory(slug);
    setLimit(PAGE_SIZE);
  }

  return (
    <>
      <section className="bg-gray-100 px-6 pb-10 pt-36 sm:px-10 lg:pt-44">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-5xl font-medium leading-none tracking-tight text-brand-dark sm:text-6xl">
            Blog
          </h1>
          <p className="mt-4 max-w-xl text-lg text-gray-600">
            Seguros, benefícios e gestão de riscos para quem toca uma empresa.
          </p>

          <div className="mt-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <ul className="flex flex-wrap gap-2" aria-label="Categorias">
              <li>
                <FilterChip active={category === null} onClick={() => pickCategory(null)}>
                  Todos
                </FilterChip>
              </li>
              {categories.slice(0, 8).map((item) => (
                <li key={item.slug}>
                  <FilterChip active={category === item.slug} onClick={() => pickCategory(item.slug)}>
                    {item.name}
                  </FilterChip>
                </li>
              ))}
            </ul>
            <label className="relative block lg:w-72">
              <span className="sr-only">Buscar artigos</span>
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
              />
              <input
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setLimit(PAGE_SIZE);
                }}
                placeholder="Buscar artigos"
                className="h-11 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm text-brand-dark placeholder:text-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              />
            </label>
          </div>
        </div>
      </section>

      <div className="px-6 py-14 sm:px-10 lg:py-20">
        <div className="mx-auto max-w-7xl">
          {lead ? (
            <section aria-label="Em destaque" className="grid gap-10 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:gap-12">
              <article className="group relative flex flex-col gap-5">
                <div className="aspect-[16/10] overflow-hidden rounded-lg bg-gray-100">
                  {lead.cardImage ? (
                    <Image
                      src={lead.cardImage.src}
                      alt={lead.cardImage.alt}
                      width={lead.cardImage.width}
                      height={lead.cardImage.height}
                      priority
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02] motion-reduce:transition-none"
                    />
                  ) : null}
                </div>
                <div className="flex flex-col items-start gap-3">
                  {lead.categories[0] ? <CategoryChip name={lead.categories[0].name} /> : null}
                  <h2 className="max-w-3xl text-2xl font-semibold leading-snug text-brand-dark text-balance group-hover:underline group-hover:underline-offset-4 lg:text-3xl">
                    <Link
                      href={`/blog/${lead.slug}`}
                      className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:rounded-lg focus-visible:after:ring-2 focus-visible:after:ring-primary"
                    >
                      {lead.title}
                    </Link>
                  </h2>
                  <PostMeta date={lead.date} readMinutes={lead.readMinutes} />
                </div>
              </article>

              <ul className="flex flex-col gap-8 lg:gap-10">
                {side.map((post) => (
                  <li key={post.slug}>
                    <article className="group relative flex flex-col items-start gap-3">
                      {post.categories[0] ? <CategoryChip name={post.categories[0].name} /> : null}
                      <h3 className="text-lg font-semibold leading-snug text-brand-dark text-balance group-hover:underline group-hover:underline-offset-4 lg:text-xl">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:rounded-lg focus-visible:after:ring-2 focus-visible:after:ring-primary"
                        >
                          {post.title}
                        </Link>
                      </h3>
                      <PostMeta date={post.date} readMinutes={post.readMinutes} />
                    </article>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section
            aria-labelledby="blog-grid-title"
            className={lead ? "mt-16 border-t border-gray-200 pt-14 lg:mt-20 lg:pt-16" : ""}
          >
            <h2 id="blog-grid-title" className="text-2xl font-semibold text-brand-dark lg:text-3xl">
              {!filtering
                ? "Mais recentes"
                : `${matches.length} ${matches.length === 1 ? "artigo" : "artigos"}${activeName ? ` em ${activeName}` : ""}`}
            </h2>

            {visible.length > 0 ? (
              <ul className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
                {visible.map((post) => (
                  <li key={post.slug}>
                    <BlogCard post={post} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-10 text-gray-600" role="status">
                Nenhum artigo encontrado. Tente outra palavra ou volte para &ldquo;Todos&rdquo;.
              </p>
            )}

            {gridPosts.length > visible.length ? (
              <div className="mt-14 flex justify-center">
                <button
                  type="button"
                  onClick={() => setLimit((current) => current + PAGE_SIZE)}
                  className="h-12 rounded-lg border border-brand-dark px-8 text-sm font-semibold text-brand-dark transition hover:bg-brand-dark hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Ver mais artigos
                </button>
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`h-10 rounded-full border px-4 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
        active
          ? "border-brand-dark bg-brand-dark text-white"
          : "border-gray-300 bg-white text-brand-dark hover:border-brand-dark"
      }`}
    >
      {children}
    </button>
  );
}
