import Image from "next/image";
import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { logout } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/admin-auth";

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();

  return (
    <div className="min-h-screen bg-gray-50 text-brand-dark">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-6 sm:px-10">
          <Link href="/admin" aria-label="Painel do blog — início" className="flex items-center gap-4">
            <span className="relative block h-8 w-[83px] shrink-0 overflow-hidden">
              <Image
                src="/fbn-logo.png"
                alt=""
                width={166}
                height={78}
                className="absolute left-0 top-0 h-[39px] w-[83px]"
              />
            </span>
            <span className="hidden h-6 w-px bg-gray-200 sm:block" aria-hidden="true" />
            <span className="hidden text-sm font-semibold sm:block">Painel do blog</span>
          </Link>
          <nav className="ml-auto flex items-center gap-5 text-sm font-medium">
            <Link href="/admin" className="text-gray-600 hover:text-brand-dark">
              Artigos
            </Link>
            <Link href="/admin/contatos" className="text-gray-600 hover:text-brand-dark">
              Contatos
            </Link>
            <Link href="/blog" target="_blank" className="flex items-center gap-1.5 text-gray-600 hover:text-brand-dark">
              Ver blog
              <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
            </Link>
            <span className="hidden text-gray-500 md:block">{session.email}</span>
            <form action={logout}>
              <button
                type="submit"
                className="flex items-center gap-1.5 text-gray-600 hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <LogOut aria-hidden="true" className="h-4 w-4" />
                Sair
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-10 sm:px-10">{children}</main>
    </div>
  );
}
