import Image from "next/image";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { DeleteButton } from "@/components/admin/delete-button";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminPosts, nowLocal, type StoredPost } from "@/lib/blog";
import { formatDate } from "@/lib/blog-format";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

const FILTERS = [
  { value: "todos", label: "Todos" },
  { value: "publicados", label: "Publicados" },
  { value: "agendados", label: "Agendados" },
  { value: "rascunhos", label: "Rascunhos" },
] as const;

const NOTICES: Record<string, string> = {
  publicado: "Artigo publicado.",
  rascunho: "Rascunho salvo.",
  excluido: "Artigo excluído.",
};

function statusOf(post: StoredPost, now: string) {
  if (post.status === "draft") return "rascunhos";
  return post.date > now ? "agendados" : "publicados";
}

const BADGE: Record<string, { label: string; className: string }> = {
  publicados: { label: "Publicado", className: "bg-green-100 text-green-800" },
  agendados: { label: "Agendado", className: "bg-amber-100 text-amber-800" },
  rascunhos: { label: "Rascunho", className: "bg-gray-200 text-gray-700" },
};

function normalize(text: string) {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

type Props = { searchParams: Promise<{ status?: string; q?: string; pagina?: string; aviso?: string }> };

export default async function AdminHome({ searchParams }: Props) {
  await requireAdmin();
  const { status = "todos", q = "", pagina = "1", aviso } = await searchParams;

  const now = nowLocal();
  const all = await getAdminPosts();
  const counts = {
    todos: all.length,
    publicados: all.filter((p) => statusOf(p, now) === "publicados").length,
    agendados: all.filter((p) => statusOf(p, now) === "agendados").length,
    rascunhos: all.filter((p) => statusOf(p, now) === "rascunhos").length,
  };

  const needle = normalize(q.trim());
  const filtered = all.filter(
    (post) =>
      (status === "todos" || statusOf(post, now) === status) &&
      (needle === "" || normalize(post.title).includes(needle)),
  );

  const page = Math.max(1, Number(pagina) || 1);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const link = (patch: Record<string, string | number>) => {
    const params = new URLSearchParams({ status, ...(q ? { q } : {}), ...Object.fromEntries(Object.entries(patch).map(([k, v]) => [k, String(v)])) });
    return `/admin?${params}`;
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Artigos</h1>
          <p className="mt-1 text-sm text-gray-600">
            {counts.publicados} publicados · {counts.agendados} agendados · {counts.rascunhos} rascunhos
          </p>
        </div>
        <Link
          href="/admin/novo"
          className="flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-white transition hover:bg-[color-mix(in_oklch,var(--primary),black_15%)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Plus aria-hidden="true" className="h-4 w-4" />
          Novo artigo
        </Link>
      </div>

      {aviso && NOTICES[aviso] ? (
        <p role="status" className="rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
          {NOTICES[aviso]}
        </p>
      ) : null}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <ul className="flex flex-wrap gap-2" aria-label="Filtrar por status">
          {FILTERS.map((filter) => (
            <li key={filter.value}>
              <Link
                href={link({ status: filter.value })}
                aria-current={status === filter.value ? "page" : undefined}
                className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition ${
                  status === filter.value
                    ? "border-brand-dark bg-brand-dark text-white"
                    : "border-gray-300 bg-white hover:border-brand-dark"
                }`}
              >
                {filter.label}
                <span className="text-xs opacity-70">{counts[filter.value]}</span>
              </Link>
            </li>
          ))}
        </ul>
        <form action="/admin" className="relative lg:w-72">
          <input type="hidden" name="status" value={status} />
          <label className="sr-only" htmlFor="busca">
            Buscar por título
          </label>
          <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            id="busca"
            name="q"
            defaultValue={q}
            placeholder="Buscar por título"
            className="h-11 w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          />
        </form>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full min-w-[44rem] text-left text-sm">
          <thead className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">Artigo</th>
              <th scope="col" className="px-4 py-3 font-medium">Categoria</th>
              <th scope="col" className="px-4 py-3 font-medium">Data</th>
              <th scope="col" className="px-4 py-3 font-medium">Status</th>
              <th scope="col" className="px-4 py-3 text-right font-medium">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((post) => {
              const state = statusOf(post, now);
              const badge = BADGE[state];
              return (
                <tr key={post.id} className="align-middle">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-20 shrink-0 overflow-hidden rounded bg-gray-100">
                        {post.cardImage ? (
                          <Image
                            src={post.cardImage.src}
                            alt=""
                            width={post.cardImage.width}
                            height={post.cardImage.height}
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>
                      <Link href={`/admin/${post.id}`} className="max-w-md font-medium leading-snug hover:underline">
                        {post.title}
                      </Link>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{post.categories[0]?.name ?? "—"}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600">{formatDate(post.date)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded px-2 py-1 text-xs font-medium ${badge.className}`}>{badge.label}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-4">
                      <Link href={`/admin/${post.id}`} className="text-sm font-medium text-primary hover:underline">
                        Editar
                      </Link>
                      {state === "publicados" ? (
                        <Link href={`/blog/${post.slug}`} target="_blank" className="text-sm font-medium text-gray-600 hover:underline">
                          Ver
                        </Link>
                      ) : null}
                      <DeleteButton id={post.id} title={post.title} />
                    </div>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-gray-600">
                  Nenhum artigo encontrado.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {pages > 1 ? (
        <nav aria-label="Páginas" className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            Página {page} de {pages}
          </span>
          <div className="flex gap-3">
            {page > 1 ? (
              <Link href={link({ pagina: page - 1 })} className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium hover:border-brand-dark">
                Anterior
              </Link>
            ) : null}
            {page < pages ? (
              <Link href={link({ pagina: page + 1 })} className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium hover:border-brand-dark">
                Próxima
              </Link>
            ) : null}
          </div>
        </nav>
      ) : null}
    </div>
  );
}
