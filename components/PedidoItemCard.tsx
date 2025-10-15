"use client";

import { PedidoItem } from "@/mock/pedidosData";

interface PedidoItemCardProps {
  pedidoId: number;
  mesa: string;
  item: PedidoItem;
  timestamp: string;
  onUpdateStatus: (
    pedidoId: number,
    itemId: number,
    estado: "pendiente" | "preparando" | "listo" | "entregado"
  ) => void;
}

export default function PedidoItemCard({
  pedidoId,
  mesa,
  item,
  timestamp,
  onUpdateStatus,
}: PedidoItemCardProps) {
  const handleConfirmEntrega = () => {
    if (
      confirm(`¿Confirmar que se entregó "${item.name}" a la Mesa ${mesa}?`)
    ) {
      onUpdateStatus(pedidoId, item.id, "entregado");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-warm-500 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-warm-600">
              Mesa {mesa}
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
          <p className="text-xs text-gray-500 mt-1">
            Pedido #{pedidoId} •{" "}
            {new Date(timestamp).toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg font-bold text-gray-800">
            {item.quantity}×
          </span>
          <span className="text-lg font-semibold text-gray-900">
            {item.name}
          </span>
        </div>
        <p className="text-sm text-gray-600">S/ {item.price.toFixed(2)} c/u</p>
      </div>

      <div className="flex gap-2">
        {item.estado === "pendiente" && (
          <button
            onClick={() => onUpdateStatus(pedidoId, item.id, "preparando")}
            className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition font-semibold"
          >
            🔥 Iniciar Preparación
          </button>
        )}

        {item.estado === "preparando" && (
          <button
            onClick={() => onUpdateStatus(pedidoId, item.id, "listo")}
            className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition font-semibold"
          >
            ✓ Marcar como Listo
          </button>
        )}

        {item.estado === "listo" && (
          <button
            onClick={handleConfirmEntrega}
            className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-semibold"
          >
            ✓ Pedido Entregado
          </button>
        )}
      </div>
    </div>
  );
}
