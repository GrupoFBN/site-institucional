"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

export type FpPhoto = { src: string; ratio: number };

// Photos in justified rows, like the current site's gallery: every row fills
// the width and the photos in it share one height, so each one's flex-grow is
// its own width/height ratio. Clicking opens the whole photo.
export function FpGallery({ rows }: { rows: FpPhoto[][] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<string | null>(null);

  function show(src: string) {
    setOpen(src);
    dialog.current?.showModal();
  }

  return (
    <>
      <div className="mt-8 flex flex-col gap-[10px]">
        {rows.map((row, i) => (
          <ul
            key={i}
            className="flex gap-[10px]"
            style={{ aspectRatio: row.reduce((sum, photo) => sum + photo.ratio, 0) }}
          >
            {row.map((photo) => (
              <li key={photo.src} className="min-w-0" style={{ flex: `${photo.ratio} 1 0%` }}>
                <button
                  type="button"
                  onClick={() => show(photo.src)}
                  aria-label="Ver foto completa"
                  className="group relative block h-full w-full overflow-hidden rounded-md bg-[#E6E4E2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2065F1]"
                >
                  <Image
                    src={photo.src}
                    alt="Momento do Franquia Protegida"
                    fill
                    sizes="(min-width: 1140px) 560px, 50vw"
                    className="object-cover transition duration-300 group-hover:scale-[1.03] group-hover:brightness-90 motion-reduce:transition-none"
                  />
                </button>
              </li>
            ))}
          </ul>
        ))}
      </div>

      <dialog
        ref={dialog}
        onClose={() => setOpen(null)}
        onClick={(event) => {
          if (event.target === dialog.current) dialog.current?.close();
        }}
        className="m-auto max-h-[92vh] max-w-[92vw] bg-transparent p-0 backdrop:bg-[#13192C]/80"
      >
        {open ? (
          <div className="relative">
            {/* The full-size photo, shown at its own proportions. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={open} alt="Momento do Franquia Protegida" className="max-h-[92vh] max-w-[92vw] object-contain" />
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              aria-label="Fechar"
              className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#13192C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <X aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
