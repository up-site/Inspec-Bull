/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  webpack: (config) => {
    // Handle the file extensions
    config.resolve.extensions.push('.ts', '.tsx');
    return config;
  },
}

module.exports = nextConfig;