import Image from "next/image";
import Link from "next/link";
import type { BlogPostSummary } from "@/lib/blog";
import { formatDate } from "@/lib/blog-format";

export function CategoryChip({ name }: { name: string }) {
  return (
    <span className="inline-block rounded bg-primary/10 px-2 py-1 text-xs font-medium leading-none text-primary">
      {name}
    </span>
  );
}

export function PostMeta({ date, readMinutes }: { date: string; readMinutes: number }) {
  return (
    <p className="text-xs text-gray-500">
      <time dateTime={date}>{formatDate(date)}</time> · {readMinutes} min de leitura
    </p>
  );
}

type CardPost = Pick<BlogPostSummary, "slug" | "title" | "date" | "readMinutes" | "categories" | "cardImage">;

// Image, chip, title, meta — the same stack the Adyen
// Knowledge Hub uses for every grid item. The whole card is one link.
export function BlogCard({ post, priority = false }: { post: CardPost; priority?: boolean }) {
  const image = post.cardImage;
  return (
    <article className="group relative flex flex-col gap-4">
      <div className="aspect-[3/2] overflow-hidden rounded-lg bg-gray-100">
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            priority={priority}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
          />
        ) : null}
      </div>
      <div className="flex flex-col items-start gap-3">
        {post.categories[0] ? <CategoryChip name={post.categories[0].name} /> : null}
        <h3 className="text-lg font-semibold leading-snug text-brand-dark text-balance group-hover:underline group-hover:underline-offset-4">
          <Link
            href={`/blog/${post.slug}`}
            className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-primary focus-visible:after:rounded-lg"
          >
            {post.title}
          </Link>
        </h3>
        <PostMeta date={post.date} readMinutes={post.readMinutes} />
      </div>
    </article>
  );
}
