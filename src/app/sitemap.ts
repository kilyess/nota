import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nota.ma";

  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    // Add more public routes here as needed
    // {
    //   url: `${baseUrl}/features`,
    //   lastModified: new Date(),
    //   changeFrequency: "monthly" as const,
    //   priority: 0.8,
    // },
  ];

  return routes;
}
