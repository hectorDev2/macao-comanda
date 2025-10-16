export interface Pago {
  id: string;
  firebaseId?: string;
  pedidoId: string; // ID del pedido asociado
  mesa: string;
  total: number;
  pagadoCon: number;
  vuelto: number;
  metodoPago: "efectivo" | "tarjeta" | "transferencia";
  cajero: string; // Email del usuario que registró el pago
  timestamp: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export const pagosMock: Pago[] = [];
