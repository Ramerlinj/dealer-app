import type { Metadata } from "next";

import { siteConfig } from "@/lib/site-config";
import HomeClient from "./home-client";

export const metadata: Metadata = {
  title: "Directorio de dealers en República Dominicana",
  description:
    "Encuentra dealers dominicanos por provincia, compara inventarios y conecta con concesionarios confiables cerca de ti.",
  keywords: [
    "dealers República Dominicana",
    "concesionarios dominicanos",
    "directorio de dealers",
    "inventario de vehículos",
    "Santo Domingo",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Directorio de dealers en República Dominicana",
    description:
      "Explora concesionarios por provincia, compara inventarios y conecta con dealers cercanos en R.D.",
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
    images: [
      {
        url: `${siteConfig.url}${siteConfig.ogImage}`,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} · Directorio de dealers`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Directorio de dealers en República Dominicana",
    description:
      "Encuentra dealers por provincia y conecta con concesionarios confiables en R.D.",
    images: [`${siteConfig.url}${siteConfig.ogImage}`],
  },
};

export default function HomePage() {
  return <HomeClient />;
}
