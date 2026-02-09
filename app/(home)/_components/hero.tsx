import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

type PropsHome = {
  stats: { label: string; value: string }[];
};

export default function Hero({ stats }: PropsHome) {
  const fadeUp = {
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  return (
    <motion.section
      className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -20%" }}
    >
      <motion.div
        className="space-y-8"
        initial="initial"
        animate="whileInView"
        variants={fadeUp}
      >
        <Badge variant={"destructive"}>ReySoft Multiservices</Badge>
        <h1 className="text-balance text-4xl font-semibold tracking-tight text-rose-50 md:text-5xl">
          Encuentra todos los dealers de República Dominicana organizados por
          provincia. Explora nuestra red de concesionarios, compara inventarios
          y conecta directamente con los dealers cercanos a ti.
        </h1>
        <p className="max-w-xl text-pretty text-lg text-rose-300/90">
          ReySoft es un directorio digital que organiza todos los dealers de
          vehículos de República Dominicana por provincia, permitiendo a los
          usuarios encontrar rápidamente concesionarios confiables cerca de su
          ubicación.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button
            asChild
            size="lg"
            className="shadow-[0_32px_90px_-60px_rgba(255,70,105,0.85)]"
          >
            <Link href="/dealers">Ver red de dealers</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="ghost"
            className="text-rose-200 hover:text-rose-50"
          >
            <Link href="/contact" className="inline-flex items-center gap-2">
              Agenda una llamada
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>
        <motion.div
          className="grid max-w-xl grid-cols-2 gap-6 rounded-2xl border border-rose-900/45 bg-[#1d0a11]/85 p-6 shadow-[0_45px_120px_-70px_rgba(255,70,105,0.85)] backdrop-blur"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
        >
          {stats.map((item, index) => (
            <motion.div
              key={item.label}
              className="space-y-1"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                ease: "easeOut",
                delay: index * 0.08,
              }}
            >
              <p className="text-3xl font-semibold text-rose-50">
                {item.value}
              </p>
              <p className="text-xs uppercase tracking-[0.3em] text-rose-400/80">
                {item.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
      <motion.div
        className="relative h-[460px] overflow-hidden rounded-3xl border border-rose-900/45 bg-[#1f0b12] shadow-[0_55px_140px_-90px_rgba(255,70,105,0.9)] lg:h-[520px]"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      >
        <Image
          src="https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=900&q=80"
          alt="Showroom moderno con vehículos en Santo Domingo"
          fill
          className="object-cover object-center"
          priority
        />
      </motion.div>
    </motion.section>
  );
}
