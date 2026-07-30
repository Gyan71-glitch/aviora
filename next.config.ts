import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pics.avs.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.travelboutiqueonline.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
