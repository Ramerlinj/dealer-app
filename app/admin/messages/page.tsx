"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Inbox, Loader2, MailOpen, RefreshCw, UserCircle2 } from "lucide-react";

import type { ContactMessage } from "@/lib/data";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function formatDateTime(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }
  return date.toLocaleString("es-DO", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatRelative(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }
  return formatDistanceToNow(date, { locale: es, addSuffix: true });
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null
  );

  const loadMessages = useCallback(
    async ({ showSkeleton = false }: { showSkeleton?: boolean } = {}) => {
      if (showSkeleton) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      try {
        setError(null);
        const response = await fetch("/api/messages", { cache: "no-store" });
        const body = await response.json().catch(() => null);

        if (!response.ok) {
          const message =
            body &&
            typeof body === "object" &&
            body !== null &&
            "message" in body
              ? String((body as { message?: unknown }).message ?? "")
              : null;
          throw new Error(message || "No se pudo obtener los mensajes");
        }

        setMessages(Array.isArray(body) ? (body as ContactMessage[]) : []);
      } catch (fetchError) {
        const message =
          fetchError instanceof Error
            ? fetchError.message
            : "Ocurrió un error inesperado";
        setError(message);
      } finally {
        if (showSkeleton) {
          setLoading(false);
        } else {
          setRefreshing(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    loadMessages({ showSkeleton: true });
  }, [loadMessages]);

  const sortedMessages = useMemo(() => {
    return [...messages].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [messages]);

  const recentCount = useMemo(() => {
    const threshold = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return messages.filter((message) => {
      const createdAt = new Date(message.createdAt).getTime();
      return !Number.isNaN(createdAt) && createdAt >= threshold;
    }).length;
  }, [messages]);

  const lastMessageLabel = useMemo(() => {
    if (!sortedMessages.length) {
      return "—";
    }
    return formatDateTime(sortedMessages[0].createdAt);
  }, [sortedMessages]);

  function openMessageDialog(message: ContactMessage) {
    setSelectedMessage(message);
    setDialogOpen(true);
  }

  function closeMessageDialog() {
    setDialogOpen(false);
    setSelectedMessage(null);
  }

  function handleDialogChange(open: boolean) {
    if (!open) {
      closeMessageDialog();
    } else {
      setDialogOpen(true);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-slate-200">
            Mensajes recibidos
          </h2>
          <p className="text-sm text-slate-400">
            Analiza los leads entrantes, responde rápidamente y detecta nuevas
            oportunidades comerciales.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => loadMessages({ showSkeleton: false })}
          disabled={loading || refreshing}
        >
          {refreshing ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <RefreshCw className="size-4" />
          )}
          Refrescar
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border border-rose-900/45 bg-[#1d0a11]/85 text-rose-50 shadow-[0_45px_120px_-70px_rgba(255,70,105,0.75)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium uppercase tracking-[0.25em] text-rose-100/90">
              Total de mensajes
            </CardTitle>
            <Inbox className="size-5 text-rose-300" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-white">
              {messages.length}
            </div>
            <CardDescription className="mt-1 text-rose-200/80">
              Último registro {lastMessageLabel}
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="border border-rose-900/45 bg-[#1d0a11]/85 text-rose-50 shadow-[0_45px_120px_-70px_rgba(255,70,105,0.75)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium uppercase tracking-[0.25em] text-rose-100/90">
              Últimos 7 días
            </CardTitle>
            <MailOpen className="size-5 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-white">
              {recentCount}
            </div>
            <CardDescription className="mt-1 text-rose-200/80">
              Leads recientes listos para contactar
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error al cargar</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="space-y-3 rounded-2xl border border-rose-900/45 bg-[#1a070e]/80 p-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="grid gap-4 md:grid-cols-[1.2fr_1fr_1.6fr_1fr_auto]"
            >
              <Skeleton className="h-10 rounded-lg bg-white/10" />
              <Skeleton className="h-10 rounded-lg bg-white/10" />
              <Skeleton className="h-10 rounded-lg bg-white/10" />
              <Skeleton className="h-10 rounded-lg bg-white/10" />
              <Skeleton className="h-10 rounded-lg bg-white/10" />
            </div>
          ))}
        </div>
      ) : sortedMessages.length ? (
        <div className="overflow-hidden rounded-2xl border border-rose-900/45 bg-[#12040a]/95 text-rose-50 shadow-[0_45px_120px_-70px_rgba(255,70,105,0.75)]">
          <Table>
            <TableHeader className="bg-[#2a0b13]/70 text-rose-100">
              <TableRow className="border-b border-white/10">
                <TableHead className="uppercase tracking-[0.25em] text-xs text-rose-200/80">
                  Nombre
                </TableHead>
                <TableHead className="uppercase tracking-[0.25em] text-xs text-rose-200/80">
                  Correo
                </TableHead>
                <TableHead className="uppercase tracking-[0.25em] text-xs text-rose-200/80">
                  Mensaje
                </TableHead>
                <TableHead className="uppercase tracking-[0.25em] text-xs text-rose-200/80">
                  Recibido
                </TableHead>
                <TableHead className="text-right uppercase tracking-[0.25em] text-xs text-rose-200/80">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedMessages.map((message) => {
                const createdDate = new Date(message.createdAt).getTime();
                const isRecent =
                  !Number.isNaN(createdDate) &&
                  Date.now() - createdDate < 48 * 60 * 60 * 1000;
                const preview =
                  message.message.length > 80
                    ? `${message.message.slice(0, 77)}…`
                    : message.message;

                return (
                  <TableRow
                    key={message.id}
                    className="border-b border-white/5 last:border-b-0 transition hover:bg-white/5"
                  >
                    <TableCell className="text-rose-100">
                      <div className="flex flex-col">
                        <span className="font-semibold text-white">
                          {message.fullName}
                        </span>
                        <span className="text-xs text-rose-200/70">
                          {message.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-rose-100/80">
                      {message.email}
                    </TableCell>
                    <TableCell className="text-rose-100/80">
                      {preview}
                    </TableCell>
                    <TableCell className="text-rose-100/80">
                      <div className="flex flex-col items-start gap-1">
                        <span>{formatRelative(message.createdAt)}</span>
                        {isRecent && (
                          <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-xs font-medium text-emerald-300">
                            Nuevo
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="flex justify-end text-rose-100">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-rose-200 hover:bg-white/10 hover:text-white"
                        onClick={() => openMessageDialog(message)}
                      >
                        <UserCircle2 className="size-4" />
                        Ver
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <Empty className="rounded-2xl border border-rose-900/45 bg-[#1d0a11]/85 p-6 text-rose-50 shadow-[0_45px_120px_-70px_rgba(255,70,105,0.85)]">
          <EmptyMedia variant="icon">
            <Inbox />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle className="text-white">Aún no hay mensajes</EmptyTitle>
            <EmptyDescription className="text-rose-200/80">
              Cuando los visitantes usen el formulario de contacto verás los
              mensajes aquí con su fecha y detalles.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              type="button"
              variant="outline"
              className="border-white/40 text-white hover:bg-white/10"
              onClick={() => loadMessages({ showSkeleton: false })}
            >
              <RefreshCw className="size-4" />
              Intentar nuevamente
            </Button>
          </EmptyContent>
        </Empty>
      )}

      <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalle del mensaje</DialogTitle>
            <DialogDescription>
              Información enviada a través del formulario de contacto.
            </DialogDescription>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <Card className="border border-rose-900/45 bg-[#1d0a11]/90 text-rose-50 shadow-[0_35px_90px_-55px_rgba(255,70,105,0.65)]">
                <CardHeader>
                  <CardTitle className="text-lg text-white">
                    {selectedMessage.fullName}
                  </CardTitle>
                  <CardDescription className="text-rose-200/80">
                    {selectedMessage.email}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-rose-50/80">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-rose-300">
                    <span>Recibido</span>
                    <span>{formatDateTime(selectedMessage.createdAt)}</span>
                  </div>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-rose-50">
                    {selectedMessage.message}
                  </p>
                </CardContent>
              </Card>
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="border-white/40 text-white hover:bg-white/10"
                  onClick={closeMessageDialog}
                >
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
