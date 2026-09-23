import type { MetadataRoute } from "next";

// Private while in development: disallow every crawler
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", disallow: "/" } };
}
