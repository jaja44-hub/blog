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
      {
        source: '/category/media-information',
        destination: '/category/media-and-information',
        permanent: true,
      },
      {
        source: '/category/markets-investment',
        destination: '/category/markets-and-investment',
        permanent: true,
      },
      {
        source: '/category/economics-finance',
        destination: '/category/economics-and-finance',
        permanent: true,
      },
      {
        source: '/category/business-enterprise',
        destination: '/category/business-enterprise-fundamentals',
        permanent: true,
      },
      {
        source: '/category/real-estate-housing',
        destination: '/category/real-estate-fundamentals',
        permanent: true,
      },
      {
        source: '/category/contracts-consumer-safety',
        destination: '/category/contracts-and-consumer-safety',
        permanent: true,
      },
    ];
  },
};
export default nextConfig;
