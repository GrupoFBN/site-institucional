import { randomUUID } from "node:crypto";
import { addLead } from "@/lib/leads";

// Receives the form CTAs from articles. Public by design, so it defends
// itself: a hidden honeypot field, strict validation, length caps and a
// small per-IP rate limit (in memory — fine for one server process).
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (limited(ip)) {
    return Response.json({ error: "Muitas tentativas. Tente de novo em alguns minutos." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Pedido inválido." }, { status: 400 });
  }

  // Bots fill every field. Pretend it worked so they don't retry.
  if (clean(body.website, 100)) return Response.json({ ok: true });

  const name = clean(body.name, 120);
  const email = clean(body.email, 160);
  const phone = clean(body.phone, 30);
  const company = clean(body.company, 120);

  if (name.length < 2) return Response.json({ error: "Informe seu nome." }, { status: 422 });
  if (!email && !phone) {
    return Response.json({ error: "Informe um e-mail ou telefone para contato." }, { status: 422 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "E-mail inválido." }, { status: 422 });
  }
  if (phone && phone.replace(/\D/g, "").length < 10) {
    return Response.json({ error: "Telefone inválido. Inclua o DDD." }, { status: 422 });
  }

  const lead = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    name,
    email,
    phone,
    company,
    source: clean(body.source, 120),
    ctaTitle: clean(body.ctaTitle, 200),
  };
  await addLead(lead);

  // Optional hand-off to n8n / the CRM. Never blocks or fails the visitor.
  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (webhook) {
    void fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(5000),
    }).catch(() => {});
  }

  return Response.json({ ok: true });
}
