import type { Metadata } from "next";

// The panel is private: keep it out of search results and previews.
export const metadata: Metadata = {
  title: { absolute: "Painel do blog | Grupo FBN" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
