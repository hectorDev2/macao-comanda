"use client";

import { usePedidosStore } from "@/store/usePedidosStore";
import { useState } from "react";

type EstadoType = "pendiente" | "preparando" | "listo" | null;

export default function PedidosStatusBar() {
  const { getItemsByEstado } = usePedidosStore();
  const [modalOpen, setModalOpen] = useState<EstadoType>(null);

  const itemsPendientes = getItemsByEstado("pendiente");
  const itemsPreparando = getItemsByEstado("preparando");
  const itemsListos = getItemsByEstado("listo");

  const handleCardClick = (estado: EstadoType) => {
    setModalOpen(estado);
  };

  const closeModal = () => {
    setModalOpen(null);
  };

  const getModalData = () => {
    switch (modalOpen) {
      case "pendiente":
        return {
          title: "⏳ Items Pendientes",
          items: itemsPendientes,
          color: "yellow",
        };
      case "preparando":
        return {
          title: "👨‍🍳 Items en Cocina",
          items: itemsPreparando,
          color: "blue",
        };
      case "listo":
        return {
          title: "✅ Items Listos",
          items: itemsListos,
          color: "green",
        };
      default:
        return null;
    }
  };

  const modalData = getModalData();

  return (
    <>
      <div className="card mb-4">
        <h3 className="text-sm font-semibold text-gray-600 mb-3">
          Estado de Pedidos en Tiempo Real
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => handleCardClick("pendiente")}
            className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200 hover:bg-yellow-100 hover:border-yellow-300 transition-all cursor-pointer active:scale-95"
          >
            <div className="text-2xl font-bold text-yellow-700">
              {itemsPendientes.length}
            </div>
            <div className="text-xs text-yellow-600 mt-1">Pendientes</div>
          </button>

          <button
            onClick={() => handleCardClick("preparando")}
            className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all cursor-pointer active:scale-95"
          >
            <div className="text-2xl font-bold text-blue-700">
              {itemsPreparando.length}
            </div>
            <div className="text-xs text-blue-600 mt-1">En Cocina</div>
          </button>

          <button
            onClick={() => handleCardClick("listo")}
            className="text-center p-3 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 hover:border-green-300 transition-all cursor-pointer active:scale-95"
          >
            <div className="text-2xl font-bold text-green-700">
              {itemsListos.length}
            </div>
            <div className="text-xs text-green-600 mt-1">Listos</div>
          </button>
        </div>
        <div className="mt-3 text-xs text-gray-500 flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Haz clic en cada categoría para ver detalles
        </div>
      </div>

      {/* Modal de Detalle */}
      {modalOpen && modalData && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden animate-[scaleIn_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className={`p-4 border-b-4 ${
                modalData.color === "yellow"
                  ? "bg-yellow-50 border-yellow-400"
                  : modalData.color === "blue"
                  ? "bg-blue-50 border-blue-400"
                  : "bg-green-50 border-green-400"
              }`}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  {modalData.title}
                  <span
                    className={`text-sm px-3 py-1 rounded-full ${
                      modalData.color === "yellow"
                        ? "bg-yellow-200 text-yellow-800"
                        : modalData.color === "blue"
                        ? "bg-blue-200 text-blue-800"
                        : "bg-green-200 text-green-800"
                    }`}
                  >
                    {modalData.items.length}
                  </span>
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
              {modalData.items.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No hay items en esta categoría
                </p>
              ) : (
                <div className="space-y-3">
                  {modalData.items.map(({ pedido, item }) => (
                    <div
                      key={`${pedido.id}-${item.id}`}
                      className="border-2 rounded-lg p-4 hover:border-warm-300 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl font-bold text-warm-600">
                            Mesa {pedido.mesa}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(pedido.timestamp).toLocaleTimeString(
                              "es-ES",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </div>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            modalData.color === "yellow"
                              ? "bg-yellow-100 text-yellow-800"
                              : modalData.color === "blue"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          Pedido #{pedido.id}
                        </div>
                      </div>

                      {/* Item individual */}
                      <div className="bg-gray-50 rounded p-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-gray-800">
                              {item.quantity}×
                            </span>
                            <span className="text-lg font-semibold">
                              {item.name}
                            </span>
                          </div>
                          <span className="text-gray-600 font-semibold">
                            S/ {(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          S/ {item.price.toFixed(2)} c/u
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
