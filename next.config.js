/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/endzeit-survival-game' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/endzeit-survival-game' : '',
  experimental: {
    esmExternals: false
  }
}

module.exports = nextConfig
