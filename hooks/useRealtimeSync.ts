"use client";

import { useEffect, useRef } from "react";
import { usePedidosStore } from "@/store/usePedidosStore";

/**
 * Hook que sincroniza el estado consultando la API periódicamente
 * Polling cada 2 segundos para obtener pedidos actualizados
 * Permite ver cambios en tiempo real entre diferentes dispositivos/pestañas
 */
export function useRealtimeSync() {
  const lastUpdateRef = useRef<number>(0);
  const fetchPedidos = usePedidosStore((state) => state.fetchPedidos);

  useEffect(() => {
    // Cargar pedidos inicialmente
    fetchPedidos();

    // Polling para obtener actualizaciones
    const pollInterval = setInterval(async () => {
      try {
        await fetchPedidos();
      } catch (error) {
        console.error("Error syncing pedidos:", error);
      }
    }, 2000); // Cada 2 segundos

    return () => clearInterval(pollInterval);
  }, [fetchPedidos]);

  // Escuchar cambios en localStorage de otras pestañas (para sincronización del carrito)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "comanda-storage" && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          const currentState = usePedidosStore.getState();

          // Solo sincronizar el carrito entre pestañas, no los pedidos (esos vienen de la API)
          if (
            JSON.stringify(data.state.currentCart) !==
            JSON.stringify(currentState.currentCart)
          ) {
            usePedidosStore.setState({
              currentCart: data.state.currentCart,
            });
          }
        } catch (error) {
          console.error("Error syncing storage:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
}
