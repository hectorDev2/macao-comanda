"use client";
import React from "react";
import { Pedido } from "@/mock/pedidosData";
import { usePedidosStore } from "@/store/usePedidosStore";

interface Props {
  pedido: Pedido;
}

const statusColors = {
  pendiente: "bg-yellow-100 text-yellow-800",
  preparando: "bg-blue-100 text-blue-800",
  listo: "bg-green-100 text-green-800",
  entregado: "bg-gray-100 text-gray-800",
};

const statusLabels = {
  pendiente: "⏳ Pendiente",
  preparando: "👨‍🍳 Preparando",
  listo: "✅ Listo",
  entregado: "🎉 Entregado",
};

export default function PedidoCard({ pedido }: Props) {
  const { updateItemStatus } = usePedidosStore();

  // Calcular el estado general del pedido basado en los items
  const allEntregados = pedido.items.every((i) => i.estado === "entregado");
  const allListos = pedido.items.every(
    (i) => i.estado === "listo" || i.estado === "entregado"
  );
  const somePreparando = pedido.items.some((i) => i.estado === "preparando");

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold">Mesa {pedido.mesa}</h3>
          <p className="text-xs text-gray-500">
            {new Date(pedido.timestamp).toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
          Pedido #{pedido.id}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        {pedido.items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center text-sm border-l-2 pl-2 py-1"
            style={{
              borderColor:
                item.estado === "listo"
                  ? "#10b981"
                  : item.estado === "preparando"
                  ? "#3b82f6"
                  : item.estado === "entregado"
                  ? "#6b7280"
                  : "#f59e0b",
            }}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {item.quantity}x {item.name}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    statusColors[item.estado]
                  }`}
                >
                  {statusLabels[item.estado]}
                </span>
              </div>
            </div>
            <span className="text-gray-600 ml-2">
              S/ {(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t pt-3">
        <div className="flex justify-between mb-3">
          <span className="font-semibold">Total:</span>
          <span className="font-semibold text-warm-600">
            S/{" "}
            {pedido.items
              .reduce((sum, i) => sum + i.price * i.quantity, 0)
              .toFixed(2)}
          </span>
        </div>

        {allEntregados ? (
          <div className="text-center py-2 text-green-600 font-medium text-sm">
            ✓ Pedido completamente entregado
          </div>
        ) : (
          <div className="text-xs text-gray-500 text-center">
            {allListos
              ? "Todos los items están listos"
              : somePreparando
              ? "Items en preparación"
              : "Esperando preparación"}
          </div>
        )}
      </div>
    </div>
  );
}
