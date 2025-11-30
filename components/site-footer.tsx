import Link from "next/link";
import { Instagram, Facebook, Linkedin } from "lucide-react";

const socialLinks = [
  {
    href: "https://www.instagram.com/reysoft.multiservices",
    label: "Instagram",
    icon: Instagram,
  },
  {
    href: "https://www.facebook.com/reysoftmultiservices",
    label: "Facebook",
    icon: Facebook,
  },
  {
    href: "https://www.linkedin.com/company/reysoft-multiservices",
    label: "LinkedIn",
    icon: Linkedin,
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-rose-900/40 bg-[#120309]/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 text-sm text-rose-300 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold text-rose-100">ReySoft Multiservices</p>
          <p className="max-w-md text-pretty text-rose-300/90">
            Aceleramos redes de concesionarios dominicanos con experiencias
            digitales, automatizaciones y narrativa local enfocada en convertir.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {socialLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex size-10 items-center justify-center rounded-full border border-rose-900/50 text-rose-200 transition-colors hover:border-rose-500 hover:text-rose-100"
            >
              <span className="sr-only">{label}</span>
              <Icon className="size-5" />
            </Link>
          ))}
        </div>
        <p className="text-xs text-rose-500">
          © {new Date().getFullYear()} ReySoft Multiservices. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  );
}
