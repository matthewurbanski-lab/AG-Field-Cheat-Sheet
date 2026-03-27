/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow local images and any external images needed
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
