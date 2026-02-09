import type { Metadata } from "next";

import { siteConfig } from "@/lib/site-config";
import ContactClient from "./contact-client";

export const metadata: Metadata = {
  title: "Contacto para dealers dominicanos",
  description:
    "Coordina una llamada y recibe un diagnóstico digital para tu red de concesionarios en República Dominicana.",
  keywords: [
    "contacto dealers",
    "consultoría digital",
    "concesionarios República Dominicana",
    "estrategia automotriz",
  ],
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contacto para dealers dominicanos",
    description:
      "Coordina una llamada con ReySoft y activa el crecimiento digital de tu red.",
    url: `${siteConfig.url}/contact`,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
    images: [
      {
        url: `${siteConfig.url}${siteConfig.ogImage}`,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} · Contacto`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contacto para dealers dominicanos",
    description:
      "Coordina una llamada y recibe un diagnóstico digital para tu red de concesionarios.",
    images: [`${siteConfig.url}${siteConfig.ogImage}`],
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
