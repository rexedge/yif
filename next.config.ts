import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/yoruba-world-day-2026",
        destination: "/events/yoruba-world-day-2026",
        permanent: false,
      },
      {
        source: "/ywd2026",
        destination: "/events/yoruba-world-day-2026",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
