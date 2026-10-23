"use client";

import { useEffect, useRef, useState } from "react";
import { uploadImage } from "@/components/admin/upload-image";
import {
  CTA_DEFAULTS,
  CTA_META,
  CTA_VARIANTS,
  FORM_FIELDS,
  LINK_TYPES,
  buildHref,
  ctaHtml,
  formFieldKeys,
  type CtaAttrs,
  type CtaVariant,
  type LinkType,
} from "@/lib/cta";

const LINK_LABEL: Record<LinkType, { label: string; placeholder: string; hint: string }> = {
  url: { label: "Link", placeholder: "https://… ou /contato", hint: "Página do site ou endereço externo." },
  whatsapp: { label: "WhatsApp", placeholder: "(11) 99999-9999", hint: "Abre uma conversa no WhatsApp com esse número." },
  phone: { label: "Telefone", placeholder: "(11) 4825-6060", hint: "No celular, o botão liga para o número." },
  email: { label: "E-mail", placeholder: "contato@grupofbn.com.br", hint: "Abre o programa de e-mail do visitante." },
};

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

// Choose a template, fill it in, see it exactly as the article will show it.
export function CtaDialog({
  initial,
  editing,
  onSave,
  onClose,
}: {
  initial: CtaAttrs;
  editing: boolean;
  onSave: (attrs: CtaAttrs) => void;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const imageInput = useRef<HTMLInputElement>(null);
  const [attrs, setAttrs] = useState<CtaAttrs>(initial);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const element = dialog.current;
    if (element && !element.open) element.showModal();
  }, []);

  const set = <K extends keyof CtaAttrs>(key: K, value: CtaAttrs[K]) =>
    setAttrs((current) => ({ ...current, [key]: value }));

  // Switching template swaps in that template's starter copy, but only for
  // texts the editor hasn't changed yet.
  function pickVariant(variant: CtaVariant) {
    setAttrs((current) => {
      const before = CTA_DEFAULTS[current.variant];
      const after = CTA_DEFAULTS[variant];
      return {
        ...current,
        variant,
        title: current.title === before.title ? after.title : current.title,
        text: current.text === before.text ? after.text : current.text,
        buttonLabel: current.buttonLabel === before.buttonLabel ? after.buttonLabel : current.buttonLabel,
      };
    });
  }

  async function pickImage(file: File | undefined) {
    if (!file) return;
    setError(null);
    try {
      const image = await uploadImage(file);
      setAttrs((current) => ({ ...current, imageSrc: image.src }));
    } catch (failure) {
      setError((failure as Error).message);
    }
  }

  function toggleField(key: string) {
    const active = new Set(formFieldKeys(attrs.fields).map((field) => field.key as string));
    if (active.has(key)) active.delete(key);
    else active.add(key);
    set("fields", [...active].join(","));
  }

  const isForm = attrs.variant === "form";
  const hasImage = attrs.variant === "banner" || attrs.variant === "image";
  const showText = attrs.variant !== "inline";
  const needsDestination = !isForm && buildHref(attrs) === "#";
  const link = LINK_LABEL[attrs.linkType];

  function save() {
    if (!attrs.title.trim()) {
      setError("Escreva um título para o CTA.");
      return;
    }
    onSave(attrs);
  }

  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialog.current) dialog.current?.close();
      }}
      className="m-auto w-[min(72rem,calc(100vw-2rem))] max-h-[calc(100vh-2rem)] overflow-hidden rounded-xl bg-white p-0 text-brand-dark shadow-2xl backdrop:bg-brand-dark/50"
    >
      <div className="flex max-h-[calc(100vh-2rem)] flex-col">
        <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold">{editing ? "Editar CTA" : "Inserir CTA"}</h2>
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            className="text-sm font-medium text-gray-600 hover:text-brand-dark"
          >
            Fechar
          </button>
        </header>

        <div className="grid min-h-0 flex-1 gap-0 overflow-y-auto lg:grid-cols-[22rem_minmax(0,1fr)] lg:overflow-hidden">
          <div className="flex flex-col gap-5 p-6 lg:overflow-y-auto">
            <fieldset className="flex flex-col gap-2">
              <legend className="mb-1 text-sm font-semibold">Modelo</legend>
              {CTA_VARIANTS.map((variant) => (
                <label
                  key={variant}
                  className={`flex cursor-pointer flex-col rounded-lg border px-4 py-3 text-sm transition ${
                    attrs.variant === variant ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <span className="flex items-center gap-2 font-semibold">
                    <input
                      type="radio"
                      name="cta-variant"
                      checked={attrs.variant === variant}
                      onChange={() => pickVariant(variant)}
                      className="accent-[var(--primary)]"
                    />
                    {CTA_META[variant].label}
                  </span>
                  <span className="ml-6 text-xs text-gray-600">{CTA_META[variant].description}</span>
                </label>
              ))}
            </fieldset>

            <label className="flex flex-col gap-1.5 text-sm font-semibold">
              {attrs.variant === "inline" ? "Frase" : "Título"}
              <input value={attrs.title} onChange={(event) => set("title", event.target.value)} className={`${inputClass} font-normal`} />
            </label>

            {showText ? (
              <label className="flex flex-col gap-1.5 text-sm font-semibold">
                Texto
                <textarea
                  value={attrs.text}
                  onChange={(event) => set("text", event.target.value)}
                  rows={3}
                  className={`${inputClass} font-normal`}
                />
              </label>
            ) : null}

            {hasImage ? (
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold">Imagem</span>
                {attrs.imageSrc ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={attrs.imageSrc} alt="" className="aspect-[16/10] w-full rounded-lg bg-gray-100 object-cover" />
                    <input
                      value={attrs.imageAlt}
                      onChange={(event) => set("imageAlt", event.target.value)}
                      placeholder="Texto alternativo (descreva a imagem)"
                      aria-label="Texto alternativo da imagem"
                      className={inputClass}
                    />
                  </>
                ) : null}
                <div className="flex gap-4">
                  <button type="button" onClick={() => imageInput.current?.click()} className="text-sm font-medium text-primary hover:underline">
                    {attrs.imageSrc ? "Trocar imagem" : "Enviar imagem"}
                  </button>
                  {attrs.imageSrc ? (
                    <button type="button" onClick={() => set("imageSrc", "")} className="text-sm font-medium text-red-700 hover:underline">
                      Remover
                    </button>
                  ) : null}
                </div>
                <input
                  ref={imageInput}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="hidden"
                  onChange={(event) => {
                    void pickImage(event.target.files?.[0]);
                    event.target.value = "";
                  }}
                />
              </div>
            ) : null}

            {isForm ? (
              <>
                <fieldset className="flex flex-col gap-2">
                  <legend className="mb-1 text-sm font-semibold">Campos do formulário</legend>
                  {FORM_FIELDS.map((field) => (
                    <label key={field.key} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={formFieldKeys(attrs.fields).some((item) => item.key === field.key)}
                        disabled={field.locked}
                        onChange={() => toggleField(field.key)}
                        className="h-4 w-4 accent-[var(--primary)]"
                      />
                      {field.label}
                      {field.locked ? <span className="text-xs text-gray-500">(sempre)</span> : null}
                    </label>
                  ))}
                </fieldset>
                <label className="flex flex-col gap-1.5 text-sm font-semibold">
                  Mensagem depois do envio
                  <input
                    value={attrs.successMessage}
                    onChange={(event) => set("successMessage", event.target.value)}
                    className={`${inputClass} font-normal`}
                  />
                </label>
              </>
            ) : null}

            <label className="flex flex-col gap-1.5 text-sm font-semibold">
              {isForm ? "Texto do botão de envio" : "Texto do botão"}
              <input value={attrs.buttonLabel} onChange={(event) => set("buttonLabel", event.target.value)} className={`${inputClass} font-normal`} />
            </label>

            {!isForm ? (
              <fieldset className="flex flex-col gap-2">
                <legend className="mb-1 text-sm font-semibold">Para onde o botão leva</legend>
                <div className="flex gap-2">
                  <select
                    value={attrs.linkType}
                    onChange={(event) => set("linkType", event.target.value as LinkType)}
                    aria-label="Tipo de destino"
                    className={`${inputClass} w-36 shrink-0`}
                  >
                    {LINK_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {LINK_LABEL[type].label}
                      </option>
                    ))}
                  </select>
                  <input
                    value={attrs.linkValue}
                    onChange={(event) => set("linkValue", event.target.value)}
                    placeholder={link.placeholder}
                    aria-label="Destino"
                    className={inputClass}
                  />
                </div>
                <p className={`text-xs ${needsDestination ? "text-amber-700" : "text-gray-500"}`}>
                  {needsDestination ? "Preencha o destino: sem ele o botão não leva a lugar nenhum." : link.hint}
                </p>
                {attrs.linkType === "whatsapp" ? (
                  <input
                    value={attrs.message}
                    onChange={(event) => set("message", event.target.value)}
                    placeholder="Mensagem inicial (opcional)"
                    aria-label="Mensagem inicial do WhatsApp"
                    className={inputClass}
                  />
                ) : null}
              </fieldset>
            ) : null}
          </div>

          <div className="flex min-h-[18rem] flex-col gap-3 bg-gray-50 p-6 lg:overflow-y-auto">
            <p className="text-sm font-semibold text-gray-600">Como vai aparecer no artigo</p>
            <div className="blog-prose rounded-lg bg-white px-6 py-2 shadow-sm">
              <div dangerouslySetInnerHTML={{ __html: ctaHtml(attrs, { preview: true }) }} />
            </div>
          </div>
        </div>

        <footer className="flex items-center justify-between gap-4 border-t border-gray-200 px-6 py-4">
          <p role="alert" className="text-sm font-medium text-red-700">
            {error}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              className="h-11 rounded-lg border border-gray-300 px-5 text-sm font-semibold hover:border-brand-dark"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={save}
              className="h-11 rounded-lg bg-primary px-5 text-sm font-semibold text-white transition hover:bg-[color-mix(in_oklch,var(--primary),black_15%)]"
            >
              {editing ? "Salvar CTA" : "Inserir no artigo"}
            </button>
          </div>
        </footer>
      </div>
    </dialog>
  );
}
