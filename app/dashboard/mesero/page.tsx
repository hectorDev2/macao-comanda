"use client";
import React, { useEffect, useState } from "react";
import { useMenuStore } from "@/store/useMenuStore";
import { usePedidosStore } from "@/store/usePedidosStore";
import MenuItemCard from "@/components/MenuItemCard";
import CategoryTabs from "@/components/CategoryTabs";
import SidebarPedido from "@/components/SidebarPedido";
import PedidosStatusBar from "@/components/PedidosStatusBar";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";

// Componente para la alerta de pedidos listos
const AlertaPedidosListos = React.memo(() => {
  const itemsListos = usePedidosStore((state) =>
    state.getItemsByEstado("listo")
  );
  const pedidosListos = itemsListos.length;

  if (pedidosListos === 0) return null;

  return (
    <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium animate-pulse">
      🔔 {pedidosListos} pedido{pedidosListos > 1 ? "s" : ""} listo
      {pedidosListos > 1 ? "s" : ""} para servir
    </div>
  );
});

AlertaPedidosListos.displayName = "AlertaPedidosListos";

export default function MeseroPage() {
  useRealtimeSync();

  const categories = useMenuStore((state) => state.categories);
  const fetchMenu = useMenuStore((state) => state.fetchMenu);
  const [activeCategory, setActiveCategory] = useState("Entradas");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Cargar el menú desde Firebase
    console.log("🔍 Cargando menú desde Firebase...");
    fetchMenu().then(() => {
      console.log("✅ Menú cargado:", categories.length, "categorías");
    }).catch((error) => {
      console.error("❌ Error al cargar menú:", error);
    });
  }, [fetchMenu]);

  const currentCategory = categories.find((c) => c.name === activeCategory);

  if (!isMounted) {
    return (
      <div className="flex gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold mb-4">Vista Mesero</h1>
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Cargando...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Vista Mesero</h1>
          <AlertaPedidosListos />
        </div>
        <PedidosStatusBar />
        <CategoryTabs
          categories={categories.map((c) => c.name)}
          active={activeCategory}
          onSelect={setActiveCategory}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {currentCategory?.items.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
      <SidebarPedido />
    </div>
  );
}
