import type { Metadata } from "next";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Sobre ReySoft Multiservices",
  description:
    "Conoce al equipo dominicano detrás de la transformación digital de dealers en República Dominicana.",
  keywords: [
    "equipo ReySoft",
    "estrategia digital",
    "dealers dominicanos",
    "marketing automotriz",
  ],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "Sobre ReySoft Multiservices",
    description:
      "Estrategas y especialistas locales impulsando concesionarios en República Dominicana.",
    url: `${siteConfig.url}/about`,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
    images: [
      {
        url: `${siteConfig.url}${siteConfig.ogImage}`,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} · Sobre nosotros`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sobre ReySoft Multiservices",
    description:
      "Conoce al equipo dominicano detrás de la transformación digital de dealers.",
    images: [`${siteConfig.url}${siteConfig.ogImage}`],
  },
};

export default function AboutPage() {
  return (
    <div className="grid gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
      <div className="space-y-6">
        <Badge variant={"destructive"}>Nuestra historia en R.D.</Badge>

        <h1 className="text-balance text-3xl font-semibold text-slate-100 md:text-4xl">
          Elevamos la presencia digital de dealers dominicanos con ambición
          boutique.
        </h1>
        <p className="text-pretty text-lg text-slate-400">
          Somos un equipo dominicano de estrategas, diseñadores y especialistas
          en datos. Trabajamos con concesionarios que desean destacar con un
          discurso honesto, un inventario impecable y experiencias digitales que
          hablan el lenguaje del Caribe.
        </p>
        <div className="rounded-2xl border border-rose-900/45 bg-[#1d0a11]/85 p-6 shadow-[0_45px_120px_-70px_rgba(255,70,105,0.85)] backdrop-blur">
          <h2 className="text-xl font-semibold text-slate-100">
            Lo que nos mueve
          </h2>
          <p className="mt-3 text-pretty text-slate-300">
            Acompañamos a nuestros aliados desde el concepto hasta la ejecución,
            integrando datos locales, producción fotográfica tropical y activos
            interactivos que convierten visitas en test drives.
          </p>
        </div>
      </div>
      <div className="relative h-[520px] overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-[0_35px_80px_-40px_rgba(15,46,87,0.6)]">
        <div className="absolute inset-0 bg-slate-100" />
        <Image
          src="https://images.pexels.com/photos/3182753/pexels-photo-3182753.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="Equipo creativo dominicano trabajando en estrategia digital"
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 45vw, 90vw"
          priority
        />
        <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/70 bg-white/85 p-5 backdrop-blur">
          <p className="text-sm font-semibold text-slate-900">
            Metodología Drive Alliance
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Mesas tácticas quincenales, analítica compartida y planes de
            crecimiento personalizados para cada concesionario.
          </p>
        </div>
      </div>
    </div>
  );
}
