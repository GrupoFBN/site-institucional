import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { getSession } from "@/lib/admin-auth";

const TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};
const MAX_BYTES = 5 * 1024 * 1024;

// Image upload for the editor (cover and in-article images). Files land in
// public/uploads/<year>/<month>/ and are served from /uploads/...
export async function POST(request: Request) {
  if (!(await getSession())) return Response.json({ error: "Sessão expirada." }, { status: 401 });

  const file = (await request.formData()).get("file");
  if (!(file instanceof File)) return Response.json({ error: "Nenhum arquivo enviado." }, { status: 400 });

  // Extension comes from the declared type, never from the file name.
  const extension = TYPES[file.type];
  if (!extension) return Response.json({ error: "Use PNG, JPG, WebP ou GIF." }, { status: 415 });
  if (file.size > MAX_BYTES) return Response.json({ error: "A imagem passa de 5 MB." }, { status: 413 });

  const now = new Date();
  const folder = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}`;
  const base =
    file.name
      .replace(/\.[^.]+$/, "")
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "imagem";
  const name = `${base}-${randomBytes(4).toString("hex")}.${extension}`;

  const directory = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, name), Buffer.from(await file.arrayBuffer()));

  return Response.json({ url: `/uploads/${folder}/${name}` });
}
