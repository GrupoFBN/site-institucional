"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, null);

  return (
    <form action={action} className="flex flex-col gap-5">
      <label className="flex flex-col gap-2 text-sm font-medium text-brand-dark">
        E-mail
        <input
          name="email"
          type="email"
          required
          autoComplete="username"
          autoFocus
          className="h-12 rounded-lg border border-gray-300 px-4 text-base font-normal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        />
      </label>
      <label className="flex flex-col gap-2 text-sm font-medium text-brand-dark">
        Senha
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="h-12 rounded-lg border border-gray-300 px-4 text-base font-normal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        />
      </label>
      {state?.error ? (
        <p role="alert" className="text-sm font-medium text-red-700">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="h-12 rounded-lg bg-primary text-base font-semibold text-white transition hover:bg-[color-mix(in_oklch,var(--primary),black_15%)] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {pending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
