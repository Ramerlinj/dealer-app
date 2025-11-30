import { NextResponse } from "next/server";

import { createDealerRecord, getDealers } from "@/lib/data";
import { dealerSchema } from "@/lib/validators";



export async function GET() {
  try {
    const dealers = await getDealers();
    return NextResponse.json(dealers);
  } catch (error) {
    console.error("GET /api/dealers", error);
    return NextResponse.json(
      { message: "No se pudo obtener la lista de dealers" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const parsed = dealerSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Datos inválidos", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const newDealer = await createDealerRecord(parsed.data);

    return NextResponse.json(newDealer, { status: 201 });
  } catch (error) {
    console.error("POST /api/dealers", error);
    return NextResponse.json(
      { message: "No se pudo crear el dealer" },
      { status: 500 }
    );
  }
}
