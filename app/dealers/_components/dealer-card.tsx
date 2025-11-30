"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Facebook,
  Globe,
  Instagram,
  MapPin,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import type { Dealer } from "../types";

const SOCIAL_ICON_MAP = {
  instagram: Instagram,
  facebook: Facebook,
  web: Globe,
  youtube: Youtube,
  twitter: Twitter,
} as const;

const MAX_VISIBLE_SOCIALS = 2;
const CARD_DESCRIPTION_WORD_LIMIT = 15;

function getSocialIcon(type: string) {
  return SOCIAL_ICON_MAP[type as keyof typeof SOCIAL_ICON_MAP] ?? Globe;
}

function truncateDescription(description: string, limit = CARD_DESCRIPTION_WORD_LIMIT) {
  const normalized = description.trim();
  if (!normalized) {
    return description;
  }

  const words = normalized.split(/\s+/);
  if (words.length <= limit) {
    return description;
  }

  return `${words.slice(0, limit).join(" ")}…`;
}

type DealerCardProps = {
  dealer: Dealer;
  delay?: number;
};

export function DealerCard({ dealer, delay = 0 }: DealerCardProps) {
  const uniqueSocials = dealer.socials.filter(
    (social, index, array) =>
      array.findIndex((item) => item.type === social.type) === index
  );
  const visibleSocials = uniqueSocials.slice(0, MAX_VISIBLE_SOCIALS);
  const remainingSocials = uniqueSocials.length - visibleSocials.length;
  const truncatedDescription = truncateDescription(dealer.description);

  return (
    <Dialog>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay }}
      >
        <Card className="flex h-full flex-col overflow-hidden rounded-[28px] border border-rose-900/45 bg-[#14040a]/95 text-rose-50 shadow-[0_45px_120px_-70px_rgba(255,70,105,0.9)]">
          <div className="relative h-56 w-full overflow-hidden bg-black/20">
            <Image
              src={dealer.image}
              alt={`banner ${dealer.name}`}
              fill
              className="object-cover rounded-sm"
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            />
            <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800">
              <span className="size-2 rounded-full bg-emerald-400" />
              {dealer.focus}
            </div>
          </div>
          <CardHeader className="flex flex-1 flex-col gap-3 border-b border-white/5 bg-linear-to-b from-white/5 to-transparent">
            <div className="space-y-1 mt-2">
              <CardTitle className="text-2xl font-semibold text-white">
                {dealer.name}
              </CardTitle>
              <p className="text-sm text-rose-200">{dealer.location}</p>
            </div>
            <CardDescription className="text-pretty text-rose-100/80">
              {truncatedDescription}
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col gap-5 bg-[#0c0307]/70 p-6">
            <div className="space-y-3 text-sm text-rose-200">
              <div className="flex items-start gap-3">
                <span className="rounded-full bg-rose-500/20 p-2 text-rose-200">
                  <MapPin className="size-4" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-rose-400/80">
                    Dirección
                  </p>
                  <p className="font-medium text-rose-100">{dealer.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-rose-500/20 p-2 text-rose-200">
                  <Phone className="size-4" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-rose-400/80">
                    Contacto
                  </p>
                  <p className="font-medium text-rose-100">{dealer.phone}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {visibleSocials.map((social) => {
                const Icon = getSocialIcon(social.type);
                return (
                  <Link
                    key={`${dealer.id}-${social.type}`}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-sm font-medium text-white transition hover:border-rose-400/60 hover:bg-white/20"
                  >
                    <Icon className="size-4" />
                    <span className="capitalize">{social.type}</span>
                  </Link>
                );
              })}
              {remainingSocials > 0 && (
                <DialogTrigger asChild>
                  <button className="inline-flex items-center rounded-full border border-dashed border-white/20 bg-transparent px-2 py-1.5 text-xs font-semibold text-white/70 transition hover:border-white/50 hover:text-white">
                    +{remainingSocials}
                  </button>
                </DialogTrigger>
              )}
            </div>
            <DialogTrigger asChild>
              <Button className="w-full justify-center rounded-2xl bg-white text-slate-900 hover:bg-rose-100">
                Ver más
              </Button>
            </DialogTrigger>
          </CardFooter>
        </Card>
      </motion.div>

      <DialogContent className="max-h-[90vh] overflow-y-auto border border-rose-200/40 bg-[#12040a]/95 text-rose-50 p-8 sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">
            {dealer.name}
          </DialogTitle>
          <DialogDescription className="text-rose-200">
            Detalles completos del concesionario.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 md:grid-cols-[minmax(0,320px)_1fr]">
          <div>
            <div className="relative h-64 overflow-hidden rounded-2xl border border-white/10">
              <Image
                src={dealer.image}
                alt={dealer.name}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 320px, 100vw"
              />
            </div>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.35em] text-white">
              <span className="size-2 rounded-full bg-emerald-400" />
              {dealer.focus}
            </div>
          </div>
          <div className="space-y-5 text-sm text-rose-100">
            <section className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">
                Ubicación
              </p>
              <p className="text-base text-white">{dealer.address}</p>
              <p>{dealer.location}</p>
            </section>
            <section className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">
                Teléfono
              </p>
              <p className="text-base text-white">{dealer.phone}</p>
            </section>
            <section className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">
                Descripción
              </p>
              <p className="text-pretty leading-relaxed">
                {dealer.description}
              </p>
            </section>
            {uniqueSocials.length > 0 && (
              <section className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">
                  Encuéntranos
                </p>
                <div className="flex flex-wrap gap-2">
                  {uniqueSocials.map((social) => {
                    const Icon = getSocialIcon(social.type);
                    return (
                      <Link
                        key={`modal-${dealer.id}-${social.type}`}
                        href={social.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium text-white transition hover:border-rose-300/80 hover:bg-white/20"
                      >
                        <Icon className="size-4" />
                        <span className="capitalize">{social.type}</span>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
