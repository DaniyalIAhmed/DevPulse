import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // hostname: "avatars.githubusercontent.com",
        hostname: "**",
        port: "",
        pathname: "**",
      },
    ],
  }
};

export default nextConfig;
