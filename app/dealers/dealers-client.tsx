"use client";

import Link from "next/link";
import { AlertCircle, ArrowUpRight, MapPin, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DealerCard } from "./_components/dealer-card";
import type { Dealer } from "./types";

type FetchState = {
  data: Dealer[];
  loading: boolean;
  error: string | null;
};

const DEFAULT_PROVINCE = "todos";

function extractProvince(location: string) {
  return location.split(",")[0]?.trim() ?? location;
}

export default function DealersClient() {
  const [{ data: dealers, loading, error }, setState] = useState<FetchState>({
    data: [],
    loading: true,
    error: null,
  });
  const [provinceFilter, setProvinceFilter] =
    useState<string>(DEFAULT_PROVINCE);

  useEffect(() => {
    let active = true;

    async function loadDealers() {
      try {
        const response = await fetch("/api/dealers", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("No se pudo obtener la lista de dealers");
        }
        const payload = (await response.json()) as Dealer[];
        if (active) {
          setState({ data: payload, loading: false, error: null });
        }
      } catch (fetchError) {
        if (active) {
          setState({
            data: [],
            loading: false,
            error:
              fetchError instanceof Error
                ? fetchError.message
                : "Ocurrió un error inesperado",
          });
        }
      }
    }

    loadDealers();

    return () => {
      active = false;
    };
  }, []);

  const provinces = useMemo(() => {
    if (!dealers.length) {
      return [] as string[];
    }

    const unique = new Set<string>();
    for (const dealer of dealers) {
      unique.add(extractProvince(dealer.location));
    }

    return Array.from(unique).sort((a, b) => a.localeCompare(b, "es"));
  }, [dealers]);

  const filteredDealers =
    provinceFilter === DEFAULT_PROVINCE
      ? dealers
      : dealers.filter(
          (dealer) => extractProvince(dealer.location) === provinceFilter,
        );

  const isFilterDisabled = loading || provinces.length === 0;
  const hasActiveFilter = provinceFilter !== DEFAULT_PROVINCE;
  const availableProvinces = provinces.length;
  const visibleDealersCount = filteredDealers.length;

  return (
    <motion.div
      className="flex flex-col gap-12"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="space-y-5">
        <Badge className="border-transparent bg-sky-600 text-white hover:bg-sky-700">
          Nuestra red
        </Badge>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-4">
            <h1 className="text-3xl font-semibold md:text-4xl">
              Dealers aliados en República Dominicana
            </h1>
            <p className="max-w-2xl text-pretty text-slate-400">
              Trabajamos con concesionarios que viven el ritmo caribeño y
              ofrecen un servicio impecable desde Santo Domingo hasta Samaná.
              Todos pasan por auditorías trimestrales y reportes digitales
              centralizados.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-5 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-sky-300 hover:text-sky-700"
          >
            Unirme como dealer
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>

      <div className="rounded-[36px] border border-rose-900/40 bg-linear-to-br from-[#1b0409] via-[#120308] to-[#090205] p-5 text-rose-50 shadow-[0_45px_120px_-70px_rgba(255,70,105,0.8)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <span className="rounded-2xl bg-rose-500/15 p-3 text-rose-100">
              <MapPin className="size-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-white">
                Filtrar por provincia
              </p>
              <p className="text-xs text-rose-200/80">
                {loading
                  ? "Cargando la red de dealers..."
                  : `Mostrando ${visibleDealersCount} ${
                      visibleDealersCount === 1 ? "dealer" : "dealers"
                    } en ${availableProvinces || 0} provincias`}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {hasActiveFilter && (
              <span className="inline-flex items-center gap-2 rounded-full border border-rose-400/30 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-100">
                <span className="text-rose-300/70">Provincia:</span>
                <span className="text-white">{provinceFilter}</span>
              </span>
            )}
            <Select
              value={provinceFilter}
              onValueChange={setProvinceFilter}
              disabled={isFilterDisabled}
            >
              <SelectTrigger
                disabled={isFilterDisabled}
                className="min-w-[220px] rounded-2xl border border-rose-900/60 bg-[#0c0307]/70 px-4 py-4 text-sm font-semibold text-rose-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] ring-offset-[#14040a] focus:ring-2 focus:ring-rose-400/40"
              >
                <SelectValue placeholder="Todas las provincias" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border border-rose-900/40 bg-[#12040a]/95 text-rose-50 shadow-[0_35px_90px_-55px_rgba(255,70,105,0.65)]">
                <SelectItem value={DEFAULT_PROVINCE}>
                  Todas las provincias
                </SelectItem>
                {provinces.map((province) => (
                  <SelectItem key={province} value={province}>
                    {province}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasActiveFilter && (
              <button
                type="button"
                onClick={() => setProvinceFilter(DEFAULT_PROVINCE)}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/95 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-900 transition hover:bg-rose-50"
              >
                <RotateCcw className="size-3.5" />
                Reiniciar
              </button>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={`skeleton-${index}`}
              className="animate-pulse rounded-3xl border border-slate-100 bg-white/60 p-6 shadow-[0_20px_45px_-35px_rgba(15,46,87,0.45)]"
            >
              <div className="space-y-4">
                <div className="h-4 w-24 rounded-full bg-slate-200" />
                <div className="h-6 w-40 rounded-full bg-slate-200" />
                <div className="h-4 w-full rounded-full bg-slate-200" />
                <div className="h-4 w-2/3 rounded-full bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-6 text-rose-100">
          <div className="flex items-center gap-3 text-sm">
            <AlertCircle className="size-5" />
            <p>{error}</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredDealers.map((dealer) => (
            <DealerCard key={dealer.id} dealer={dealer} />
          ))}
        </div>
      )}
    </motion.div>
  );
}
