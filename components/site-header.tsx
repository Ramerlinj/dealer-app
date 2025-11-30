"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/dealers", label: "Dealers" },
  { href: "/about", label: "Sobre nosotros" },
  { href: "/contact", label: "Contacto" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-rose-900/40 bg-[#14060b]/90 shadow-[0_20px_60px_-40px_rgba(255,70,100,0.65)] backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Link
          href="/"
          className="text-left font-semibold uppercase tracking-[0.28em] text-rose-100"
        >
          ReySoft Multiservices
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Button
                key={item.href}
                asChild
                variant="ghost"
                size="sm"
                className={cn(
                  "text-sm font-medium text-rose-200 transition-colors hover:bg-rose-900/40 hover:text-rose-50",
                  isActive && "bg-rose-900/55 text-rose-50 shadow-inner"
                )}
              >
                <Link href={item.href}>{item.label}</Link>
              </Button>
            );
          })}
        </nav>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="border-rose-800/50 bg-rose-900/40 text-rose-100 transition-colors hover:border-rose-500 hover:bg-rose-900/60 md:hidden"
        >
          <Link href="/contact">Contacto</Link>
        </Button>
      </div>
    </header>
  );
}
