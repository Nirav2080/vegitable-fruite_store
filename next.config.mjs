/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'placehold.co',
            },
            {
                protocol: 'https',
                hostname: 'i.pravatar.cc',
            },
             {
                protocol: 'https',
                hostname: 'api.dicebear.com',
            }
        ]
    }
};

export default nextConfig;
