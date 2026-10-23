"use client";

import { deletePost } from "@/app/admin/actions";

export function DeleteButton({ id, title }: { id: number; title: string }) {
  return (
    <form
      action={deletePost}
      onSubmit={(event) => {
        if (!window.confirm(`Excluir “${title}”? Isso não pode ser desfeito.`)) event.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="text-sm font-medium text-red-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        Excluir
      </button>
    </form>
  );
}
