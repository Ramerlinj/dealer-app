import type { Metadata } from "next";

import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Acceder al panel de dealers",
  description:
    "Inicia sesión para administrar tu perfil de dealer y tus mensajes en ReySoft Multiservices.",
  alternates: {
    canonical: "/acceder",
  },
  openGraph: {
    title: "Acceder al panel de dealers",
    description:
      "Inicia sesión para administrar tu perfil de dealer en ReySoft Multiservices.",
    url: `${siteConfig.url}/acceder`,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
    images: [
      {
        url: `${siteConfig.url}${siteConfig.ogImage}`,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} · Acceder`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Acceder al panel de dealers",
    description:
      "Inicia sesión para administrar tu perfil de dealer en ReySoft Multiservices.",
    images: [`${siteConfig.url}${siteConfig.ogImage}`],
  },
};

function Acceder() {
  return <div>Acceder page</div>;
}

export default Acceder;
