"use client";
import { useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import {
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  UsersRound,
  Waves,
} from "lucide-react";
import { toast } from "sonner";

import type { DealerRecord } from "@/lib/data";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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

import { useDealers } from "@/hooks/use-dealers";

import { DealerForm, DealerFormValues } from "../_components/dealer-form";

function formatRelativeTime(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }
  return formatDistanceToNow(date, { locale: es, addSuffix: true });
}

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

export default function AdminDealersPage() {
  const {
    dealers,
    loading,
    error,
    refreshing,
    loadDealers,
    createDealer,
    updateDealer,
    deleteDealer,
  } = useDealers();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDealer, setEditingDealer] = useState<DealerRecord | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const sortedDealers = useMemo(() => {
    return [...dealers].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [dealers]);

  const totalSocialLinks = useMemo(() => {
    return dealers.reduce((acc, dealer) => acc + dealer.socials.length, 0);
  }, [dealers]);

  const lastUpdatedLabel = useMemo(() => {
    if (!sortedDealers.length) {
      return "—";
    }
    return formatDateTime(
      sortedDealers[0].updatedAt || sortedDealers[0].createdAt
    );
  }, [sortedDealers]);

  function openCreateDialog() {
    setEditingDealer(null);
    setDialogOpen(true);
  }

  function openEditDialog(dealer: DealerRecord) {
    setEditingDealer(dealer);
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditingDealer(null);
  }

  function handleDialogOpenChange(open: boolean) {
    if (!open && submitting) {
      return;
    }
    if (!open) {
      closeDialog();
    } else {
      setDialogOpen(true);
    }
  }

  async function handleDealerSubmit(values: DealerFormValues) {
    setSubmitting(true);

    try {
      if (editingDealer) {
        const updatedDealer = await updateDealer(editingDealer.id, values);
        toast.success(`Se actualizó ${updatedDealer.name}`);
      } else {
        const newDealer = await createDealer(values);
        toast.success(`Se agregó ${newDealer.name}`);
      }

      closeDialog();
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "No se pudo guardar el dealer";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);

    try {
      await deleteDealer(id);
      toast.success("Dealer eliminado");
    } catch (deleteError) {
      const message =
        deleteError instanceof Error
          ? deleteError.message
          : "No se pudo eliminar el dealer";
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-slate-200">
            Dealers aliados
          </h2>
          <p className="text-sm text-slate-400">
            Controla el inventario público, actualiza la información clave y
            mantén al día tu red.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => loadDealers({ showSkeleton: false })}
            disabled={loading || refreshing}
          >
            {refreshing ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <RefreshCw className="size-4" />
            )}
            Refrescar
          </Button>
          <Button type="button" onClick={openCreateDialog}>
            <Plus className="size-4" />
            Nuevo dealer
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border border-rose-900/45 bg-[#1d0a11]/85 text-rose-50 shadow-[0_45px_120px_-70px_rgba(255,70,105,0.75)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-rose-100/90 uppercase tracking-[0.25em]">
              Dealers activos
            </CardTitle>
            <UsersRound className="size-5 text-rose-300" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-white">
              {dealers.length}
            </div>
            <CardDescription className="mt-1 text-rose-200/80">
              Última actualización {lastUpdatedLabel}
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="border border-rose-900/45 bg-[#1d0a11]/85 text-rose-50 shadow-[0_45px_120px_-70px_rgba(255,70,105,0.75)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-rose-100/90 uppercase tracking-[0.25em]">
              Enlaces sociales totales
            </CardTitle>
            <Waves className="size-5 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-white">
              {totalSocialLinks}
            </div>
            <CardDescription className="mt-1 text-rose-200/80">
              Promedio{" "}
              {dealers.length
                ? (totalSocialLinks / dealers.length).toFixed(1)
                : "0.0"}
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
              className="grid gap-4 md:grid-cols-[2fr_1fr_1fr_1fr_auto]"
            >
              <Skeleton className="" />
              <Skeleton className="" />
              <Skeleton className="" />
              <Skeleton className="" />
              <Skeleton className="" />
            </div>
          ))}
        </div>
      ) : sortedDealers.length ? (
        <div className="overflow-hidden rounded-2xl border border-rose-900/45 bg-[#12040a]/95 text-rose-50 shadow-[0_45px_120px_-70px_rgba(255,70,105,0.75)]">
          <Table>
            <TableHeader className="bg-[#2a0b13]/70 text-rose-100">
              <TableRow className="border-b border-white/10">
                <TableHead className="uppercase tracking-[0.25em] text-xs text-rose-200/80">
                  Dealer
                </TableHead>
                <TableHead className="uppercase tracking-[0.25em] text-xs text-rose-200/80">
                  Ubicación
                </TableHead>
                <TableHead className="uppercase tracking-[0.25em] text-xs text-rose-200/80">
                  Enfoque
                </TableHead>
                <TableHead className="uppercase tracking-[0.25em] text-xs text-rose-200/80">
                  Actualización
                </TableHead>
                <TableHead className="text-right uppercase tracking-[0.25em] text-xs text-rose-200/80">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedDealers.map((dealer) => {
                const isDeleting = deletingId === dealer.id;
                return (
                  <TableRow
                    key={dealer.id}
                    className="border-b border-white/5 last:border-b-0 transition hover:bg-white/5"
                  >
                    <TableCell className="text-rose-100">
                      <div className="flex flex-col">
                        <span className="font-semibold text-white">
                          {dealer.name}
                        </span>
                        <span className="text-xs text-rose-200/70">
                          {dealer.address}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-rose-100/80">
                      {dealer.location}
                    </TableCell>
                    <TableCell className="text-rose-100/80">
                      {dealer.focus}
                    </TableCell>
                    <TableCell className="text-rose-100/80">
                      {formatRelativeTime(dealer.updatedAt || dealer.createdAt)}
                    </TableCell>
                    <TableCell className="flex justify-end gap-2 text-rose-100">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-rose-200 hover:bg-white/10 hover:text-white"
                        onClick={() => openEditDialog(dealer)}
                      >
                        <Pencil className="size-4" />
                        Editar
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-rose-300 hover:text-white"
                          >
                            <Trash2 className="size-4" />
                            Eliminar
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              ¿Eliminar este dealer?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción removerá{" "}
                              <strong>{dealer.name}</strong> de la web y no
                              podrá recuperarse.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel disabled={isDeleting}>
                              Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-white/90 text-slate-900 hover:bg-rose-50"
                              onClick={() => handleDelete(dealer.id)}
                              disabled={isDeleting}
                            >
                              {isDeleting ? (
                                <Loader2 className="size-4 animate-spin" />
                              ) : (
                                <Trash2 className="size-4" />
                              )}
                              Confirmar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <Empty className="rounded-2xl border border-rose-900/45 bg-[#1d0a11]/85 p-6 shadow-[0_45px_120px_-70px_rgba(255,70,105,0.85)] backdrop-blur">
          <EmptyMedia variant="icon">
            <UsersRound />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>Aún no hay dealers cargados</EmptyTitle>
            <EmptyDescription>
              Suma tu primer aliado para que aparezca en la página pública y
              comienza a construir presencia.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button type="button" onClick={openCreateDialog}>
              <Plus className="size-4" />
              Crear dealer
            </Button>
          </EmptyContent>
        </Empty>
      )}

      <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingDealer ? "Editar dealer" : "Nuevo dealer"}
            </DialogTitle>
            <DialogDescription>
              Completa la información clave para que se refleje inmediatamente
              en la web pública.
            </DialogDescription>
          </DialogHeader>
          <DealerForm
            initialData={editingDealer}
            submitting={submitting}
            onCancel={closeDialog}
            onSubmit={handleDealerSubmit}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
