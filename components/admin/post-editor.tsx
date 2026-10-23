"use client";

import { useActionState, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "@tiptap/extension-image";
import { TableKit } from "@tiptap/extension-table";
import {
  ArrowLeft,
  Bold,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Megaphone,
  Quote,
  Redo2,
  Table as TableIcon,
  Undo2,
} from "lucide-react";
import { savePost } from "@/app/admin/actions";
import { CtaDialog } from "@/components/admin/cta-dialog";
import { CtaNode } from "@/components/admin/cta-extension";
import { uploadImage } from "@/components/admin/upload-image";
import { slugify } from "@/lib/blog-format";
import { CTA_DEFAULTS, renderCtasInHtml, type CtaAttrs } from "@/lib/cta";

type Category = { name: string; slug: string };
type Cover = { src: string; width: number; height: number; alt: string };

export type EditorPost = {
  id: number | null;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  status: "draft" | "published";
  categories: Category[];
  cover: Cover | null;
  contentHtml: string;
  hideEndCta: boolean;
};

export function PostEditor({ post, knownCategories }: { post: EditorPost; knownCategories: Category[] }) {
  const [state, action, pending] = useActionState(savePost, null);

  const [title, setTitle] = useState(post.title);
  const [slug, setSlug] = useState(post.slug);
  const [slugTouched, setSlugTouched] = useState(post.id !== null);
  const [excerpt, setExcerpt] = useState(post.excerpt);
  const [date, setDate] = useState(post.date.slice(0, 16));
  const [selected, setSelected] = useState<Category[]>(post.categories);
  const [options, setOptions] = useState<Category[]>(() => {
    const known = new Map(knownCategories.map((category) => [category.slug, category]));
    for (const category of post.categories) known.set(category.slug, category);
    return [...known.values()];
  });
  const [newCategory, setNewCategory] = useState("");
  const [cover, setCover] = useState<Cover | null>(post.cover);
  const [html, setHtml] = useState(post.contentHtml);
  const [tab, setTab] = useState<"escrever" | "visualizar">("escrever");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [ctaDialog, setCtaDialog] = useState<{ position: number | null; attrs: CtaAttrs } | null>(null);
  const coverInput = useRef<HTMLInputElement>(null);
  const bodyImageInput = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ link: { openOnClick: false } }),
      TiptapImage,
      TableKit,
      CtaNode.configure({
        onEdit: (position, attrs) => setCtaDialog({ position, attrs }),
      }),
    ],
    content: post.contentHtml,
    // Render on the client only: the editor reads the DOM, so a server pass
    // would mismatch on hydration.
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "blog-prose min-h-[26rem] px-6 py-5 focus:outline-none",
        "aria-label": "Texto do artigo",
      },
    },
    onUpdate: ({ editor: current }) => setHtml(current.getHTML()),
  });

  function onTitle(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  function toggleCategory(category: Category) {
    setSelected((current) =>
      current.some((item) => item.slug === category.slug)
        ? current.filter((item) => item.slug !== category.slug)
        : [...current, category],
    );
  }

  function addCategory() {
    const name = newCategory.trim();
    const categorySlug = slugify(name);
    if (!name || !categorySlug) return;
    const category = { name, slug: categorySlug };
    setOptions((current) => (current.some((item) => item.slug === categorySlug) ? current : [...current, category]));
    setSelected((current) => (current.some((item) => item.slug === categorySlug) ? current : [...current, category]));
    setNewCategory("");
  }

  async function pickCover(file: File | undefined) {
    if (!file) return;
    setUploadError(null);
    try {
      setCover(await uploadImage(file));
    } catch (error) {
      setUploadError((error as Error).message);
    }
  }

  async function insertBodyImage(file: File | undefined) {
    if (!file || !editor) return;
    setUploadError(null);
    try {
      const image = await uploadImage(file);
      const alt = window.prompt("Descreva a imagem (texto alternativo, para acessibilidade):") ?? "";
      editor.chain().focus().setImage({ src: image.src, alt }).run();
    } catch (error) {
      setUploadError((error as Error).message);
    }
  }

  function saveCta(attrs: CtaAttrs) {
    if (!editor || !ctaDialog) return;
    const { position } = ctaDialog;
    if (position === null) {
      editor.chain().focus().insertCta(attrs).run();
    } else {
      editor
        .chain()
        .focus()
        .command(({ tr }) => {
          tr.setNodeMarkup(position, undefined, attrs);
          return true;
        })
        .run();
    }
    setCtaDialog(null);
  }

  const fieldClass =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

  return (
    <form action={action} className="flex flex-col gap-8">
      <input type="hidden" name="id" value={post.id ?? ""} />
      <input type="hidden" name="contentHtml" value={html} />
      <input type="hidden" name="categories" value={JSON.stringify(selected)} />
      <input type="hidden" name="coverSrc" value={cover?.src ?? ""} />
      <input type="hidden" name="coverWidth" value={cover?.width ?? ""} />
      <input type="hidden" name="coverHeight" value={cover?.height ?? ""} />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-brand-dark">
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Artigos
        </Link>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            name="intent"
            value="draft"
            disabled={pending}
            className="h-11 rounded-lg border border-brand-dark px-5 text-sm font-semibold transition hover:bg-brand-dark hover:text-white disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Salvar rascunho
          </button>
          <button
            type="submit"
            name="intent"
            value="publish"
            disabled={pending}
            className="h-11 rounded-lg bg-primary px-5 text-sm font-semibold text-white transition hover:bg-[color-mix(in_oklch,var(--primary),black_15%)] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {pending ? "Salvando…" : post.status === "published" ? "Atualizar" : "Publicar"}
          </button>
        </div>
      </div>

      {state?.error ? (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          {state.error}
        </p>
      ) : null}
      {uploadError ? (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          {uploadError}
        </p>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="flex min-w-0 flex-col gap-6">
          <label className="sr-only" htmlFor="titulo">
            Título
          </label>
          <input
            id="titulo"
            name="title"
            value={title}
            onChange={(event) => onTitle(event.target.value)}
            placeholder="Título do artigo"
            className="w-full rounded-lg border border-transparent bg-transparent px-0 text-3xl font-semibold leading-tight tracking-tight placeholder:text-gray-400 focus-visible:outline-none sm:text-4xl"
          />

          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 px-2 py-2">
              {tab === "escrever" && editor ? (
                <Toolbar
                  editor={editor}
                  onImage={() => bodyImageInput.current?.click()}
                  onCta={() => setCtaDialog({ position: null, attrs: { ...CTA_DEFAULTS.box } })}
                />
              ) : null}
              <div className="ml-auto flex rounded-lg bg-gray-200 p-0.5 text-sm font-medium" role="tablist">
                {(["escrever", "visualizar"] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    role="tab"
                    aria-selected={tab === item}
                    onClick={() => setTab(item)}
                    className={`rounded-md px-3 py-1.5 capitalize ${tab === item ? "bg-white shadow-sm" : "text-gray-600"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            {tab === "escrever" ? (
              <EditorContent editor={editor} />
            ) : (
              <div className="px-6 py-5">
                {cover ? (
                  <Image
                    src={cover.src}
                    alt={cover.alt}
                    width={cover.width}
                    height={cover.height}
                    className="mb-8 aspect-[16/9] w-full rounded-lg object-cover"
                  />
                ) : null}
                <h2 className="mb-6 text-4xl font-medium leading-tight tracking-tight">{title || "Sem título"}</h2>
                <div className="blog-prose" dangerouslySetInnerHTML={{ __html: renderCtasInHtml(html, { preview: true }) }} />
              </div>
            )}
          </div>
          <input
            ref={bodyImageInput}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={(event) => {
              void insertBodyImage(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
        </div>

        <aside className="flex flex-col gap-6">
          <section className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-5">
            <h2 className="text-sm font-semibold">Imagem de capa</h2>
            {cover ? (
              <>
                <Image
                  src={cover.src}
                  alt=""
                  width={cover.width}
                  height={cover.height}
                  className="aspect-[16/10] w-full rounded-lg bg-gray-100 object-cover"
                />
                <label className="flex flex-col gap-1.5 text-xs font-medium text-gray-600">
                  Texto alternativo
                  <input
                    name="coverAlt"
                    value={cover.alt}
                    onChange={(event) => setCover({ ...cover, alt: event.target.value })}
                    placeholder="Descreva a imagem"
                    className={fieldClass}
                  />
                </label>
              </>
            ) : (
              <p className="text-sm text-gray-600">Aparece no topo do artigo e nos cards do blog.</p>
            )}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => coverInput.current?.click()}
                className="text-sm font-medium text-primary hover:underline"
              >
                {cover ? "Trocar imagem" : "Enviar imagem"}
              </button>
              {cover ? (
                <button type="button" onClick={() => setCover(null)} className="text-sm font-medium text-red-700 hover:underline">
                  Remover
                </button>
              ) : null}
            </div>
            <input
              ref={coverInput}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={(event) => {
                void pickCover(event.target.files?.[0]);
                event.target.value = "";
              }}
            />
          </section>

          <section className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-5">
            <label className="flex flex-col gap-1.5 text-sm font-semibold">
              Endereço (slug)
              <input
                name="slug"
                value={slug}
                onChange={(event) => {
                  setSlugTouched(true);
                  setSlug(slugify(event.target.value));
                }}
                className={`${fieldClass} font-normal`}
              />
              <span className="text-xs font-normal text-gray-500">/blog/{slug || "…"}</span>
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-semibold">
              Data de publicação
              <input
                type="datetime-local"
                name="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className={`${fieldClass} font-normal`}
              />
              <span className="text-xs font-normal text-gray-500">Data no futuro agenda a publicação.</span>
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-semibold">
              Resumo
              <textarea
                name="excerpt"
                value={excerpt}
                onChange={(event) => setExcerpt(event.target.value)}
                rows={4}
                placeholder="Deixe vazio para usar o começo do texto."
                className={`${fieldClass} font-normal`}
              />
              <span className="text-xs font-normal text-gray-500">Aparece nos resultados do Google e nas redes.</span>
            </label>
            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                name="hideEndCta"
                defaultChecked={post.hideEndCta}
                className="mt-0.5 h-4 w-4 accent-[var(--primary)]"
              />
              <span>
                <span className="font-semibold">Ocultar o CTA do final</span>
                <span className="block text-xs text-gray-500">Use quando o artigo já tem CTAs no meio do texto.</span>
              </span>
            </label>
          </section>

          <fieldset className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-5">
            <legend className="px-1 text-sm font-semibold">Categorias</legend>
            <ul className="flex max-h-56 flex-col gap-2 overflow-y-auto">
              {options.map((category) => (
                <li key={category.slug}>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selected.some((item) => item.slug === category.slug)}
                      onChange={() => toggleCategory(category)}
                      className="h-4 w-4 accent-[var(--primary)]"
                    />
                    {category.name}
                  </label>
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <label className="sr-only" htmlFor="nova-categoria">
                Nova categoria
              </label>
              <input
                id="nova-categoria"
                value={newCategory}
                onChange={(event) => setNewCategory(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addCategory();
                  }
                }}
                placeholder="Nova categoria"
                className={fieldClass}
              />
              <button
                type="button"
                onClick={addCategory}
                className="shrink-0 rounded-lg border border-gray-300 px-3 text-sm font-medium hover:border-brand-dark"
              >
                Adicionar
              </button>
            </div>
          </fieldset>
        </aside>
      </div>
      {ctaDialog ? (
        <CtaDialog
          initial={ctaDialog.attrs}
          editing={ctaDialog.position !== null}
          onSave={saveCta}
          onClose={() => setCtaDialog(null)}
        />
      ) : null}
    </form>
  );
}

function Toolbar({ editor, onImage, onCta }: { editor: Editor; onImage: () => void; onCta: () => void }) {
  function setLink() {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Endereço do link (deixe vazio para remover):", previous ?? "https://");
    if (url === null) return;
    if (url.trim() === "") editor.chain().focus().unsetLink().run();
    else editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  }

  const items: { label: string; icon: React.ReactNode; active?: boolean; run: () => void }[] = [
    { label: "Título grande", icon: <Heading2 className="h-4 w-4" />, active: editor.isActive("heading", { level: 2 }), run: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
    { label: "Subtítulo", icon: <Heading3 className="h-4 w-4" />, active: editor.isActive("heading", { level: 3 }), run: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
    { label: "Negrito", icon: <Bold className="h-4 w-4" />, active: editor.isActive("bold"), run: () => editor.chain().focus().toggleBold().run() },
    { label: "Itálico", icon: <Italic className="h-4 w-4" />, active: editor.isActive("italic"), run: () => editor.chain().focus().toggleItalic().run() },
    { label: "Lista", icon: <List className="h-4 w-4" />, active: editor.isActive("bulletList"), run: () => editor.chain().focus().toggleBulletList().run() },
    { label: "Lista numerada", icon: <ListOrdered className="h-4 w-4" />, active: editor.isActive("orderedList"), run: () => editor.chain().focus().toggleOrderedList().run() },
    { label: "Citação", icon: <Quote className="h-4 w-4" />, active: editor.isActive("blockquote"), run: () => editor.chain().focus().toggleBlockquote().run() },
    { label: "Link", icon: <Link2 className="h-4 w-4" />, active: editor.isActive("link"), run: setLink },
    { label: "Imagem", icon: <ImagePlus className="h-4 w-4" />, run: onImage },
    { label: "Tabela", icon: <TableIcon className="h-4 w-4" />, run: () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() },
    { label: "Desfazer", icon: <Undo2 className="h-4 w-4" />, run: () => editor.chain().focus().undo().run() },
    { label: "Refazer", icon: <Redo2 className="h-4 w-4" />, run: () => editor.chain().focus().redo().run() },
  ];

  return (
    <div className="flex flex-wrap items-center gap-0.5" role="toolbar" aria-label="Formatação">
      {items.map((item) => (
        <button
          key={item.label}
          type="button"
          title={item.label}
          aria-label={item.label}
          aria-pressed={item.active}
          onClick={item.run}
          className={`flex h-9 w-9 items-center justify-center rounded-md transition hover:bg-gray-200 focus-visible:outline-2 focus-visible:outline-primary ${
            item.active ? "bg-gray-200 text-primary" : "text-gray-700"
          }`}
        >
          {item.icon}
        </button>
      ))}
      <button
        type="button"
        onClick={onCta}
        title="Inserir CTA (botão, formulário, banner...)"
        className="ml-1 flex h-9 items-center gap-1.5 rounded-md bg-primary/10 px-3 text-sm font-semibold text-primary transition hover:bg-primary/20 focus-visible:outline-2 focus-visible:outline-primary"
      >
        <Megaphone aria-hidden="true" className="h-4 w-4" />
        CTA
      </button>
    </div>
  );
}
