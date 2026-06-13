import type { MetadataRoute } from "next";

const ROUTES = ["/", "/about", "/services", "/clients", "/team", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://byanyothername.com";
  return ROUTES.map((path) => ({
    url: `${base}${path === "/" ? "" : path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
