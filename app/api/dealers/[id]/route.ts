import { NextResponse } from "next/server";

import {
  deleteDealerRecord,
  getDealerById,
  updateDealerRecord,
} from "@/lib/data";
import { dealerSchema } from "@/lib/validators";

type RouteParams = {
  params: { id: string };
};

function notFound() {
  return NextResponse.json({ message: "Dealer no encontrado" }, { status: 404 });
}

export async function GET(_req: Request, { params }: RouteParams) {
  try {
    const dealer = await getDealerById(params.id);
    if (!dealer) {
      return notFound();
    }
    return NextResponse.json(dealer);
  } catch (error) {
    console.error(`GET /api/dealers/${params.id}`, error);
    return NextResponse.json(
      { message: "No se pudo obtener el dealer" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const payload = await req.json();
    const parsed = dealerSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Datos inválidos", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await getDealerById(params.id);
    if (!existing) {
      return notFound();
    }

    const updatedDealer = await updateDealerRecord(params.id, parsed.data);

    return NextResponse.json(updatedDealer);
  } catch (error) {
    console.error(`PUT /api/dealers/${params.id}`, error);
    return NextResponse.json(
      { message: "No se pudo actualizar el dealer" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: Request, { params }: RouteParams) {
  try {
    const dealer = await getDealerById(params.id);
    if (!dealer) {
      return notFound();
    }

    await deleteDealerRecord(params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`DELETE /api/dealers/${params.id}`, error);
    return NextResponse.json(
      { message: "No se pudo eliminar el dealer" },
      { status: 500 }
    );
  }
}
