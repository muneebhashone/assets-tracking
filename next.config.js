/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: "fratezone.s3.us-east-2.amazonaws.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/bucket/:path*",
        destination: `${process.env.S3_BUCKET_URL}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
