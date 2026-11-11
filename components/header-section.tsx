import type { Ref } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import type { NavSection } from "@/lib/nav";

// One desktop nav section: its trigger and, right after it in DOM order, its
// dropdown panel, so Tab goes from the trigger straight into the links. The
// open/close state, hover delay and curtain sizing all live in header.tsx.
export function HeaderSection({
  section,
  active,
  shown,
  animate,
  light,
  originY,
  triggerRef,
  panelRef,
  onHoverStart,
  onHoverEnd,
  onToggle,
  onNavigate,
}: {
  section: NavSection;
  active: boolean;
  // The section the curtain is currently sized for (the last open one).
  shown: boolean;
  animate: boolean;
  // The bar is white (anything but transparent over the hero).
  light: boolean;
  // The curtain's top edge, relative to the panel's own top.
  originY: number;
  triggerRef: Ref<HTMLButtonElement>;
  panelRef: Ref<HTMLDivElement>;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  return (
    // Hover only for a real mouse: a tap fires pointerenter and then click,
    // which would open and instantly re-close it.
    <div
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") onHoverStart();
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") onHoverEnd();
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        onClick={onToggle}
        aria-expanded={active}
        aria-controls={`nav-menu-${section.id}`}
        className={`flex items-center gap-1 whitespace-nowrap transition ${
          light ? (active ? "font-semibold text-brand-dark" : "hover:text-brand-dark") : "hover:text-white"
        } ${!light && active ? "text-white" : ""}`}
      >
        {section.label}
        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 transition-transform duration-200 ${active ? "rotate-180" : ""}`}
        />
      </button>
      {/* Unscaled clip box right under the row (its nearest `relative`
          ancestor), full width. The panel inside scales from the curtain's
          top edge so both move as one sheet; while small that pulls its
          content up over the row, so the clip keeps it (and its hit area)
          below the row. text-base/font-normal undo the nav row's text. */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-full overflow-hidden ${shown ? "" : "invisible"}`}
      >
        <div
          ref={panelRef}
          id={`nav-menu-${section.id}`}
          data-nav-panel={section.id}
          inert={!active ? true : undefined}
          style={{ transformOrigin: `center ${originY}px` }}
          className={`pointer-events-auto grid grid-cols-1 gap-8 px-6 py-10 text-base font-normal sm:grid-cols-[minmax(0,20rem)_1fr] xl:px-10 ${
            active ? "scale-y-100" : "scale-y-0"
          } ${shown && animate ? "transition-transform duration-200 ease-out" : ""}`}
        >
          <div>
            <p className="text-xl font-semibold text-brand-dark">{section.label}</p>
            <p className="mt-2 max-w-xs text-sm text-gray-500">{section.description}</p>
            {section.page && (
              <Link
                href={section.page.href}
                onClick={onNavigate}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 transition hover:underline"
              >
                {section.page.label}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            )}
          </div>
          <ul className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            {section.items.map((item) => (
              <li key={item}>
                <Link
                  href="#"
                  onClick={onNavigate}
                  className="text-base font-medium text-brand-dark transition hover:text-primary"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
