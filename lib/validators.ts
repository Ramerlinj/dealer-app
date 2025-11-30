import { z } from "zod";

export const socialLinkSchema = z.object({
  type: z.string().min(1, "Tipo requerido"),
  url: z.string().url("URL inválida"),
});

export const dealerSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  location: z.string().min(1, "Ubicación requerida"),
  description: z.string().min(1, "Descripción requerida"),
  address: z.string().min(1, "Dirección requerida"),
  phone: z.string().min(1, "Teléfono requerido"),
  image: z.string().url("URL de imagen inválida"),
  focus: z.string().min(1, "Enfoque requerido"),
  socials: z.array(socialLinkSchema).optional().default([]),
});

export const dealerUpdateSchema = dealerSchema.partial();

export const contactMessageSchema = z.object({
  fullName: z.string().min(1, "Nombre requerido"),
  email: z.string().email("Correo inválido"),
  message: z.string().min(1, "Mensaje requerido"),
});
