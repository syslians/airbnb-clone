/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  target: 'serverless',
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "avatars.githubsercontent.com",
      "res.cloudinary.com"
    ]
  }
}

module.exports = nextConfig
