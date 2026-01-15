/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/vi/**',
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        pathname: '**',
      },
    ],
    // Add quality levels to fix the warning
    qualities: [50, 75, 85, 90, 100],
    // Increase timeout for slow TMDB image responses
    minimumCacheTTL: 60,
    // Add unoptimized for better stability with external images
    unoptimized: false,
  },
  // Add experimental features for better image handling
  experimental: {
    // This helps with image loading performance
    optimizePackageImports: ['lucide-react'],
  },
}

module.exports = nextConfig