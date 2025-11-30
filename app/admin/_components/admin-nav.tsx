"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Mail } from "lucide-react";

import { cn } from "@/lib/utils";

const links = [
  {
    href: "/admin/dealers",
    label: "Dealers",
    icon: LayoutGrid,
  },
  {
    href: "/admin/messages",
    label: "Mensajes",
    icon: Mail,
  },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2">
      {links.map(({ href, label, icon: Icon }) => {
        const isActive = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              isActive
                ? "border-sky-500 bg-sky-50 text-sky-700"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
            )}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
