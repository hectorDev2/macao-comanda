import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH - Actualizar el estado de un item específico
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  try {
    const body = await request.json();
    const { estado } = body;

    // Validar estado
    const estadosValidos = ["pendiente", "preparando", "listo", "entregado"];
    if (!estadosValidos.includes(estado)) {
      return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
    }

    // Actualizar el item
    const item = await (prisma.pedidoItem as any).update({
      where: {
        id: parseInt(params.itemId),
      },
      data: {
        estado,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error al actualizar item:", error);
    return NextResponse.json(
      { error: "Error al actualizar item" },
      { status: 500 }
    );
  }
}
