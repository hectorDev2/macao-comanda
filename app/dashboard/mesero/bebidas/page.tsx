"use client";
import React, { useEffect, useState } from "react";
import { useMenuStore } from "@/store/useMenuStore";
import { usePedidosStore } from "@/store/usePedidosStore";
import MenuItemCard from "@/components/MenuItemCard";
import SidebarPedido from "@/components/SidebarPedido";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";
import ProtectedRoute from "@/components/ProtectedRoute";

function BebidasPageContent() {
  useRealtimeSync();

  const categories = useMenuStore((state) => state.categories);
  const fetchMenu = useMenuStore((state) => state.fetchMenu);
  const isLoading = useMenuStore((state) => state.isLoading);
  const error = useMenuStore((state) => state.error);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchMenu();
  }, [fetchMenu]);

  // Filtrar solo categorías de bebidas
  const bebidaCategories = categories.filter((cat) =>
    [
      "Bebidas Calientes",
      "Refrescos",
      "Gaseosas",
      "Aguas",
      "Cervezas",
      "Cocteles",
      "Vinos",
    ].includes(cat.title)
  );

  if (!isMounted) {
    return (
      <div className="p-3 sm:p-4">
        <h1 className="text-xl sm:text-2xl font-semibold mb-4">
          Panel de Bebidas
        </h1>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 p-3 sm:p-4 lg:p-6 max-w-[1920px] mx-auto">
        {/* Contenido principal */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4 sm:mb-5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-2xl sm:text-3xl shadow-lg">
              🍹
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
                Panel de Bebidas
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                Gestiona pedidos de bebidas rápidamente
              </p>
            </div>
          </div>

          {/* Grid de categorías */}
          {isLoading ? (
            <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-200 p-8 sm:p-12 text-center">
              <div className="text-5xl sm:text-6xl mb-4 animate-bounce">🍹</div>
              <p className="text-lg sm:text-xl font-semibold text-gray-600">
                Cargando bebidas...
              </p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-2xl shadow-sm border-2 border-red-200 p-8 sm:p-12 text-center">
              <div className="text-5xl sm:text-6xl mb-4">❌</div>
              <p className="text-lg sm:text-xl font-semibold text-red-600 mb-2">
                Error al cargar bebidas
              </p>
              <p className="text-sm text-gray-500">{error}</p>
              <button
                onClick={() => fetchMenu()}
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Reintentar
              </button>
            </div>
          ) : bebidaCategories.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border-2 border-yellow-200 p-8 sm:p-12 text-center">
              <div className="text-5xl sm:text-6xl mb-4">🍺</div>
              <p className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
                No hay bebidas disponibles
              </p>
              <p className="text-sm text-gray-500">
                Las categorías de bebidas aparecerán aquí
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {bebidaCategories.map((category) => (
                <div key={category.title}>
                  <div className="flex items-center justify-between mb-3 px-1">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                      {category.title}
                    </h3>
                    <span className="text-xs sm:text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                      {category.items.length} items
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                    {category.items.map((item, index) => (
                      <MenuItemCard key={`${item.name}-${index}`} item={item} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar - Fixed en móvil, static en desktop */}
        <SidebarPedido />
      </div>
    </div>
  );
}

export default function BebidasPage() {
  return (
    <ProtectedRoute requiredPermission="bebidas">
      <BebidasPageContent />
    </ProtectedRoute>
  );
}
