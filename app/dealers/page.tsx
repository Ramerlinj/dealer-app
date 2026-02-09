import type { Metadata } from "next";

import { siteConfig } from "@/lib/site-config";
import DealersClient from "./dealers-client";

export const metadata: Metadata = {
  title: "Dealers en República Dominicana",
  description:
    "Explora concesionarios aliados por provincia, conoce su ubicación y conecta con dealers confiables en R.D.",
  keywords: [
    "dealers República Dominicana",
    "concesionarios por provincia",
    "red de dealers",
    "Santo Domingo",
    "Samaná",
  ],
  alternates: {
    canonical: "/dealers",
  },
  openGraph: {
    title: "Dealers en República Dominicana",
    description:
      "Conoce la red de dealers aliados, filtra por provincia y conecta con concesionarios en R.D.",
    url: `${siteConfig.url}/dealers`,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
    images: [
      {
        url: `${siteConfig.url}${siteConfig.ogImage}`,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} · Dealers`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dealers en República Dominicana",
    description: "Explora concesionarios aliados por provincia en R.D.",
    images: [`${siteConfig.url}${siteConfig.ogImage}`],
  },
};

export default function DealersPage() {
  return <DealersClient />;
}
