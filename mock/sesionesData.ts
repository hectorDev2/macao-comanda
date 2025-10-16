export interface Sesion {
  id: string;
  firebaseId?: string;
  fechaApertura: string;
  fechaCierre: string;
  cajero: string;
  totalVentas: number;
  totalTransacciones: number;
  pagos: Array<{
    id: string;
    firebaseId?: string;
    pedidoId: string;
    mesa: string;
    total: number;
    pagadoCon: number;
    vuelto: number;
    metodoPago: "efectivo" | "tarjeta" | "transferencia";
    cajero: string;
    timestamp: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
  }>;
  desglosePorMetodo: {
    efectivo: number;
    tarjeta: number;
    transferencia: number;
  };
  estado: "abierta" | "cerrada";
}

export const sesionesData: Sesion[] = [];
