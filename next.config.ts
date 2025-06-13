import { NextConfig } from 'next';
import path from 'path';

/** @type {import('next').NextConfig} */
const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
      },
      {
        protocol: 'https',
        hostname: 'misc.scdn.co',
      },
      {
        protocol: 'https',
        hostname: 'open.spotify.com',
      },
    ],
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    config.watchOptions = {
      ignored: [
        '**/node_modules',
        '**/.next',
        '**/.git',
        '**/Application Data',
        '**/AppData'
      ]
    };
    return config;
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    }
  },
  // ビルド設定の最適化
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // ビルド出力の最適化
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
};

export default config;