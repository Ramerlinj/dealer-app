"use client";

import { useCallback, useEffect, useState } from "react";

import type { DealerRecord } from "@/lib/data";
import type { DealerFormValues } from "@/app/admin/_components/dealer-form";

type LoadOptions = {
  showSkeleton?: boolean;
};

function getApiErrorMessage(body: unknown, fallback: string) {
  if (
    body &&
    typeof body === "object" &&
    body !== null &&
    "message" in body &&
    typeof (body as { message?: unknown }).message === "string"
  ) {
    return (body as { message?: string }).message || fallback;
  }
  return fallback;
}

async function parseJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export function useDealers() {
  const [dealers, setDealers] = useState<DealerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDealers = useCallback(async ({ showSkeleton = false }: LoadOptions = {}) => {
    if (showSkeleton) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    try {
      setError(null);
      const response = await fetch("/api/dealers", { cache: "no-store" });
      const body = await parseJson(response);

      if (!response.ok) {
        throw new Error(
          getApiErrorMessage(body, "No se pudo cargar la lista de dealers")
        );
      }

      setDealers(Array.isArray(body) ? (body as DealerRecord[]) : []);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Ocurrió un error inesperado";
      setError(message);
    } finally {
      if (showSkeleton) {
        setLoading(false);
      } else {
        setRefreshing(false);
      }
    }
  }, []);

  const createDealer = useCallback(async (values: DealerFormValues) => {
    const response = await fetch("/api/dealers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const body = await parseJson(response);

    if (!response.ok) {
      throw new Error(getApiErrorMessage(body, "No se pudo crear el dealer"));
    }

    const newDealer = body as DealerRecord;
    setDealers((prev) => [...prev, newDealer]);
    return newDealer;
  }, []);

  const updateDealer = useCallback(
    async (id: string, values: DealerFormValues) => {
      const response = await fetch(`/api/dealers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const body = await parseJson(response);

      if (!response.ok) {
        throw new Error(
          getApiErrorMessage(body, "No se pudo actualizar el dealer")
        );
      }

      const updatedDealer = body as DealerRecord;
      setDealers((prev) =>
        prev.map((dealer) => (dealer.id === id ? updatedDealer : dealer))
      );
      return updatedDealer;
    },
    []
  );

  const deleteDealer = useCallback(async (id: string) => {
    const response = await fetch(`/api/dealers/${id}`, { method: "DELETE" });
    const body = await parseJson(response);

    if (!response.ok) {
      throw new Error(getApiErrorMessage(body, "No se pudo eliminar el dealer"));
    }

    setDealers((prev) => prev.filter((dealer) => dealer.id !== id));
  }, []);

  useEffect(() => {
    loadDealers({ showSkeleton: true });
  }, [loadDealers]);

  return {
    dealers,
    loading,
    refreshing,
    error,
    loadDealers,
    createDealer,
    updateDealer,
    deleteDealer,
  };
}
