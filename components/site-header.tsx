"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4">
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
        <div className="flex items-center gap-2 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="border border-rose-800/60 bg-rose-900/40 text-rose-50 shadow-[0_10px_60px_-30px_rgba(255,70,100,0.9)] transition-colors hover:border-rose-500 hover:bg-rose-900/60"
                aria-label="Abrir menú"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="border-r border-rose-900/50 bg-[#12040a] px-0 text-rose-50 shadow-[0_20px_70px_-25px_rgba(255,70,120,0.8)]"
            >
              <div className="flex h-full flex-col">
                <SheetTitle className="sr-only">Menú principal</SheetTitle>
                <div className="border-b border-rose-900/50 bg-linear-to-b from-rose-950 via-rose-900/70 to-transparent px-6 pt-12 pb-6 text-sm text-rose-200">
                  <p className="text-xs font-semibold uppercase tracking-[0.4em] text-rose-400">
                    ReySoft
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-rose-50">
                    Multiservices
                  </h2>
                  <p className="mt-2 text-rose-200/80">
                    Innovación, soporte y confianza para tu red de dealers.
                  </p>
                </div>
                <div className="flex flex-1 flex-col gap-6 px-6 py-6">
                  <div className="flex flex-col gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.4em] text-rose-400">
                      Navegación
                    </p>
                    <div className="flex flex-col gap-2">
                      {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                          <SheetClose asChild key={item.href}>
                            <Button
                              asChild
                              variant="ghost"
                              className={cn(
                                "w-full justify-start rounded-xl bg-rose-900/30 text-base font-medium text-rose-100 backdrop-blur-md transition hover:bg-rose-900/50",
                                isActive &&
                                  "bg-rose-900/70 text-rose-50 shadow-inner"
                              )}
                            >
                              <Link className="block w-full" href={item.href}>
                                {item.label}
                              </Link>
                            </Button>
                          </SheetClose>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
