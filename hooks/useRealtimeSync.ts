"use client";

import { useEffect } from "react";
import { usePedidosStore } from "@/store/usePedidosStore";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Pedido } from "@/mock/pedidosData";

/**
 * Hook que sincroniza el estado en tiempo real usando Firebase Firestore
 * Escucha cambios en la colección de pedidos y actualiza automáticamente
 * Sin polling - actualizaciones instantáneas con onSnapshot
 */
export function useRealtimeSync() {
  useEffect(() => {
    console.log("🔥 Iniciando sincronización en tiempo real con Firebase");

    // Escuchar cambios en tiempo real de la colección de pedidos
    const pedidosRef = collection(db, "pedidos");
    const q = query(pedidosRef, orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const pedidos: Pedido[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          pedidos.push({
            id: parseInt(doc.id) || Date.now(),
            mesa: data.mesa,
            items: data.items || [],
            timestamp:
              data.timestamp?.toDate?.()?.toISOString() ||
              new Date().toISOString(),
          });
        });

        console.log(
          "📡 Actualización en tiempo real - Pedidos:",
          pedidos.length
        );

        // Actualizar el store con los nuevos datos
        usePedidosStore.setState({
          pedidos,
          lastUpdate: Date.now(),
        });
      },
      (error) => {
        console.error("❌ Error en sincronización en tiempo real:", error);
        usePedidosStore.setState({
          error: error.message,
        });
      }
    );

    // Cleanup: dejar de escuchar cuando el componente se desmonte
    return () => {
      console.log("🔥 Deteniendo sincronización en tiempo real");
      unsubscribe();
    };
  }, []);
}
