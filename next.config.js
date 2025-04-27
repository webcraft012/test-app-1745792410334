/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    esmExternals: true,
    instrumentationHook: true,
  },
  transpilePackages: ["zustand"],
  // async headers() {
  //   return [
  //     {
  //       source: "/(.*)",
  //       headers: [
  //         {
  //           key: "Content-Security-Policy",
  //           value: "frame-ancestors 'self' *; frame-src 'self' *;",
  //         },
  //         {
  //           key: "Access-Control-Allow-Origin",
  //           value: "*",
  //         },
  //         {
  //           key: "Cross-Origin-Opener-Policy",
  //           value: "same-origin-allow-popups",
  //         },
  //         {
  //           key: "Cross-Origin-Embedder-Policy",
  //           value: "credentialless",
  //         },
  //       ],
  //     },
  //   ];
  // },
};

module.exports = nextConfig;
