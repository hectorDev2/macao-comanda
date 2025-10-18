export interface PedidoItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  estado: "pendiente" | "preparando" | "listo" | "entregado";
  requiresKitchen?: boolean; // Indica si el item requiere preparación en cocina
}

export interface Pedido {
  id: number;
  firebaseId?: string; // ID del documento en Firebase
  mesa: string;
  items: PedidoItem[];
  timestamp: string;
  requiresKitchen?: boolean; // Indica si el pedido requiere pasar por cocina
}

export const pedidosMock: Pedido[] = [];
