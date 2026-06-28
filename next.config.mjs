/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'pub-d0e7eeb8686c4d4f99d9d40b305dfa6d.r2.dev',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
