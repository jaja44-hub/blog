/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }]
  },
  async redirects() {
    return [
      {
        source: '/posts/real-estate',
        destination: '/posts/real-estate-fundamentals',
        permanent: true,
      },
      {
        source: '/posts/real-estate-housing',
        destination: '/posts/real-estate-fundamentals',
        permanent: true,
      },
      {
        source: '/posts/media-information',
        destination: '/posts/media-and-information',
        permanent: true,
      },
      {
        source: '/posts/markets-investment',
        destination: '/posts/markets-and-investment',
        permanent: true,
      },
      {
        source: '/posts/economics-finance',
        destination: '/posts/economics-and-finance',
        permanent: true,
      },
      {
        source: '/posts/business-enterprise',
        destination: '/posts/business-enterprise-fundamentals',
        permanent: true,
      },
      {
        source: '/privacy',
        destination: '/privacy-policy',
        permanent: true,
      },
    ];
  },
};
export default nextConfig;
