import { supabase } from "@/lib/supabaseServer";

export type DealerSocialLink = {
  type: string;
  url: string;
};

export type DealerRecord = {
  id: string;
  name: string;
  location: string;
  description: string;
  address: string;
  phone: string;
  image: string;
  focus: string;
  socials: DealerSocialLink[];
  createdAt: string;
  updatedAt: string;
};

export type ContactMessage = {
  id: string;
  fullName: string;
  email: string;
  message: string;
  createdAt: string;
};
export type DealerWritePayload = Omit<DealerRecord, "id" | "createdAt" | "updatedAt">;

const DEALER_TABLE = "dealer";
const MESSAGE_TABLE = "message";

type SupabaseDealerRow = {
  id: number;
  name: string;
  province: string | null;
  description: string | null;
  address: string | null;
  phone: string | null;
  image: unknown;
  category_card: string | null;
  created_at: string;
  updated_at?: string | null;
  social_media: DealerSocialLink[] | null;
  state: boolean | null;
};

type SupabaseMessageRow = {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

function parseNumericId(id: string): number {
  const numericId = Number(id);
  if (Number.isNaN(numericId)) {
    throw new Error("Identificador de dealer inválido");
  }
  return numericId;
}

function normalizeImage(image: unknown): string {
  if (!image) {
    return "";
  }
  if (typeof image === "string") {
    return image;
  }
  if (typeof image === "object" && image !== null) {
    const record = image as Record<string, unknown>;
    const possible = record.url ?? record.secure_url ?? record.path;
    if (typeof possible === "string") {
      return possible;
    }
  }
  return "";
}

function mapDealerRow(row: SupabaseDealerRow): DealerRecord {
  return {
    id: String(row.id),
    name: row.name,
    location: row.province ?? "",
    description: row.description ?? "",
    address: row.address ?? "",
    phone: row.phone ?? "",
    image: normalizeImage(row.image),
    focus: row.category_card ?? "",
    socials: Array.isArray(row.social_media) ? row.social_media : [],
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? row.created_at,
  };
}

function dealerPayloadToRow(payload: DealerWritePayload) {
  return {
    name: payload.name,
    province: payload.location,
    description: payload.description,
    address: payload.address,
    phone: payload.phone,
    image: payload.image ? { url: payload.image } : null,
    category_card: payload.focus,
    social_media: payload.socials ?? [],
    state: true,
  };
}

function mapMessageRow(row: SupabaseMessageRow): ContactMessage {
  return {
    id: String(row.id),
    fullName: row.name,
    email: row.email,
    message: row.message,
    createdAt: row.created_at,
  };
}

export async function getDealers(): Promise<DealerRecord[]> {
  const { data, error } = await supabase
    .from(DEALER_TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(mapDealerRow);
}

export async function getDealerById(id: string): Promise<DealerRecord | null> {
  const numericId = parseNumericId(id);
  const { data, error } = await supabase
    .from(DEALER_TABLE)
    .select("*")
    .eq("id", numericId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapDealerRow(data) : null;
}

export async function createDealerRecord(
  payload: DealerWritePayload
): Promise<DealerRecord> {
  const row = dealerPayloadToRow(payload);
  const { data, error } = await supabase
    .from(DEALER_TABLE)
    .insert(row)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapDealerRow(data);
}

export async function updateDealerRecord(
  id: string,
  payload: DealerWritePayload
): Promise<DealerRecord> {
  const numericId = parseNumericId(id);
  const row = dealerPayloadToRow(payload);
  const { data, error } = await supabase
    .from(DEALER_TABLE)
    .update(row)
    .eq("id", numericId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapDealerRow(data);
}

export async function deleteDealerRecord(id: string): Promise<void> {
  const numericId = parseNumericId(id);
  const { error } = await supabase
    .from(DEALER_TABLE)
    .delete()
    .eq("id", numericId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function getMessages(): Promise<ContactMessage[]> {
  const { data, error } = await supabase
    .from(MESSAGE_TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(mapMessageRow);
}

type MessageWritePayload = Omit<ContactMessage, "id" | "createdAt">;

export async function createMessageRecord(
  payload: MessageWritePayload
): Promise<ContactMessage> {
  const { data, error } = await supabase
    .from(MESSAGE_TABLE)
    .insert({
      name: payload.fullName,
      email: payload.email,
      message: payload.message,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapMessageRow(data);
}