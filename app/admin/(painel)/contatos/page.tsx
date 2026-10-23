import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { readLeads } from "@/lib/leads";

export const dynamic = "force-dynamic";

const WHEN = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo",
});

export default async function ContactsPage() {
  await requireAdmin();
  const leads = await readLeads();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Contatos</h1>
        <p className="mt-1 text-sm text-gray-600">
          Pessoas que preencheram um formulário de CTA nos artigos. {leads.length} no total.
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full min-w-[48rem] text-left text-sm">
          <thead className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">Nome</th>
              <th scope="col" className="px-4 py-3 font-medium">E-mail</th>
              <th scope="col" className="px-4 py-3 font-medium">Telefone</th>
              <th scope="col" className="px-4 py-3 font-medium">Empresa</th>
              <th scope="col" className="px-4 py-3 font-medium">Veio de</th>
              <th scope="col" className="px-4 py-3 font-medium">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {leads.map((lead) => (
              <tr key={lead.id} className="align-top">
                <td className="px-4 py-3 font-medium">{lead.name}</td>
                <td className="px-4 py-3 text-gray-600">
                  {lead.email ? (
                    <a href={`mailto:${lead.email}`} className="hover:underline">
                      {lead.email}
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-600">{lead.phone || "—"}</td>
                <td className="px-4 py-3 text-gray-600">{lead.company || "—"}</td>
                <td className="px-4 py-3 text-gray-600">
                  {lead.source ? (
                    <Link href={`/blog/${lead.source}`} target="_blank" className="hover:underline">
                      {lead.source}
                    </Link>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-600">{WHEN.format(new Date(lead.createdAt))}</td>
              </tr>
            ))}
            {leads.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-600">
                  Nenhum contato ainda. Eles aparecem aqui quando alguém enviar um formulário de CTA.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
