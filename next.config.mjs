/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
       {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      }
    ],
  },
  // Disable the framework version header to reduce fingerprinting.
  poweredByHeader: false,
  async headers() {
    const securityHeaders = [
      // Prevent the site from being embedded in iframes (clickjacking protection).
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      // Stop browsers from MIME-sniffing responses away from the declared type.
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      // Limit referrer information sent to other origins.
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      // Lock down powerful browser features the storefront doesn't use.
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
      },
      // Force HTTPS for a year (only meaningful in production over TLS).
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains',
      },
      // Defense-in-depth against clickjacking via CSP frame-ancestors.
      {
        key: 'Content-Security-Policy',
        value: "frame-ancestors 'self';",
      },
    ];

    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
