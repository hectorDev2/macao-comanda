import { create } from "zustand";
import { Pedido, PedidoItem } from "@/mock/pedidosData";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Notification {
  id: string;
  message: string;
  type: "success" | "info" | "warning";
  timestamp: string;
}

interface PedidosStore {
  pedidos: Pedido[];
  currentCart: CartItem[];
  notifications: Notification[];
  lastUpdate: number;
  isLoading: boolean;
  error: string | null;

  // Métodos de carrito (locales)
  addToCart: (item: { id: number; name: string; price: number }) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;

  // Métodos que usan API
  fetchPedidos: () => Promise<void>;
  submitOrder: (mesa: string) => Promise<void>;
  updateItemStatus: (
    pedidoId: number,
    itemId: number,
    estado: "pendiente" | "preparando" | "listo" | "entregado"
  ) => Promise<void>;
  cancelarItem: (pedidoId: number, itemId: number) => Promise<void>;

  // Métodos de sincronización
  addPedidoFromSocket: (pedido: Pedido) => void;
  updateItemFromSocket: (data: {
    pedidoId: number;
    itemId: number;
    estado: string;
  }) => void;

  // Utilidades
  addNotification: (
    message: string,
    type: "success" | "info" | "warning"
  ) => void;
  clearNotification: (id: string) => void;
  getItemsByEstado: (
    estado: "pendiente" | "preparando" | "listo"
  ) => Array<{ pedido: Pedido; item: PedidoItem }>;
}

export const usePedidosStore = create<PedidosStore>()((set, get) => ({
  pedidos: [],
  currentCart: [],
  notifications: [],
  lastUpdate: Date.now(),
  isLoading: false,
  error: null,

  addToCart: (item) => {
    const cart = get().currentCart;
    const existing = cart.find((i) => i.id === item.id);
    if (existing) {
      set({
        currentCart: cart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      });
    } else {
      set({ currentCart: [...cart, { ...item, quantity: 1 }] });
    }
  },

  removeFromCart: (id) => {
    set({ currentCart: get().currentCart.filter((i) => i.id !== id) });
  },

  clearCart: () => {
    set({ currentCart: [] });
  },

  // Obtener todos los pedidos desde Firebase
  fetchPedidos: async () => {
    set({ isLoading: true, error: null });
    try {
      const pedidosRef = collection(db, "pedidos");
      const q = query(pedidosRef, orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);

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

      set({ pedidos, lastUpdate: Date.now(), isLoading: false });
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  // Enviar pedido a Firebase
  submitOrder: async (mesa) => {
    const cart = get().currentCart;
    if (cart.length === 0) return;

    set({ isLoading: true, error: null });
    try {
      const newPedido = {
        mesa,
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          estado: "pendiente" as const,
        })),
        timestamp: Timestamp.now(),
      };

      // Agregar el pedido a Firebase
      await addDoc(collection(db, "pedidos"), newPedido);

      // Solo limpiar el carrito y actualizar estado
      // El listener de Firebase (onSnapshot) se encargará de agregar el pedido a la lista
      set({
        currentCart: [],
        isLoading: false,
      });

      get().addNotification(
        `🍽️ Nuevo pedido para Mesa ${mesa} (${cart.length} items)`,
        "info"
      );
    } catch (error) {
      console.error("Error al crear pedido:", error);
      set({ error: (error as Error).message, isLoading: false });
      get().addNotification(
        `❌ Error al enviar pedido: ${(error as Error).message}`,
        "warning"
      );
    }
  },

  // Actualizar estado de un item en Firebase
  updateItemStatus: async (
    pedidoId: number,
    itemId: number,
    estado: string
  ) => {
    const pedido = get().pedidos.find((p: Pedido) => p.id === pedidoId);
    if (!pedido) {
      console.error("❌ Pedido no encontrado:", pedidoId);
      return;
    }

    const item = pedido.items.find((i: PedidoItem) => i.id === itemId);
    if (!item) {
      console.error("❌ Item no encontrado:", itemId);
      return;
    }

    // Usar el firebaseId si está disponible
    if (!pedido.firebaseId) {
      console.error("❌ No se encontró el ID de Firebase para el pedido");
      return;
    }

    set({ isLoading: true, error: null });
    try {
      // Usar directamente el firebaseId del pedido
      const docRef = doc(db, "pedidos", pedido.firebaseId);
      const updatedItems = pedido.items.map((i: PedidoItem) =>
        i.id === itemId ? { ...i, estado } : i
      );

      await updateDoc(docRef, {
        items: updatedItems,
      });

      // Solo actualizar el estado de loading
      // El listener de Firebase (onSnapshot) se encargará de actualizar los datos
      set({
        isLoading: false,
      });

      // Notificaciones según el estado
      if (estado === "preparando") {
        get().addNotification(
          `👨‍🍳 Mesa ${pedido.mesa}: ${item.name} en preparación`,
          "info"
        );
      } else if (estado === "listo") {
        get().addNotification(
          `✅ Mesa ${pedido.mesa}: ${item.name} listo!`,
          "success"
        );
      } else if (estado === "entregado") {
        const allDelivered = pedido.items.every((i) =>
          i.id === itemId ? true : i.estado === "entregado"
        );
        if (allDelivered) {
          get().addNotification(
            `🎉 Mesa ${pedido.mesa}: Pedido completo entregado`,
            "success"
          );
        }
      }
    } catch (error) {
      console.error("❌ Error al actualizar item:", error);
      set({ error: (error as Error).message, isLoading: false });
      get().addNotification(
        `❌ Error al actualizar estado: ${(error as Error).message}`,
        "warning"
      );
    }
  },

  // Cancelar un item específico del pedido
  cancelarItem: async (pedidoId: number, itemId: number) => {
    const pedido = get().pedidos.find((p: Pedido) => p.id === pedidoId);
    if (!pedido) {
      console.error("❌ Pedido no encontrado:", pedidoId);
      return;
    }

    const item = pedido.items.find((i: PedidoItem) => i.id === itemId);
    if (!item) {
      console.error("❌ Item no encontrado:", itemId);
      return;
    }

    // Verificar que el item esté en estado pendiente
    if (item.estado !== "pendiente") {
      get().addNotification(
        `⚠️ Solo se pueden cancelar items pendientes`,
        "warning"
      );
      return;
    }

    if (!pedido.firebaseId) {
      console.error("❌ No se encontró el ID de Firebase para el pedido");
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const docRef = doc(db, "pedidos", pedido.firebaseId);
      
      // Filtrar el item que se quiere cancelar
      const updatedItems = pedido.items.filter((i: PedidoItem) => i.id !== itemId);

      // Si no quedan más items, eliminar el pedido completo
      if (updatedItems.length === 0) {
        await deleteDoc(docRef);
        get().addNotification(
          `🗑️ Pedido de Mesa ${pedido.mesa} cancelado completamente`,
          "info"
        );
      } else {
        // Si quedan items, actualizar el pedido
        await updateDoc(docRef, {
          items: updatedItems,
        });
        get().addNotification(
          `❌ Item ${item.name} cancelado de Mesa ${pedido.mesa}`,
          "warning"
        );
      }

      set({ isLoading: false });
    } catch (error) {
      console.error("❌ Error al cancelar item:", error);
      set({ error: (error as Error).message, isLoading: false });
      get().addNotification(
        `❌ Error al cancelar: ${(error as Error).message}`,
        "warning"
      );
    }
  },

  // Métodos para sincronización en tiempo real (WebSocket)
  addPedidoFromSocket: (pedido) => {
    set({
      pedidos: [...get().pedidos, pedido],
      lastUpdate: Date.now(),
    });
  },

  updateItemFromSocket: ({ pedidoId, itemId, estado }) => {
    set({
      pedidos: get().pedidos.map((p) =>
        p.id === pedidoId
          ? {
              ...p,
              items: p.items.map((i) =>
                i.id === itemId ? { ...i, estado: estado as any } : i
              ),
            }
          : p
      ),
      lastUpdate: Date.now(),
    });
  },

  addNotification: (message, type) => {
    const notification: Notification = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: new Date().toISOString(),
    };

    set({ notifications: [...get().notifications, notification] });

    // Auto-remover después de 5 segundos
    setTimeout(() => {
      get().clearNotification(notification.id);
    }, 5000);
  },

  clearNotification: (id) => {
    set({ notifications: get().notifications.filter((n) => n.id !== id) });
  },

  getItemsByEstado: (estado) => {
    const result: Array<{ pedido: Pedido; item: PedidoItem }> = [];
    get().pedidos.forEach((pedido) => {
      pedido.items.forEach((item) => {
        if (item.estado === estado) {
          result.push({ pedido, item });
        }
      });
    });
    return result;
  },
}));
