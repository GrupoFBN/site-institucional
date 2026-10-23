export type UploadedImage = { src: string; width: number; height: number; alt: string };

// Uploads through the admin route, then measures the image in the browser so
// the saved post carries real dimensions (the blog needs them to avoid
// layout shift).
export async function uploadImage(file: File): Promise<UploadedImage> {
  const body = new FormData();
  body.set("file", file);
  const response = await fetch("/admin/upload", { method: "POST", body });
  const data = (await response.json()) as { url?: string; error?: string };
  if (!response.ok || !data.url) throw new Error(data.error ?? "Falha no envio da imagem.");
  const bitmap = await createImageBitmap(file);
  const size = { width: bitmap.width, height: bitmap.height };
  bitmap.close();
  return { src: data.url, alt: "", ...size };
}
