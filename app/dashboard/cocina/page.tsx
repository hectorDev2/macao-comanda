"use client";
import React, { useEffect, useState } from "react";
import { usePedidosStore } from "@/store/usePedidosStore";
import PedidoItemCard from "@/components/PedidoItemCard";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";
import ProtectedRoute from "@/components/ProtectedRoute";

// Componente para la columna de items pendientes
const PendientesColumn = React.memo(() => {
  const itemsPendientes = usePedidosStore((state) =>
    state.getItemsByEstado("pendiente")
  );
  const updateItemStatus = usePedidosStore((state) => state.updateItemStatus);

  return (
    <div className="bg-yellow-50 rounded-xl p-3 sm:p-4 lg:p-6 border-2 border-yellow-200">
      <h2 className="text-xl sm:text-2xl font-bold text-yellow-700 mb-3 sm:mb-4 flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-lg sm:text-2xl">⏳</span>
          <span className="truncate">Pendientes</span>
        </span>
        <span className="bg-yellow-200 text-yellow-800 px-2.5 sm:px-3 py-1 rounded-full text-base sm:text-lg shrink-0">
          {itemsPendientes.length}
        </span>
      </h2>
      <div className="space-y-2 sm:space-y-3 lg:space-y-4">
        {itemsPendientes.length === 0 ? (
          <p className="text-yellow-600 text-center py-6 sm:py-8 text-sm sm:text-base">
            No hay items pendientes
          </p>
        ) : (
          itemsPendientes.map(({ pedido, item }) => (
            <PedidoItemCard
              key={`${pedido.id}-${item.id}`}
              pedidoId={pedido.id}
              mesa={pedido.mesa}
              item={item}
              timestamp={pedido.timestamp}
              onUpdateStatus={updateItemStatus}
            />
          ))
        )}
      </div>
    </div>
  );
});

PendientesColumn.displayName = "PendientesColumn";

// Componente para la columna de items en preparación
const PreparandoColumn = React.memo(() => {
  const itemsPreparando = usePedidosStore((state) =>
    state.getItemsByEstado("preparando")
  );
  const updateItemStatus = usePedidosStore((state) => state.updateItemStatus);

  return (
    <div className="bg-blue-50 rounded-xl p-3 sm:p-4 lg:p-6 border-2 border-blue-200">
      <h2 className="text-xl sm:text-2xl font-bold text-blue-700 mb-3 sm:mb-4 flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-lg sm:text-2xl">🔥</span>
          <span className="truncate">En Preparación</span>
        </span>
        <span className="bg-blue-200 text-blue-800 px-2.5 sm:px-3 py-1 rounded-full text-base sm:text-lg shrink-0">
          {itemsPreparando.length}
        </span>
      </h2>
      <div className="space-y-2 sm:space-y-3 lg:space-y-4">
        {itemsPreparando.length === 0 ? (
          <p className="text-blue-600 text-center py-6 sm:py-8 text-sm sm:text-base">
            No hay items en preparación
          </p>
        ) : (
          itemsPreparando.map(({ pedido, item }) => (
            <PedidoItemCard
              key={`${pedido.id}-${item.id}`}
              pedidoId={pedido.id}
              mesa={pedido.mesa}
              item={item}
              timestamp={pedido.timestamp}
              onUpdateStatus={updateItemStatus}
            />
          ))
        )}
      </div>
    </div>
  );
});

PreparandoColumn.displayName = "PreparandoColumn";

// Componente para la columna de items listos
const ListosColumn = React.memo(() => {
  const itemsListos = usePedidosStore((state) =>
    state.getItemsByEstado("listo")
  );
  const updateItemStatus = usePedidosStore((state) => state.updateItemStatus);

  return (
    <div className="bg-green-50 rounded-xl p-3 sm:p-4 lg:p-6 border-2 border-green-200">
      <h2 className="text-xl sm:text-2xl font-bold text-green-700 mb-3 sm:mb-4 flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-lg sm:text-2xl">✅</span>
          <span className="truncate">Listos</span>
        </span>
        <span className="bg-green-200 text-green-800 px-2.5 sm:px-3 py-1 rounded-full text-base sm:text-lg shrink-0">
          {itemsListos.length}
        </span>
      </h2>
      <div className="space-y-2 sm:space-y-3 lg:space-y-4">
        {itemsListos.length === 0 ? (
          <p className="text-green-600 text-center py-6 sm:py-8 text-sm sm:text-base">
            No hay items listos
          </p>
        ) : (
          itemsListos.map(({ pedido, item }) => (
            <PedidoItemCard
              key={`${pedido.id}-${item.id}`}
              pedidoId={pedido.id}
              mesa={pedido.mesa}
              item={item}
              timestamp={pedido.timestamp}
              onUpdateStatus={updateItemStatus}
            />
          ))
        )}
      </div>
    </div>
  );
});

ListosColumn.displayName = "ListosColumn";

function CocinaPageContent() {
  useRealtimeSync();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            👨‍🍳 <span>Panel de Cocina</span>
          </h1>
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Cargando...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-50 min-h-screen p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 flex items-center gap-2">
            👨‍🍳 <span>Panel de Cocina</span>
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Gestiona los pedidos en tiempo real
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          <PendientesColumn />
          <PreparandoColumn />
          <ListosColumn />
        </div>
      </div>
    </div>
  );
}

export default function CocinaPage() {
  return (
    <ProtectedRoute requiredPermission="cocina">
      <CocinaPageContent />
    </ProtectedRoute>
  );
}
