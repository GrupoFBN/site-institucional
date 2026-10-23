import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

// BASE_PATH is only set for the static-export build served from a
// subpath (e.g. /site-teste, see next.config.ts). Manifest URLs are plain
// strings Next doesn't prefix, so without this the start URL and icon would
// point at the domain root instead of the subpath.
const BASE_PATH = process.env.BASE_PATH ?? "";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "FBN",
    description: SITE_DESCRIPTION,
    start_url: `${BASE_PATH}/`,
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0B1440",
    lang: "pt-BR",
    icons: [{ src: `${BASE_PATH}/icon-512.png`, sizes: "512x512", type: "image/png", purpose: "any" }],
  };
}
