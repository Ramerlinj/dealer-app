import { NextResponse } from "next/server";

import { createMessageRecord, getMessages } from "@/lib/data";
import { contactMessageSchema } from "@/lib/validators";

export async function GET() {
  try {
    const messages = await getMessages();
    return NextResponse.json(messages);
  } catch (error) {
    console.error("GET /api/messages", error);
    return NextResponse.json(
      { message: "No se pudieron obtener los mensajes" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const parsed = contactMessageSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Datos inválidos", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const newMessage = await createMessageRecord(parsed.data);

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("POST /api/messages", error);
    return NextResponse.json(
      { message: "No se pudo enviar el mensaje" },
      { status: 500 }
    );
  }
}
