import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default:
      "ReySoft Multiservices | Ecosistemas digitales para dealers dominicanos",
    template: "%s | ReySoft Multiservices",
  },
  description:
    "ReySoft Multiservices impulsa redes de concesionarios dominicanos con experiencias digitales, datos accionables y narrativa local.",
  metadataBase: new URL("https://reysoft.do"),
  keywords: [
    "dealers",
    "concesionarios",
    "autos",
    "República Dominicana",
    "transformación digital",
    "marketing automotriz",
  ],
  openGraph: {
    title:
      "ReySoft Multiservices | Ecosistemas digitales para dealers dominicanos",
    description:
      "Activamos vitrinas digitales y automatizaciones para redes de concesionarios en toda República Dominicana.",
    url: "https://reysoft.do",
    siteName: "ReySoft Multiservices",
    locale: "es_DO",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background text-foreground antialiased`}
      >
        <div className="relative min-h-screen bg-[radial-gradient(circle_at_top,rgba(190,13,60,0.2),transparent_55%),#0b0306]">
          <SiteHeader />
          <main className="relative mx-auto min-h-[calc(100dvh-14rem)] w-full max-w-6xl px-4 py-16">
            {children}
          </main>
          <SiteFooter />
        </div>
        <Toaster position="top-right" richColors closeButton />
        <Analytics />
      </body>
    </html>
  );
}
