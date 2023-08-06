/** @type {import('next').NextConfig} */
const nextConfig = { 
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "avatars.githubsercontent.com",
      "res.cloudinary.com"
    ]
  },
  experimental: {
    appDir: true,
  }
}

module.exports = nextConfig
