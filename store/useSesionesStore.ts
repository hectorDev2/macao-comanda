import { create } from "zustand";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Sesion } from "@/mock/sesionesData";
import { Pago } from "@/mock/pagosData";

interface SesionesState {
  sesiones: Sesion[];
  sesionActual: Sesion | null;
  isLoading: boolean;

  // Acciones
  fetchSesiones: () => Promise<void>;
  cerrarCaja: (pagos: Pago[], cajero: string) => Promise<void>;
  getSesionActual: () => Sesion | null;
}

export const useSesionesStore = create<SesionesState>((set, get) => ({
  sesiones: [],
  sesionActual: null,
  isLoading: false,

  fetchSesiones: async () => {
    try {
      set({ isLoading: true });
      const q = query(
        collection(db, "sesiones"),
        orderBy("fechaCierre", "desc")
      );
      const querySnapshot = await getDocs(q);

      const sesiones: Sesion[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          firebaseId: doc.id,
          ...data,
        } as Sesion;
      });

      set({ sesiones, isLoading: false });
    } catch (error) {
      console.error("Error fetching sesiones:", error);
      set({ isLoading: false });
    }
  },

  cerrarCaja: async (pagos: Pago[], cajero: string) => {
    try {
      console.log("🏪 [Store] Iniciando cerrarCaja...");
      console.log("📦 [Store] Pagos recibidos:", pagos.length);
      console.log("👤 [Store] Cajero:", cajero);

      set({ isLoading: true });

      // Calcular totales
      const totalVentas = pagos.reduce((sum, p) => sum + p.total, 0);
      const totalTransacciones = pagos.length;

      console.log("💰 [Store] Total ventas:", totalVentas);
      console.log("🧾 [Store] Total transacciones:", totalTransacciones);

      // Desglose por método de pago
      const desglosePorMetodo = {
        efectivo: pagos
          .filter((p) => p.metodoPago === "efectivo")
          .reduce((sum, p) => sum + p.total, 0),
        tarjeta: pagos
          .filter((p) => p.metodoPago === "tarjeta")
          .reduce((sum, p) => sum + p.total, 0),
        transferencia: pagos
          .filter((p) => p.metodoPago === "transferencia")
          .reduce((sum, p) => sum + p.total, 0),
      };

      // Obtener fecha/hora de apertura (primer pago del día)
      const fechaApertura =
        pagos.length > 0
          ? pagos.reduce((earliest, p) =>
              new Date(p.timestamp) < new Date(earliest.timestamp)
                ? p
                : earliest
            ).timestamp
          : new Date().toISOString();

      const sesion: Omit<Sesion, "id" | "firebaseId"> = {
        fechaApertura,
        fechaCierre: new Date().toISOString(),
        cajero,
        totalVentas,
        totalTransacciones,
        pagos: pagos.map((p) => ({
          id: p.id,
          firebaseId: p.firebaseId,
          pedidoId: p.pedidoId,
          mesa: p.mesa,
          total: p.total,
          pagadoCon: p.pagadoCon,
          vuelto: p.vuelto,
          metodoPago: p.metodoPago,
          cajero: p.cajero,
          timestamp: p.timestamp,
          items: p.items,
        })),
        desglosePorMetodo,
        estado: "cerrada",
      };

      console.log("💾 [Store] Guardando sesión en Firebase...");
      console.log("📄 [Store] Datos de sesión:", sesion);

      // Guardar sesión en Firebase
      const docRef = await addDoc(collection(db, "sesiones"), sesion);
      console.log("✅ [Store] Sesión guardada con ID:", docRef.id);

      // Limpiar colecciones (pedidos y pagos)
      console.log("🗑️ [Store] Limpiando colecciones...");
      const batch = writeBatch(db);

      // Eliminar todos los pedidos
      console.log("📦 [Store] Obteniendo pedidos...");
      const pedidosSnapshot = await getDocs(collection(db, "pedidos"));
      console.log(
        `🗑️ [Store] Eliminando ${pedidosSnapshot.docs.length} pedidos...`
      );
      pedidosSnapshot.docs.forEach((docSnap) => {
        batch.delete(docSnap.ref);
      });

      // Eliminar todos los pagos
      console.log("💵 [Store] Obteniendo pagos...");
      const pagosSnapshot = await getDocs(collection(db, "pagos"));
      console.log(
        `🗑️ [Store] Eliminando ${pagosSnapshot.docs.length} pagos...`
      );
      pagosSnapshot.docs.forEach((docSnap) => {
        batch.delete(docSnap.ref);
      });

      console.log("⚡ [Store] Ejecutando batch delete...");
      await batch.commit();
      console.log("✅ [Store] Colecciones limpiadas exitosamente");

      // Actualizar estado local
      console.log("🔄 [Store] Actualizando estado local...");
      await get().fetchSesiones();
      set({ isLoading: false });

      console.log("🎉 [Store] Cierre de caja completado exitosamente");
      return;
    } catch (error: any) {
      console.error("❌ [Store] Error cerrando caja:", error);
      console.error("❌ [Store] Stack trace:", error.stack);
      console.error("❌ [Store] Error message:", error.message);
      set({ isLoading: false });
      throw error;
    }
  },

  getSesionActual: () => {
    return get().sesionActual;
  },
}));
