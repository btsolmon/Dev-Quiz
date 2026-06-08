// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Энд өөрийн нэмэлт тохиргоонуудыг бичиж болно */
  reactStrictMode: true, // React-ийн алдааг эрт илрүүлэх горим

  // Жишээ нь: Хэрэв гаднаас зураг авч ашигладаг бол энд домэйнээ бүртгэнэ
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com", // Өөрийн ашиглах вэб сайтаа нэмээрэй
      },
    ],
  },
};

export default nextConfig;
