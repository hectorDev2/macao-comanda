"use client";
import React, { useEffect, useState } from "react";
import { usePedidosStore } from "@/store/usePedidosStore";
import PedidoItemCard from "@/components/PedidoItemCard";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";

// Componente para la columna de items pendientes
const PendientesColumn = React.memo(() => {
  const itemsPendientes = usePedidosStore((state) => state.getItemsByEstado("pendiente"));
  const updateItemStatus = usePedidosStore((state) => state.updateItemStatus);

  return (
    <div className="bg-yellow-50 rounded-xl p-6 border-2 border-yellow-200">
      <h2 className="text-2xl font-bold text-yellow-700 mb-4 flex items-center justify-between">
        <span>⏳ Pendientes</span>
        <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-lg">
          {itemsPendientes.length}
        </span>
      </h2>
      <div className="space-y-4">
        {itemsPendientes.length === 0 ? (
          <p className="text-yellow-600 text-center py-8">No hay items pendientes</p>
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

PendientesColumn.displayName = 'PendientesColumn';

// Componente para la columna de items en preparación
const PreparandoColumn = React.memo(() => {
  const itemsPreparando = usePedidosStore((state) => state.getItemsByEstado("preparando"));
  const updateItemStatus = usePedidosStore((state) => state.updateItemStatus);

  return (
    <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
      <h2 className="text-2xl font-bold text-blue-700 mb-4 flex items-center justify-between">
        <span>🔥 En Preparación</span>
        <span className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-lg">
          {itemsPreparando.length}
        </span>
      </h2>
      <div className="space-y-4">
        {itemsPreparando.length === 0 ? (
          <p className="text-blue-600 text-center py-8">No hay items en preparación</p>
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

PreparandoColumn.displayName = 'PreparandoColumn';

// Componente para la columna de items listos
const ListosColumn = React.memo(() => {
  const itemsListos = usePedidosStore((state) => state.getItemsByEstado("listo"));
  const updateItemStatus = usePedidosStore((state) => state.updateItemStatus);

  return (
    <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
      <h2 className="text-2xl font-bold text-green-700 mb-4 flex items-center justify-between">
        <span>✅ Listos para Servir</span>
        <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-lg">
          {itemsListos.length}
        </span>
      </h2>
      <div className="space-y-4">
        {itemsListos.length === 0 ? (
          <p className="text-green-600 text-center py-8">No hay items listos</p>
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

ListosColumn.displayName = 'ListosColumn';

export default function CocinaPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 flex items-center gap-3">
          👨‍🍳 <span>Panel de Cocina</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <PendientesColumn />
          <PreparandoColumn />
          <ListosColumn />
        </div>
      </div>
    </div>
  );
}
