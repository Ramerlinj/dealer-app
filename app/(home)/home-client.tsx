"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { pillars, baseStats } from "@/data/home";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Hero from "./_components/hero";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

export default function HomeClient() {
  const VISIT_BASE = 48230;
  const [visitCount, setVisitCount] = useState(VISIT_BASE);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisitCount((prev) => prev + 128);
    }, 800);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisitCount(
        (prev) => prev + Math.max(1, Math.floor(Math.random() * 4)),
      );
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  const formattedVisitCount = visitCount.toLocaleString("es-DO");
  const stats = [
    { label: "Visitas acumuladas", value: formattedVisitCount },
    ...baseStats,
  ];

  return (
    <div className="flex flex-col gap-24 text-rose-100">
      <Hero stats={stats} />
      <motion.section
        className="space-y-10"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        <motion.div
          className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
          initial="initial"
          animate="whileInView"
          variants={fadeUp}
        >
          <div>
            <h2 className="text-3xl font-semibold text-rose-50">
              Nuestro ADN en cada proyecto
            </h2>
            <p className="max-w-2xl text-pretty text-rose-300/90">
              Acompañamos a cada dealer dominicano con estrategia, diseño y
              tecnología que funciona tanto en Santo Domingo como en Santiago,
              Punta Cana o La Romana.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="border-rose-900/50 bg-[#1c090f]/80 text-rose-200 transition-colors hover:border-rose-500 hover:text-rose-50"
          >
            <Link href="/about">Conoce más</Link>
          </Button>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-3">
          {pillars.map(({ icon: Icon, title, description }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
                delay: index * 0.12,
              }}
            >
              <Card className="border-rose-900/45 bg-[#1d0a11]/85 shadow-[0_45px_120px_-70px_rgba(255,70,105,0.85)] backdrop-blur">
                <CardHeader className="space-y-6">
                  <div className="inline-flex size-12 items-center justify-center rounded-full bg-rose-900/45 text-rose-200">
                    <Icon className="size-5" />
                  </div>
                  <CardTitle className="text-xl text-rose-50">
                    {title}
                  </CardTitle>
                  <CardDescription className="text-pretty text-rose-300/90">
                    {description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="relative overflow-hidden rounded-3xl border border-rose-900/45 bg-[#1c0a10] p-10 shadow-[0_55px_140px_-90px_rgba(255,70,105,0.9)]"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        <div className="absolute -left-16 top-1/2 size-[340px] -translate-y-1/2 rounded-full bg-rose-800/30 blur-3xl" />
        <div className="absolute -right-12 top-8 size-[260px] rounded-full bg-rose-600/20 blur-3xl" />
        <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          >
            <h3 className="text-2xl font-semibold tracking-tight text-rose-50">
              Potencia tu red dominicana en cuestión de semanas.
            </h3>
            <p className="max-w-xl text-pretty text-rose-300/90">
              Implementamos fichas técnicas, integración con inventarios y
              automatizaciones de seguimiento adaptadas al mercado dominicano
              para que cierres más ventas sin perder el trato cercano.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.15 }}
          >
            <Button
              asChild
              size="lg"
              className="shadow-[0_32px_90px_-60px_rgba(255,70,105,0.85)]"
            >
              <Link href="/contact">Hablemos hoy</Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
