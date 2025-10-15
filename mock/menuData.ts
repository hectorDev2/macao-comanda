export interface MenuItem {
  id: number;
  name: string;
  price: number;
  image: string;
  description?: string;
}

export interface MenuCategory {
  name: string;
  items: MenuItem[];
}

export const menuCategories: MenuCategory[] = [
  {
    name: "Entradas",
    items: [
      {
        id: 1,
        name: "Ensalada César",
        price: 15,
        image:
          "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400",
        description: "Lechuga, pollo, parmesano y aderezo césar",
      },
      {
        id: 2,
        name: "Sopa del día",
        price: 12,
        image:
          "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400",
        description: "Preparación casera con ingredientes frescos",
      },
      {
        id: 3,
        name: "Tequeños",
        price: 18,
        image:
          "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400",
        description: "Crujientes palitos de queso (6 unidades)",
      },
    ],
  },
  {
    name: "Platos Fuertes",
    items: [
      {
        id: 4,
        name: "Lomo Saltado",
        price: 25,
        image:
          "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400",
        description: "Carne, cebolla, tomate y papas fritas",
      },
      {
        id: 5,
        name: "Pasta Alfredo",
        price: 20,
        image:
          "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400",
        description: "Fettuccine con salsa cremosa de queso",
      },
      {
        id: 6,
        name: "Pollo a la Parrilla",
        price: 22,
        image:
          "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400",
        description: "Pechuga de pollo con ensalada y papas",
      },
      {
        id: 7,
        name: "Arroz con Mariscos",
        price: 28,
        image:
          "https://images.unsplash.com/photo-1633321702518-32ae5312c2bf?w=400",
        description: "Arroz con frutos del mar frescos",
      },
    ],
  },
  {
    name: "Bebidas",
    items: [
      {
        id: 8,
        name: "Limonada",
        price: 5,
        image:
          "https://images.unsplash.com/photo-1523677011781-c91d1bbe2f8d?w=400",
        description: "Limonada natural con hielo",
      },
      {
        id: 9,
        name: "Chicha Morada",
        price: 6,
        image:
          "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400",
        description: "Bebida tradicional peruana",
      },
      {
        id: 10,
        name: "Jugo de Naranja",
        price: 7,
        image:
          "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400",
        description: "Jugo natural recién exprimido",
      },
      {
        id: 11,
        name: "Café Americano",
        price: 4,
        image:
          "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400",
        description: "Café negro aromático",
      },
    ],
  },
  {
    name: "Postres",
    items: [
      {
        id: 12,
        name: "Torta de Chocolate",
        price: 12,
        image:
          "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400",
        description: "Deliciosa torta húmeda de chocolate",
      },
      {
        id: 13,
        name: "Helado Artesanal",
        price: 10,
        image:
          "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400",
        description: "Tres bolas de helado a elección",
      },
      {
        id: 14,
        name: "Flan Casero",
        price: 8,
        image:
          "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400",
        description: "Flan tradicional con caramelo",
      },
    ],
  },
];
