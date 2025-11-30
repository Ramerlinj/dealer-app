"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  AtSign,
  Facebook,
  Instagram,
  Linkedin,
  Loader2,
  MapPin,
  Phone,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/reysoft.multiservices",
    icon: Instagram,
    username: "@reysoft.multiservices",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/reysoftmultiservices",
    icon: Facebook,
    username: "/reysoftmultiservices",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/reysoft-multiservices",
    icon: Linkedin,
    username: "ReySoft Multiservices",
  },
];

export default function ContactPage() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    const formData = new FormData(form);
    const payload = {
      fullName: String(formData.get("fullName") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
    };

    setStatus("loading");
    setFeedbackMessage("");

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          body && typeof body === "object" && body !== null && "message" in body
            ? String((body as { message?: unknown }).message ?? "")
            : null;
        throw new Error(message || "No se pudo enviar tu mensaje");
      }

      form.reset();
      setStatus("success");
      setFeedbackMessage("¡Gracias! Tu mensaje fue enviado correctamente.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo enviar tu mensaje. Inténtalo nuevamente.";
      setStatus("error");
      setFeedbackMessage(message);
    }
  }

  return (
    <div className="grid gap-16 text-rose-100 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
      <div className="space-y-6">
        <span className="inline-flex items-center rounded-full border border-rose-900/60 bg-rose-950/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-rose-300">
          Contacto
        </span>
        <h1 className="text-balance text-3xl font-semibold text-rose-50 md:text-4xl">
          Conversemos sobre el crecimiento digital de tu red en República
          Dominicana.
        </h1>
        <p className="text-pretty text-lg text-rose-300/90">
          Cuéntanos sobre tus concesionarios en la isla, los retos que enfrentas
          en Santo Domingo o el interior y hacia dónde quieres llevar tu
          operación. Diseñamos un diagnóstico exprés sin costo y un plan de
          activación a medida.
        </p>
        <Card className="border-rose-900/45 bg-[#1c090f]/80 shadow-[0_40px_120px_-70px_rgba(255,70,105,0.8)] backdrop-blur">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-start gap-3 text-sm text-rose-200">
              <MapPin className="mt-0.5 size-5 text-rose-400" />
              <div>
                <p className="font-semibold text-rose-50">Oficinas híbridas</p>
                <p className="text-rose-400">
                  Santo Domingo · Santiago · Punta Cana
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-rose-200">
              <Phone className="size-5 text-rose-400" />
              <p className="text-rose-300">+1 (809) 555-8800</p>
            </div>
            <div className="flex items-center gap-3 text-sm text-rose-200">
              <AtSign className="size-5 text-rose-400" />
              <p className="text-rose-300">hola@reysoft.do</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-10">
        <Card className="border-rose-900/45 bg-[#1d0a11]/90 shadow-[0_45px_120px_-70px_rgba(255,70,105,0.85)] backdrop-blur">
          <CardContent className="space-y-6 p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre completo</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="Laura Cabrera"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="equipo@tudealer.com.do"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Mensaje</Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Cuéntanos sobre tus dealers en R.D. y objetivos de crecimiento."
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full shadow-[0_25px_75px_-55px_rgba(255,70,105,0.85)] disabled:cursor-not-allowed"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="size-4 animate-spin text-primary-foreground" />
                    Enviando...
                  </span>
                ) : (
                  "Enviar mensaje"
                )}
              </Button>
              <div className="min-h-6 text-sm" aria-live="polite">
                {status === "success" && (
                  <p className="text-emerald-400">{feedbackMessage}</p>
                )}
                {status === "error" && (
                  <p className="text-rose-400">{feedbackMessage}</p>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-500">
            Síguenos
          </p>
          <div className="flex flex-wrap gap-3">
            {socialLinks.map(({ label, href, icon: Icon, username }) => (
              <Link
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 rounded-full border border-rose-900/50 bg-[#1d0a10]/80 px-4 py-2 text-sm font-medium text-rose-200 transition-colors hover:border-rose-500 hover:text-rose-50"
              >
                <Icon className="size-4" />
                <span>{username}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
