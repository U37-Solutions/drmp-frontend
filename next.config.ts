import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  transpilePackages: ['maplibre-gl', '@vis.gl/react-maplibre'],
};

export default nextConfig;
