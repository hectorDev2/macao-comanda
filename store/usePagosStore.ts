import { create } from "zustand";
import { Pago } from "@/mock/pagosData";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface PagosStore {
  pagos: Pago[];
  isLoading: boolean;
  error: string | null;

  // Métodos
  fetchPagos: () => Promise<void>;
  registrarPago: (
    pago: Omit<Pago, "id" | "timestamp" | "vuelto">
  ) => Promise<string>;
  getPagosByMesa: (mesa: string) => Pago[];
  getTotalVentasDia: () => number;
  getTotalVentasMes: () => number;
}

export const usePagosStore = create<PagosStore>((set, get) => ({
  pagos: [],
  isLoading: false,
  error: null,

  // Obtener todos los pagos
  fetchPagos: async () => {
    set({ isLoading: true, error: null });
    try {
      const pagosRef = collection(db, "pagos");
      const q = query(pagosRef, orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);

      const pagos: Pago[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        pagos.push({
          id: doc.id,
          firebaseId: doc.id,
          pedidoId: data.pedidoId,
          mesa: data.mesa,
          total: data.total,
          pagadoCon: data.pagadoCon,
          vuelto: data.vuelto,
          metodoPago: data.metodoPago,
          cajero: data.cajero,
          items: data.items || [],
          timestamp:
            data.timestamp?.toDate?.()?.toISOString() ||
            new Date().toISOString(),
        });
      });

      set({ pagos, isLoading: false });
    } catch (error) {
      console.error("Error al obtener pagos:", error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  // Registrar un nuevo pago
  registrarPago: async (pagoData) => {
    set({ isLoading: true, error: null });
    try {
      const vuelto = pagoData.pagadoCon - pagoData.total;

      const nuevoPago = {
        ...pagoData,
        vuelto: vuelto >= 0 ? vuelto : 0,
        timestamp: Timestamp.now(),
      };

      // Guardar en Firebase
      const docRef = await addDoc(collection(db, "pagos"), nuevoPago);

      // Eliminar el pedido de la colección de pedidos activos
      // Buscar y eliminar el pedido
      const pedidosRef = collection(db, "pedidos");
      const pedidosQuery = query(
        pedidosRef,
        where("mesa", "==", pagoData.mesa)
      );
      const pedidosSnapshot = await getDocs(pedidosQuery);

      pedidosSnapshot.forEach(async (pedidoDoc) => {
        await deleteDoc(doc(db, "pedidos", pedidoDoc.id));
      });

      set({ isLoading: false });

      // Actualizar lista local
      get().fetchPagos();

      return docRef.id;
    } catch (error) {
      console.error("Error al registrar pago:", error);
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  // Obtener pagos por mesa
  getPagosByMesa: (mesa: string) => {
    return get().pagos.filter((p) => p.mesa === mesa);
  },

  // Total de ventas del día
  getTotalVentasDia: () => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    return get()
      .pagos.filter((p) => {
        const fecha = new Date(p.timestamp);
        return fecha >= hoy;
      })
      .reduce((sum, p) => sum + p.total, 0);
  },

  // Total de ventas del mes
  getTotalVentasMes: () => {
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

    return get()
      .pagos.filter((p) => {
        const fecha = new Date(p.timestamp);
        return fecha >= inicioMes;
      })
      .reduce((sum, p) => sum + p.total, 0);
  },
}));
