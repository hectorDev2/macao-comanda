"use client";
import React from "react";
import { usePedidosStore } from "@/store/usePedidosStore";

export default function SidebarPedido() {
  const currentCart = usePedidosStore((s) => s.currentCart);
  const removeFromCart = usePedidosStore((s) => s.removeFromCart);
  const submitOrder = usePedidosStore((s) => s.submitOrder);
  const [mesa, setMesa] = React.useState("");
  const [showSuccess, setShowSuccess] = React.useState(false);

  const total = currentCart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  function handleSubmit() {
    if (!mesa.trim()) return alert("Ingresa el número de mesa");
    submitOrder(mesa);
    setMesa("");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  }

  return (
    <div className="w-80 card sticky top-20 self-start">
      <h2 className="text-xl font-semibold mb-4">Pedido Actual</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Mesa #</label>
        <input
          type="text"
          value={mesa}
          onChange={(e) => setMesa(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Ej: 5"
        />
      </div>

      {currentCart.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No hay items</p>
      ) : (
        <>
          <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
            {currentCart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-2 bg-gray-50 rounded"
              >
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-600">
                    S/ {item.price} x {item.quantity}
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-600 hover:text-red-700 ml-2"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="border-t pt-3 mb-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span className="text-warm-600">S/ {total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            Enviar Pedido
          </button>

          {showSuccess && (
            <div className="mt-3 p-2 bg-green-100 text-green-700 rounded text-center text-sm">
              ✓ Pedido enviado correctamente
            </div>
          )}
        </>
      )}
    </div>
  );
}
