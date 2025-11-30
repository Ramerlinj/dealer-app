import type { ReactNode } from "react";

import { AdminNav } from "./_components/admin-nav";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <section className="space-y-8">
      <div className="rounded-2xl border border-rose-900/45 bg-[#1d0a11]/85 p-6 shadow-[0_45px_120px_-70px_rgba(255,70,105,0.85)] backdrop-blur">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-200">
            Panel
          </p>
          <h1 className="text-3xl font-semibold text-slate-100">
            Panel administrativo
          </h1>
          <p className="text-sm text-slate-400">
            Gestiona la red de dealers y las conversaciones entrantes en tiempo
            real.
          </p>
        </div>
        <div className="mt-6">
          <AdminNav />
        </div>
      </div>
      <div>{children}</div>
    </section>
  );
}
