"use client";
import React, { useState, useEffect } from "react";
import { usePedidosStore } from "@/store/usePedidosStore";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";
import { Pedido } from "@/mock/pedidosData";

// Componente separado para el resumen general
function ResumenGeneral() {
  // Selector específico - solo se re-renderiza cuando cambian los pedidos
  const pedidos = usePedidosStore((state) => state.pedidos);

  const totalItems = pedidos.reduce((sum, p) => sum + p.items.length, 0);
  const ventaTotal = pedidos.reduce(
    (sum, p) => sum + p.items.reduce((s, i) => s + i.price * i.quantity, 0),
    0
  );

  // Agrupar mesas
  const mesasMap = new Map<string, Pedido[]>();
  pedidos.forEach((pedido) => {
    const existing = mesasMap.get(pedido.mesa) || [];
    mesasMap.set(pedido.mesa, [...existing, pedido]);
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="text-sm text-gray-600">Total Mesas</div>
        <div className="text-3xl font-bold text-purple-600">
          {mesasMap.size}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="text-sm text-gray-600">Total Pedidos</div>
        <div className="text-3xl font-bold text-blue-600">
          {pedidos.length}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="text-sm text-gray-600">Items Totales</div>
        <div className="text-3xl font-bold text-orange-600">{totalItems}</div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="text-sm text-gray-600">Venta Total</div>
        <div className="text-3xl font-bold text-green-600">
          S/ {ventaTotal.toFixed(2)}
        </div>
      </div>
    </div>
  );
}

// Componente para una mesa individual
const MesaCard = React.memo(({ mesa, isSelected, onClick }: any) => {
  return (
    <div
      onClick={onClick}
      className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg ${
        isSelected
          ? "border-purple-500 bg-purple-50"
          : "border-gray-200 hover:border-purple-300"
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Mesa {mesa.mesa}</h3>
          <p className="text-sm text-gray-500">
            {mesa.totalPedidos} pedido{mesa.totalPedidos !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-green-600">
            S/ {mesa.totalVenta.toFixed(2)}
          </div>
          <div className="text-xs text-gray-500">{mesa.totalItems} items</div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-1 text-xs">
        {mesa.itemsPendientes > 0 && (
          <div className="bg-yellow-100 text-yellow-700 rounded px-2 py-1 text-center">
            ⏳ {mesa.itemsPendientes}
          </div>
        )}
        {mesa.itemsPreparando > 0 && (
          <div className="bg-blue-100 text-blue-700 rounded px-2 py-1 text-center">
            🔥 {mesa.itemsPreparando}
          </div>
        )}
        {mesa.itemsListos > 0 && (
          <div className="bg-green-100 text-green-700 rounded px-2 py-1 text-center">
            ✅ {mesa.itemsListos}
          </div>
        )}
        {mesa.itemsEntregados > 0 && (
          <div className="bg-gray-100 text-gray-700 rounded px-2 py-1 text-center">
            🎉 {mesa.itemsEntregados}
          </div>
        )}
      </div>
    </div>
  );
});

MesaCard.displayName = 'MesaCard';

// Componente para lista de mesas
function MesasActivas({ onSelectMesa, selectedMesa }: any) {
  // Solo se suscribe a pedidos
  const pedidos = usePedidosStore((state) => state.pedidos);

  const mesasMap = new Map<string, Pedido[]>();
  pedidos.forEach((pedido) => {
    const existing = mesasMap.get(pedido.mesa) || [];
    mesasMap.set(pedido.mesa, [...existing, pedido]);
  });

  const mesas = Array.from(mesasMap.entries())
    .map(([mesa, pedidos]) => ({
      mesa,
      pedidos,
      totalPedidos: pedidos.length,
      totalItems: pedidos.reduce((sum, p) => sum + p.items.length, 0),
      totalVenta: pedidos.reduce(
        (sum, p) => sum + p.items.reduce((s, i) => s + i.price * i.quantity, 0),
        0
      ),
      itemsPendientes: pedidos.reduce(
        (sum, p) => sum + p.items.filter((i) => i.estado === "pendiente").length,
        0
      ),
      itemsPreparando: pedidos.reduce(
        (sum, p) => sum + p.items.filter((i) => i.estado === "preparando").length,
        0
      ),
      itemsListos: pedidos.reduce(
        (sum, p) => sum + p.items.filter((i) => i.estado === "listo").length,
        0
      ),
      itemsEntregados: pedidos.reduce(
        (sum, p) => sum + p.items.filter((i) => i.estado === "entregado").length,
        0
      ),
    }))
    .sort((a, b) => Number(a.mesa) - Number(b.mesa));

  if (mesas.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Mesas Activas</h2>
        <p className="text-gray-500 text-center py-8">
          No hay pedidos registrados aún
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Mesas Activas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mesas.map((mesa) => (
          <MesaCard
            key={mesa.mesa}
            mesa={mesa}
            isSelected={selectedMesa === mesa.mesa}
            onClick={() => onSelectMesa(mesa.mesa)}
          />
        ))}
      </div>
    </div>
  );
}

// Componente para detalle de mesa
function DetalleMesa({ mesa, onClose }: any) {
  // Selector específico para pedidos de esta mesa
  const pedidos = usePedidosStore((state) =>
    state.pedidos.filter((p) => p.mesa === mesa)
  );

  if (pedidos.length === 0) return null;

  return (
    <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Detalle Mesa {mesa}</h2>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
        >
          Cerrar
        </button>
      </div>

      <div className="space-y-4">
        {pedidos.map((pedido) => (
          <div key={pedido.id} className="border-2 border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-bold text-lg">Pedido #{pedido.id}</h4>
                <p className="text-sm text-gray-500">
                  {new Date(pedido.timestamp).toLocaleString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">
                  S/{" "}
                  {pedido.items
                    .reduce((sum, i) => sum + i.price * i.quantity, 0)
                    .toFixed(2)}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {pedido.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center bg-gray-50 rounded p-3"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {item.quantity}× {item.name}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          item.estado === "pendiente"
                            ? "bg-yellow-100 text-yellow-700"
                            : item.estado === "preparando"
                            ? "bg-blue-100 text-blue-700"
                            : item.estado === "listo"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {item.estado === "pendiente"
                          ? "⏳ Pendiente"
                          : item.estado === "preparando"
                          ? "👨‍🍳 Preparando"
                          : item.estado === "listo"
                          ? "✅ Listo"
                          : "🎉 Entregado"}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      S/ {item.price.toFixed(2)} c/u
                    </div>
                  </div>
                  <div className="text-right font-semibold">
                    S/ {(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminPage() {
  useRealtimeSync();
  const [isMounted, setIsMounted] = useState(false);
  const [selectedMesa, setSelectedMesa] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Evitar hydration error - no renderizar hasta que el componente esté montado
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            👨‍💼 <span>Panel de Administración</span>
          </h1>
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Cargando...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 flex items-center gap-3">
          👨‍💼 <span>Panel de Administración</span>
        </h1>

        <ResumenGeneral />
        <MesasActivas 
          onSelectMesa={setSelectedMesa} 
          selectedMesa={selectedMesa}
        />
        {selectedMesa && (
          <DetalleMesa 
            mesa={selectedMesa} 
            onClose={() => setSelectedMesa(null)}
          />
        )}
      </div>
    </div>
  );
}
