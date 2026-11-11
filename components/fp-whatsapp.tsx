"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { FP_WHATSAPP as CONTACTS } from "@/lib/fp-contacts";

// The green button fixed to the corner, as on the current site. It offers
// both numbers the program lists (Kleber and Gabriela).
export function FpWhatsapp() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-30 flex flex-col items-end gap-3">
      {open ? (
        <ul className="w-56 overflow-hidden rounded-xl bg-white text-sm shadow-lg">
          {CONTACTS.map((contact) => (
            <li key={contact.name} className="border-b border-[#E6E4E2] last:border-0">
              <a
                href={contact.href}
                target="_blank"
                rel="noopener"
                className="flex flex-col px-4 py-3 text-[#13192C] transition hover:bg-[#F8F8FF]"
              >
                <span className="font-semibold">{contact.name}</span>
                <span className="text-gray-500">{contact.phone}</span>
              </a>
            </li>
          ))}
        </ul>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-label={open ? "Fechar contatos do WhatsApp" : "Falar pelo WhatsApp"}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
      >
        {open ? <X aria-hidden="true" className="h-6 w-6" /> : <MessageCircle aria-hidden="true" className="h-7 w-7" />}
      </button>
    </div>
  );
}
