module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    const isDev = process.env.NODE_ENV !== 'production';
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `default-src 'self'; script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ""}; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://*.supabase.co; connect-src 'self' https://*.supabase.co; font-src 'self' data:; frame-src 'none';`,
          },
        ],
      },
    ];
  },
  // Force HTTPS redirects (only in production)
  async redirects() {
    return process.env.NODE_ENV === 'production'
      ? [
          {
            source: '/(.*)',
            destination: 'https://%{host}/$1',
            permanent: true,
          },
        ]
      : [];
  },
};
