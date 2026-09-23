/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Private while in development: tell crawlers not to index any response
  async headers() {
    return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
}

module.exports = nextConfig
