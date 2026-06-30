/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // TODO: thêm domain ảnh thật (CDN/S3) khi có
      { protocol: "https", hostname: "**" },
    ],
  },
};

module.exports = nextConfig;
