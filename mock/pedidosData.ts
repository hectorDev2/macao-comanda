export interface PedidoItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  estado: "pendiente" | "preparando" | "listo" | "entregado";
}

export interface Pedido {
  id: number;
  mesa: string;
  items: PedidoItem[];
  timestamp: string;
}

export const pedidosMock: Pedido[] = [];
