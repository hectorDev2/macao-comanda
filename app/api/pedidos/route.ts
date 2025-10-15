import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Obtener todos los pedidos
export async function GET() {
  try {
    const pedidos = await (prisma.pedido as any).findMany({
      include: {
        items: true,
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    return NextResponse.json(pedidos);
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    return NextResponse.json(
      { error: "Error al obtener pedidos" },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo pedido
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("📥 Datos recibidos:", {
      mesa: body.mesa,
      itemsCount: body.items?.length,
    });
    const { mesa, items } = body;

    // Validaciones
    if (!mesa || !items || items.length === 0) {
      console.log("❌ Validación fallida:", { mesa, items });
      return NextResponse.json(
        { error: "Mesa e items son requeridos" },
        { status: 400 }
      );
    }

    console.log("✅ Creando pedido en DB...");
    console.log("Items a crear:", items);

    // Crear el pedido con sus items
    const pedido = await (prisma.pedido as any).create({
      data: {
        mesa,
        items: {
          create: items.map((item: any) => ({
            menuItemId: item.menuItemId || item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            estado: "pendiente",
          })),
        },
      },
      include: {
        items: true,
      },
    });

    console.log("✅ Pedido creado exitosamente:", pedido.id);
    return NextResponse.json(pedido, { status: 201 });
  } catch (error: any) {
    console.error("❌ Error detallado al crear pedido:", {
      message: error?.message,
      code: error?.code,
      meta: error?.meta,
      stack: error?.stack,
    });
    return NextResponse.json(
      { error: "Error al crear pedido", details: error?.message },
      { status: 500 }
    );
  }
}
