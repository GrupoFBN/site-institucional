"use client";

import { useEffect } from "react";

// The CTA forms inside an article are plain HTML (they come from the saved
// article), so one delegated listener wires all of them up.
export function CtaForms() {
  useEffect(() => {
    async function onSubmit(event: SubmitEvent) {
      const form = event.target;
      if (!(form instanceof HTMLFormElement) || !form.matches("[data-cta-form]")) return;
      event.preventDefault();

      const box = form.closest<HTMLElement>(".blog-cta");
      const status = form.querySelector<HTMLElement>(".blog-cta__status");
      const button = form.querySelector<HTMLButtonElement>("button[type=submit]");
      const data = Object.fromEntries(new FormData(form).entries());

      const show = (message: string, failed: boolean) => {
        if (!status) return;
        status.textContent = message;
        status.hidden = false;
        status.dataset.failed = String(failed);
      };

      if (button) button.disabled = true;
      try {
        const response = await fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, source: box?.dataset.source ?? "", ctaTitle: box?.dataset.title ?? "" }),
        });
        const result = (await response.json()) as { error?: string };
        if (!response.ok) {
          show(result.error ?? "Não foi possível enviar. Tente de novo.", true);
          if (button) button.disabled = false;
          return;
        }
        form.reset();
        form.classList.add("is-done");
        show(form.dataset.success ?? "Recebemos seus dados.", false);
      } catch {
        show("Sem conexão. Tente de novo.", true);
        if (button) button.disabled = false;
      }
    }

    document.addEventListener("submit", onSubmit);
    return () => document.removeEventListener("submit", onSubmit);
  }, []);

  return null;
}
