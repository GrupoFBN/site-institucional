import Image from "next/image";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { getSession } from "@/lib/admin-auth";

export default async function LoginPage() {
  if (await getSession()) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-6 py-16">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-sm sm:p-10">
        <div className="relative mb-8 block h-[46px] w-[120px] overflow-hidden">
          <Image
            src="/fbn-logo.png"
            alt="Grupo FBN"
            width={240}
            height={113}
            priority
            className="absolute left-0 top-0 h-[56px] w-[120px]"
          />
        </div>
        <h1 className="text-2xl font-semibold text-brand-dark">Painel do blog</h1>
        <p className="mb-8 mt-2 text-sm text-gray-600">Entre para escrever e publicar artigos.</p>
        <LoginForm />
      </div>
    </main>
  );
}
