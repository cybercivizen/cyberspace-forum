import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // ← makes .next tiny
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "uploadthing.com",
      },
      {
        protocol: "https",
        hostname: "*.ufs.sh", // UploadThing CDN domain
      },
    ],
  },
  // add config to allow this url at 'https://api.resend.com/emails'
  async headers() {
    return [
      {
        source: "/emails",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "https://api.resend.com",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
