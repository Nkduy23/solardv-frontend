/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" }, // ảnh upload qua Cloudinary
    ],
  },
};

module.exports = nextConfig;
