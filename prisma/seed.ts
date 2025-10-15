import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed de la base de datos...");

  // Limpiar datos existentes
  await prisma.pedidoItem.deleteMany();
  await prisma.pedido.deleteMany();
  await prisma.menuItem.deleteMany();

  // Crear items del menú
  const menuItems = await prisma.menuItem.createMany({
    data: [
      // Entradas
      {
        name: "Causa Limeña",
        category: "Entradas",
        price: 15.0,
        imageUrl:
          "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400",
        description: "Papa amarilla, pollo, palta y mayo",
      },
      {
        name: "Ceviche Clásico",
        category: "Entradas",
        price: 28.0,
        imageUrl:
          "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400",
        description: "Pescado fresco, limón, cebolla morada",
      },
      {
        name: "Papa a la Huancaína",
        category: "Entradas",
        price: 12.0,
        imageUrl:
          "https://images.unsplash.com/photo-1544025162-d76694265947?w=400",
        description: "Papa amarilla con salsa de ají",
      },
      {
        name: "Anticuchos",
        category: "Entradas",
        price: 18.0,
        imageUrl:
          "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400",
        description: "Brochetas de corazón marinadas",
      },

      // Platos Principales
      {
        name: "Lomo Saltado",
        category: "Principales",
        price: 35.0,
        imageUrl:
          "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400",
        description: "Carne, papas fritas, arroz",
      },
      {
        name: "Ají de Gallina",
        category: "Principales",
        price: 32.0,
        imageUrl:
          "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400",
        description: "Pollo deshilachado en salsa de ají amarillo",
      },
      {
        name: "Arroz con Pollo",
        category: "Principales",
        price: 28.0,
        imageUrl:
          "https://images.unsplash.com/photo-1544025162-d76694265947?w=400",
        description: "Arroz verde con pollo y ensalada",
      },
      {
        name: "Seco de Res",
        category: "Principales",
        price: 36.0,
        imageUrl:
          "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400",
        description: "Carne guisada con frijoles y yuca",
      },
      {
        name: "Tallarines Rojos",
        category: "Principales",
        price: 30.0,
        imageUrl:
          "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400",
        description: "Pasta con salsa roja y carne",
      },
      {
        name: "Chaufa de Mariscos",
        category: "Principales",
        price: 38.0,
        imageUrl:
          "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400",
        description: "Arroz frito con mariscos",
      },

      // Bebidas
      {
        name: "Chicha Morada",
        category: "Bebidas",
        price: 8.0,
        imageUrl:
          "https://images.unsplash.com/photo-1544025162-d76694265947?w=400",
        description: "Bebida de maíz morado",
      },
      {
        name: "Inca Kola",
        category: "Bebidas",
        price: 6.0,
        imageUrl:
          "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400",
        description: "Gaseosa peruana",
      },
      {
        name: "Limonada Frozen",
        category: "Bebidas",
        price: 10.0,
        imageUrl:
          "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400",
        description: "Limonada helada",
      },
      {
        name: "Pisco Sour",
        category: "Bebidas",
        price: 18.0,
        imageUrl:
          "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400",
        description: "Cóctel de pisco",
      },

      // Postres
      {
        name: "Suspiro Limeño",
        category: "Postres",
        price: 12.0,
        imageUrl:
          "https://images.unsplash.com/photo-1544025162-d76694265947?w=400",
        description: "Dulce de leche con merengue",
      },
      {
        name: "Mazamorra Morada",
        category: "Postres",
        price: 8.0,
        imageUrl:
          "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400",
        description: "Postre de maíz morado",
      },
      {
        name: "Picarones",
        category: "Postres",
        price: 10.0,
        imageUrl:
          "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400",
        description: "Buñuelos con miel",
      },
    ],
  });

  console.log(`✅ Creados ${menuItems.count} items del menú`);
  console.log("🎉 Seed completado exitosamente!");
}

main()
  .catch((e) => {
    console.error("❌ Error en el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
