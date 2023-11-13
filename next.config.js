/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      // 다른 외부 이미지 호스팅 도메인이 있다면 여기에 추가하세요.
    ],
  },
  // 다른 설정들...
}

module.exports = nextConfig;
