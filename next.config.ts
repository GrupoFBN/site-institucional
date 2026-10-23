import type { NextConfig } from "next";

// BASE_PATH only set for the static-export preview build (e.g. grupofbn.com.br/site-teste);
// unset in normal dev/prod so the real deploy at the domain root is unaffected.
const basePath = process.env.BASE_PATH || "";

const isStaticExport = process.env.STATIC_EXPORT === "1";

// Baseline hardening headers. Not available in the static-export build
// (there's no Next server to send them) — for that build, set the same
// headers on the web server in front of the files (Apache/Nginx/cPanel).
// CSP and HSTS are left out on purpose: CSP needs an allowlist of every
// script/image origin the site uses, and HSTS belongs to the domain's
// host, not to one app on a subpath.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  ...(isStaticExport ? { output: "export" as const, basePath, assetPrefix: basePath, trailingSlash: true } : {}),
  poweredByHeader: false,
  ...(isStaticExport
    ? {}
    : { headers: async () => [{ source: "/(.*)", headers: securityHeaders }] }),
  // Next's dev server only serves JS chunks/HMR to requests whose Origin
  // matches an allowed list — localhost by default. Opening the dev
  // server from another machine on the LAN (a different Origin) got its
  // chunks 403'd, so the page loaded but never hydrated: visible nav,
  // dead hover/click. `allowedDevOrigins` only takes literal hostnames or
  // wildcard subdomains (confirmed against the dev server's own warning
  // log), not CIDR ranges — this is this machine's current LAN IP
  // (`ipconfig`, Ethernet adapter); it'll need updating if that IP
  // changes (new network, DHCP lease renewal, etc).
  allowedDevOrigins: ["192.168.70.106"],
  images: {
    unoptimized: process.env.STATIC_EXPORT === "1",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "grupofbn.com.br",
      },
      {
        protocol: "https",
        hostname: "blog.grupofbn.com.br",
      },
      {
        protocol: "https",
        hostname: "franquiaprotegida.com.br",
      },
    ],
  },
};

export default nextConfig;
