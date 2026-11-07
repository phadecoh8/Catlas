import type { MetadataRoute } from "next";

function getSiteUrl() {
  const configuredUrl = process.env.SITE_URL;

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  const vercelHost = process.env.VERCEL_URL;

  if (vercelHost) {
    return `https://${vercelHost}`;
  }

  return "http://localhost:3000";
}

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: [
        "/admin/",
        "/api/",
        "/home",
        "/search",
        "/classroom/",
        "/settings/",
        "/location/",
        "/navigate/",
        "/near-me",
        "/bookmarks",
        "/notifications",
        "/catline",
      ],
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
