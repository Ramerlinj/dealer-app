"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { uploadImage } from "@/lib/cloudinary";
import type { DealerRecord } from "@/lib/data";
import { socialLinkSchema } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

const dealerFormSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  location: z.string().min(1, "Ubicación requerida"),
  description: z.string().min(1, "Descripción requerida"),
  address: z.string().min(1, "Dirección requerida"),
  phone: z.string().min(1, "Teléfono requerido"),
  image: z.string().url("URL de imagen inválida"),
  focus: z.string().min(1, "Enfoque requerido"),
  socials: z.array(socialLinkSchema).max(5, "Máximo 5 enlaces permitidos"),
});

export type DealerFormValues = z.infer<typeof dealerFormSchema>;

const emptyValues: DealerFormValues = {
  name: "",
  location: "",
  description: "",
  address: "",
  phone: "",
  image: "",
  focus: "",
  socials: [],
};

function mapDealerToFormValues(dealer: DealerRecord): DealerFormValues {
  return {
    name: dealer.name,
    location: dealer.location,
    description: dealer.description,
    address: dealer.address,
    phone: dealer.phone,
    image: dealer.image,
    focus: dealer.focus,
    socials: dealer.socials ?? [],
  };
}

type DealerFormProps = {
  initialData?: DealerRecord | null;
  submitting: boolean;
  onCancel: () => void;
  onSubmit: (values: DealerFormValues) => Promise<void>;
};

export function DealerForm({
  initialData,
  submitting,
  onCancel,
  onSubmit,
}: DealerFormProps) {
  const form = useForm<DealerFormValues>({
    resolver: zodResolver(dealerFormSchema),
    defaultValues: initialData
      ? mapDealerToFormValues(initialData)
      : emptyValues,
    mode: "onChange",
  });

  const { control, reset, handleSubmit } = form;
  const [imageUploading, setImageUploading] = useState(false);
  const socials = useFieldArray({ control, name: "socials" });

  useEffect(() => {
    reset(initialData ? mapDealerToFormValues(initialData) : emptyValues);
  }, [initialData, reset]);

  async function submitHandler(values: DealerFormValues) {
    await onSubmit(values);
  }

  async function handleImageSelection(
    file: File,
    onChange: (value: string) => void,
    onBlur: () => void
  ) {
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      toast.error("La imagen no puede superar los 5 MB");
      return;
    }

    if (file.type && !ACCEPTED_IMAGE_TYPES.some((type) => file.type === type)) {
      toast.error("Solo se aceptan imágenes JPG, PNG, WEBP o AVIF");
      return;
    }

    setImageUploading(true);
    try {
      const cloud = await uploadImage(file);
      if (
        cloud &&
        typeof cloud === "object" &&
        "error" in cloud &&
        cloud.error
      ) {
        const cloudError = cloud as { error?: { message?: string } };
        throw new Error(cloudError.error?.message || "Error en Cloudinary");
      }
      const nextUrl =
        (cloud && typeof cloud === "object" && "secure_url" in cloud
          ? (cloud as { secure_url?: string })?.secure_url ?? ""
          : "") ||
        (cloud && typeof cloud === "object" && "url" in cloud
          ? (cloud as { url?: string })?.url ?? ""
          : "");

      if (!nextUrl) {
        throw new Error("Cloudinary no devolvió una URL válida");
      }

      onChange(nextUrl);
      onBlur();
      toast.success("Imagen subida correctamente");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo subir la imagen";
      toast.error(message);
    } finally {
      setImageUploading(false);
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={handleSubmit(submitHandler)}>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del dealer</FormLabel>
                <FormControl>
                  <Input placeholder="Ej. Malecón Motors" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ubicación</FormLabel>
                <FormControl>
                  <Input placeholder="Ciudad, provincia" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Servicios clave y propuesta de valor"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dirección</FormLabel>
                <FormControl>
                  <Input placeholder="Dirección física" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input placeholder="Número de contacto" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <FormField
            control={control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imagen destacada</FormLabel>
                <FormControl>
                  <div className="space-y-3">
                    <input type="hidden" {...field} />
                    {field.value ? (
                      <div className="overflow-hidden rounded-xl border border-slate-700/40">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={field.value}
                          alt={`Vista previa de ${field.value}`}
                          className="h-48 w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-slate-700/40 text-sm text-slate-400">
                        No se ha cargado ninguna imagen
                      </div>
                    )}
                    <div className="flex flex-wrap gap-3">
                      <Input
                        type="file"
                        accept={ACCEPTED_IMAGE_TYPES.join(",")}
                        onChange={async (event) => {
                          const file = event.target.files?.[0];
                          if (!file) {
                            return;
                          }
                          await handleImageSelection(
                            file,
                            field.onChange,
                            field.onBlur
                          );
                          event.target.value = "";
                        }}
                        disabled={submitting || imageUploading}
                      />
                      {field.value && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            field.onChange("");
                            field.onBlur();
                          }}
                          disabled={submitting || imageUploading}
                        >
                          Quitar imagen
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">
                      Se sube automáticamente a Cloudinary. Usa JPG, PNG, WEBP o
                      AVIF (máx. 5 MB).
                    </p>
                    {imageUploading && (
                      <p className="text-xs font-medium text-sky-400">
                        Subiendo imagen...
                      </p>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="focus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enfoque</FormLabel>
                <FormControl>
                  <Input placeholder="Ej. SUVs urbanos premium" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <FormLabel>Redes sociales</FormLabel>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => socials.append({ type: "", url: "" })}
              disabled={socials.fields.length >= 5}
            >
              <Plus className="size-4" />
              Agregar enlace
            </Button>
          </div>
          <div className="space-y-3">
            {socials.fields.length === 0 && (
              <p className="text-sm text-slate-500">
                Añade enlaces directos a plataformas como Instagram, Facebook o
                tu sitio web.
              </p>
            )}
            {socials.fields.map((field, index) => (
              <div
                key={field.id}
                className="grid gap-3 rounded-xl border border-red-900/60  p-4 md:grid-cols-[1fr_1fr_auto]"
              >
                <FormField
                  control={control}
                  name={`socials.${index}.type`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plataforma</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value ?? ""}
                          onValueChange={(val) => field.onChange(val)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccione la red social" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Redes Sociales</SelectLabel>
                              <SelectItem value="instagram">
                                Instagram
                              </SelectItem>
                              <SelectItem value="facebook">Facebook</SelectItem>
                              <SelectItem value="twitter">Twitter</SelectItem>
                              <SelectItem value="linkedin">LinkedIn</SelectItem>
                              <SelectItem value="youtube">YouTube</SelectItem>
                              <SelectItem value="tiktok">TikTok</SelectItem>
                              <SelectItem value="website">Sitio Web</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`socials.${index}.url`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="self-end text-destructive hover:text-destructive"
                  onClick={() => socials.remove(index)}
                  disabled={submitting}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
