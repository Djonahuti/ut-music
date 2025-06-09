import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pnlrwlplfsxmtfwejjga.supabase.co",
      },
    ],
  },
};

export default nextConfig;
