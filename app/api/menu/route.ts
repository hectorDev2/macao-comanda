import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Obtener todos los items del menú
export async function GET() {
  try {
    const menuItems = await (prisma.menuItem as any).findMany({
      where: {
        active: true,
      },
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });

    return NextResponse.json(menuItems);
  } catch (error) {
    console.error("Error al obtener menú:", error);
    return NextResponse.json(
      { error: "Error al obtener menú" },
      { status: 500 }
    );
  }
}
