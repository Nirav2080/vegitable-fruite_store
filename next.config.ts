import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    //
  },
  allowedDevOrigins: [
    'https://9000-firebase-studio-1756312899983.cluster-ejd22kqny5htuv5dfowoyipt52.cloudworkstations.dev',
    'https://6000-firebase-studio-1756312899983.cluster-ejd22kqny5htuv5dfowoyipt52.cloudworkstations.dev',
  ],
};

export default nextConfig;
