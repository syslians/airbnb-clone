/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: [
       "lh3.googleusercontent.com",
      "avatars.githubsercontent.com",
      "res.cloudinary.com"
    ]
  }
}

module.exports = nextConfig
