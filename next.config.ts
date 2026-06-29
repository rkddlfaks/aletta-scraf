import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'yyixqbwfpcocsgllbczl.supabase.co',
      },
    ],
  },
};

export default nextConfig;
