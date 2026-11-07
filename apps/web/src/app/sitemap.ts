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

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  return [
    {
      url: siteUrl,
    },
    {
      url: `${siteUrl}/join`,
    },
  ];
}
