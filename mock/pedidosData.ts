export interface PedidoItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  estado: "pendiente" | "preparando" | "listo" | "entregado";
}

export interface Pedido {
  id: number;
  firebaseId?: string; // ID del documento en Firebase
  mesa: string;
  items: PedidoItem[];
  timestamp: string;
}

export const pedidosMock: Pedido[] = [];
