/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      // Images now go through /api/upload; this only needs to cover XLSX bulk-import files.
      bodySizeLimit: '4mb',
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
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
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
      // Admin product form needs the camera for in-page photo capture; every
      // other route keeps it locked down. Excluded from securityHeaders above
      // and split into these two non-overlapping sources so only one
      // Permissions-Policy value is ever sent for a given path.
      {
        source: '/admin/products/:path*',
        headers: [
          { key: 'Permissions-Policy', value: 'camera=self, microphone=(), geolocation=(), interest-cohort=()' },
        ],
      },
      {
        source: '/:path((?!admin/products).*)*',
        headers: [
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
