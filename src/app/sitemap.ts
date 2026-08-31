import type { MetadataRoute } from "next";

const SITE_URL = "https://aigiaoanpro.vn";
const ROUTES = ["", "/dieu-khoan", "/bao-mat", "/hoan-tien"];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));
}
