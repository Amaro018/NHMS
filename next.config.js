const { withBlitz } = require("@blitzjs/next")

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
    serverComponentsExternalPackages: ["jsonwebtoken", "secure-password", "sodium-native"],
  },
}

module.exports = withBlitz(nextConfig)
