import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

// Contacts captured by the form CTAs. Local build: a JSON file next to the
// posts. On the server this moves to the database, and LEAD_WEBHOOK_URL
// (an n8n/CRM webhook) can receive every lead as it arrives.
export type Lead = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: string;
  ctaTitle: string;
};

const FILE = path.join(process.cwd(), "content", "leads.json");

export async function readLeads(): Promise<Lead[]> {
  try {
    return JSON.parse(await readFile(FILE, "utf8")) as Lead[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

export async function addLead(lead: Lead) {
  const leads = await readLeads();
  await mkdir(path.dirname(FILE), { recursive: true });
  const temp = `${FILE}.tmp`;
  await writeFile(temp, JSON.stringify([lead, ...leads]));
  await rename(temp, FILE);
}
