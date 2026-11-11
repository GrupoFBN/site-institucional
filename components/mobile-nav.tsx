"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CONTACT_HREF,
  MOBILE_NAV_ID,
  MOBILE_NAV_TOGGLE_ID,
  NAV_LINKS,
  NAV_SECTIONS,
} from "@/lib/nav";

// Full-screen menu for viewports below lg, where the header row has no room
// for its nav. A modal <dialog> does most of the work: it renders in the top
// layer (above the hero and any z-index on the page), makes everything else
// inert so focus can't wander out, and closes itself on Escape — its `close`
// event is what keeps `open` in sync then. `returnFocusRef` is whatever
// opened it (the bar's hamburger or the collapsed pill).
export function MobileNav({
  open,
  onClose,
  returnFocusRef,
}: {
  open: boolean;
  onClose: () => void;
  returnFocusRef: RefObject<HTMLElement | null>;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Every opening starts with all groups collapsed.
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setExpandedId(null);
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;
    const opener = returnFocusRef.current;
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;

    if (!dialog.open) dialog.showModal();
    closeButtonRef.current?.focus();
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = prevOverflow;
      if (dialog.open) dialog.close();
      // Only after close(): while the dialog is modal, the opener is inert.
      const target = opener?.isConnected ? opener : document.getElementById(MOBILE_NAV_TOGGLE_ID);
      target?.focus({ preventScroll: true });
    };
  }, [open, returnFocusRef]);

  return (
    // No display utility on the <dialog> itself: it would override the
    // browser's `display: none` for a closed dialog.
    <dialog
      ref={dialogRef}
      id={MOBILE_NAV_ID}
      aria-label="Menu"
      onClose={onClose}
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto overscroll-contain border-0 bg-white p-0 text-brand-dark backdrop:bg-transparent open:fade-in open:slide-in-from-top-2 open:duration-200 motion-safe:open:animate-in"
    >
      <div className="flex min-h-full flex-col">
        {/* Same height and padding as the header row, so the close button
            lands exactly where the hamburger was. */}
        <div className="flex items-center justify-between gap-3 px-4 py-5 sm:px-6">
          <Link
            href="/"
            onClick={onClose}
            aria-label="Grupo FBN — página inicial"
            className="relative block h-8 w-[83px] shrink-0 overflow-hidden"
          >
            <Image
              src="/fbn-logo.png"
              alt=""
              width={166}
              height={78}
              className="absolute left-0 top-0 h-[39px] w-[83px]"
            />
          </Link>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Fechar menu"
            className="-my-1 -mr-2 flex size-10 shrink-0 items-center justify-center rounded-lg text-brand-dark transition-colors hover:bg-gray-100"
          >
            <X className="size-6" aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Principal" className="flex-1 px-4 sm:px-6">
          <ul className="border-t border-gray-200">
            {NAV_SECTIONS.map((section) => {
              const expanded = expandedId === section.id;
              const groupId = `${MOBILE_NAV_ID}-${section.id}`;
              return (
                <li key={section.id} className="border-b border-gray-200">
                  <button
                    type="button"
                    onClick={() => setExpandedId(expanded ? null : section.id)}
                    aria-expanded={expanded}
                    aria-controls={groupId}
                    className="flex w-full items-center justify-between gap-4 py-4 text-left text-lg font-semibold text-brand-dark"
                  >
                    {section.label}
                    <ChevronDown
                      aria-hidden="true"
                      className={`size-5 shrink-0 text-gray-500 transition-transform duration-200 motion-reduce:transition-none ${
                        expanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {/* 0fr → 1fr animates the group to its real height without
                      measuring it; inert keeps a collapsed group out of the
                      tab order and the accessibility tree. */}
                  <div
                    id={groupId}
                    inert={!expanded ? true : undefined}
                    className={`grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none ${
                      expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <div className="pb-5">
                        <p className="text-sm text-gray-500">{section.description}</p>
                        {section.page && (
                          <Link
                            href={section.page.href}
                            onClick={onClose}
                            className="mt-3 inline-flex items-center gap-1.5 py-1 text-sm font-semibold text-primary underline-offset-4 hover:underline"
                          >
                            {section.page.label}
                            <ArrowRight className="size-4" aria-hidden="true" />
                          </Link>
                        )}
                        <ul className="mt-3">
                          {section.items.map((item) => (
                            <li key={item}>
                              <Link
                                href="#"
                                onClick={onClose}
                                className="block py-2 text-base font-medium text-brand-dark transition hover:text-primary"
                              >
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
            {NAV_LINKS.map((link) => (
              <li key={link.label} className="border-b border-gray-200">
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="block py-4 text-lg font-semibold text-brand-dark transition hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="px-4 pb-8 pt-6 sm:px-6">
          <Button asChild size="lg" className="h-12 w-full text-base">
            <Link
              href={CONTACT_HREF}
              onClick={() => {
                onClose();
                // Closing hands focus back to the toggle; move it on to the
                // contact block the page just scrolled to.
                requestAnimationFrame(() =>
                  document.getElementById(CONTACT_HREF.slice(1))?.focus({ preventScroll: true }),
                );
              }}
            >
              Fale com a gente
            </Link>
          </Button>
        </div>
      </div>
    </dialog>
  );
}
