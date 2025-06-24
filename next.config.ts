import type { NextConfig } from 'next';

const config: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'static2.finnhub.io' },
      { protocol: 'https', hostname: 'image.cnbcfm.com' },   // For CNBC
      { protocol: 'https', hostname: 'www.reuters.com' },    // For Reuters
      { protocol: 'https', hostname: 's.yimg.com' },         // For Yahoo Finance
      { protocol: 'https', hostname: 'i.insider.com' },      // For Business Insider
      { protocol: 'https', hostname: 'data.bloomberglp.com' }, // ✅ Added for Bloomberg
    ],
  },
};

export default config;
