import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TITLE } from "@/lib/site";

// Required for the static-export build (`output: "export"`), which refuses
// metadata routes that aren't explicitly static.
export const dynamic = "force-static";

export const alt = `${SITE_NAME} — ${SITE_TITLE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Link-preview card (WhatsApp, LinkedIn, Facebook, Slack...): the real
// logo, tagline included, on white, with the category line on the brand
// navy band so the preview says what the company does, not just its name.
export default async function OpengraphImage() {
  const logo = await readFile(path.join(process.cwd(), "public", "fbn-logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#ffffff",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} alt="" width={715} height={336} />
        </div>
        <div
          style={{
            height: 110,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0B1440",
            color: "#ffffff",
            fontSize: 38,
            fontWeight: 600,
          }}
        >
          {SITE_TITLE}
        </div>
      </div>
    ),
    size,
  );
}
