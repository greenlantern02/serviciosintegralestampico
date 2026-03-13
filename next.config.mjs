import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.R2_PUBLIC_DOMAIN ?? "placeholder.invalid",
      },
    ],
  },
};

export default nextConfig;
