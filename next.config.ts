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
      {
        protocol: "https",
        hostname: "extranet.sourcemytrip.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.sourcemytrip.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "assets.duffel.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "*.activitiesbank.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.activitiesbank.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "media.stage.activitiesbank.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media.stage.activitiesbank.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
