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
    <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-green-100 to-green-200 border-2 border-green-300 text-green-800 rounded-lg font-semibold shadow-md animate-pulse">
      <div className="flex items-center gap-2 justify-center sm:justify-start">
        <span className="text-xl sm:text-2xl">🔔</span>
        <span className="text-sm sm:text-base">
          {pedidosListos} pedido{pedidosListos > 1 ? "s" : ""} listo
          {pedidosListos > 1 ? "s" : ""} para servir
        </span>
      </div>
    </div>
  );
});

AlertaPedidosListos.displayName = "AlertaPedidosListos";

export default function MeseroPage() {
  useRealtimeSync();

  const categories = useMenuStore((state) => state.categories);
  const fetchMenu = useMenuStore((state) => state.fetchMenu);
  const isLoading = useMenuStore((state) => state.isLoading);
  const error = useMenuStore((state) => state.error);
  const [activeCategory, setActiveCategory] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Cargar el menú desde Firebase
    console.log("🔍 Cargando menú desde Firebase...");
    fetchMenu()
      .then(() => {
        console.log("✅ Menú cargado:", categories.length, "categorías");
      })
      .catch((error) => {
        console.error("❌ Error al cargar menú:", error);
      });
  }, [fetchMenu]);

  // Establecer la primera categoría cuando el menú se cargue
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].title);
    }
  }, [categories, activeCategory]);

  const currentCategory = categories.find((c) => c.title === activeCategory);

  if (!isMounted) {
    return (
      <div className="p-3 sm:p-4">
        <h1 className="text-xl sm:text-2xl font-semibold mb-4">Vista Mesero</h1>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 p-3 sm:p-4 lg:p-6 max-w-[1920px] mx-auto">
        {/* Contenido principal */}
        <div className="flex-1 min-w-0">
          {/* Header con título y alerta */}
          <div className="flex flex-col gap-3 mb-4 sm:mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-2xl sm:text-3xl shadow-lg">
                👨‍🍳
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
                  Vista Mesero
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                  Gestiona los pedidos de las mesas
                </p>
              </div>
            </div>
            <AlertaPedidosListos />
          </div>

          {/* Barra de estado de pedidos */}
          <div className="mb-4 sm:mb-5">
            <PedidosStatusBar />
          </div>

          {/* Tabs de categorías - Scroll horizontal en móvil */}
          <div className="mb-4 sm:mb-5">
            <h2 className="text-sm font-semibold text-gray-600 mb-2 px-1">
              📋 Categorías del Menú
            </h2>
            <CategoryTabs
              categories={categories.map((c) => c.title)}
              active={activeCategory}
              onSelect={setActiveCategory}
            />
          </div>

          {/* Grid de items del menú */}
          {isLoading ? (
            <div className="col-span-full">
              <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-200 p-8 sm:p-12 text-center">
                <div className="text-5xl sm:text-6xl mb-4 animate-bounce">
                  🍴
                </div>
                <p className="text-lg sm:text-xl font-semibold text-gray-600">
                  Cargando menú...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="col-span-full">
              <div className="bg-white rounded-2xl shadow-sm border-2 border-red-200 p-8 sm:p-12 text-center">
                <div className="text-5xl sm:text-6xl mb-4">❌</div>
                <p className="text-lg sm:text-xl font-semibold text-red-600 mb-2">
                  Error al cargar menú
                </p>
                <p className="text-sm text-gray-500">{error}</p>
                <button
                  onClick={() => fetchMenu()}
                  className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  Reintentar
                </button>
              </div>
            </div>
          ) : currentCategory ? (
            <>
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                  {currentCategory.title}
                </h3>
                <span className="text-xs sm:text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  {currentCategory.items.length} items
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 pb-24 lg:pb-6">
                {currentCategory.items.length === 0 ? (
                  <div className="col-span-full">
                    <div className="bg-white rounded-2xl shadow-sm border-2 border-dashed border-gray-300 p-8 sm:p-12 text-center">
                      <div className="text-5xl sm:text-6xl mb-4">🍽️</div>
                      <p className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
                        No hay items disponibles
                      </p>
                      <p className="text-sm text-gray-500">
                        Esta categoría está vacía por el momento
                      </p>
                    </div>
                  </div>
                ) : (
                  currentCategory.items.map((item, index) => (
                    <MenuItemCard key={`${item.name}-${index}`} item={item} />
                  ))
                )}
              </div>
            </>
          ) : categories.length === 0 ? (
            <div className="col-span-full">
              <div className="bg-white rounded-2xl shadow-sm border-2 border-yellow-200 p-8 sm:p-12 text-center">
                <div className="text-5xl sm:text-6xl mb-4">📋</div>
                <p className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
                  No hay categorías disponibles
                </p>
                <p className="text-sm text-gray-500">
                  Ejecuta el script de migración para cargar el menú
                </p>
                <code className="block mt-4 text-xs bg-gray-100 p-3 rounded">
                  bun run seed:menu
                </code>
              </div>
            </div>
          ) : null}
        </div>

        {/* Sidebar - Fixed en móvil, static en desktop */}
        <SidebarPedido />
      </div>
    </div>
  );
}
