import type { NextConfig } from "next";

const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
  {
    protocol: "http",
    hostname: "localhost",
    port: "1337",
    pathname: "/uploads/**",
  },
];

const publicStrapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
if (publicStrapiUrl) {
  try {
    const { protocol, hostname, port } = new URL(publicStrapiUrl);
    remotePatterns.push({
      protocol: protocol.replace(":", "") as "http" | "https",
      hostname,
      port,
      pathname: "/uploads/**",
    });
  } catch {
    // NEXT_PUBLIC_STRAPI_URL inválida — ignora e mantém apenas o padrão local.
  }
}

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
    remotePatterns,
  },
};

export default nextConfig;
