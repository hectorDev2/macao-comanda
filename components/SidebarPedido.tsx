"use client";
import React from "react";
import { usePedidosStore } from "@/store/usePedidosStore";

export default function SidebarPedido() {
  const currentCart = usePedidosStore((s) => s.currentCart);
  const removeFromCart = usePedidosStore((s) => s.removeFromCart);
  const submitOrder = usePedidosStore((s) => s.submitOrder);
  const [mesa, setMesa] = React.useState("");
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const total = currentCart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  function handleSubmit() {
    if (!mesa.trim()) return alert("Ingresa el número de mesa");
    submitOrder(mesa);
    setMesa("");
    setShowSuccess(true);
    setIsOpen(false);
    setTimeout(() => setShowSuccess(false), 3000);
  }

  const cartItemsCount = currentCart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* Botón flotante en móviles */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-4 right-4 z-40 w-16 h-16 bg-warm-500 hover:bg-warm-600 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-95 transform transition-all"
      >
        <div className="relative">
          <span className="text-2xl">🛒</span>
          {cartItemsCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cartItemsCount}
            </span>
          )}
        </div>
      </button>

      {/* Overlay en móviles */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static bottom-0 left-0 right-0 lg:w-80 
        bg-white rounded-t-2xl lg:rounded-xl
        shadow-2xl lg:shadow-lg
        z-50 lg:z-auto
        transform transition-transition-transform duration-300
        ${isOpen ? "translate-y-0" : "translate-y-full lg:translate-y-0"}
        lg:sticky lg:top-20 lg:self-start
        max-h-[85vh] lg:max-h-[calc(100vh-100px)]
        overflow-hidden flex flex-col
      `}
      >
        {/* Header móvil */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Pedido Actual</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 text-2xl w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>

        {/* Contenido */}
        <div className="p-4 lg:p-6 overflow-y-auto flex-1">
          <h2 className="hidden lg:block text-xl font-semibold mb-4">Pedido Actual</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Mesa #</label>
            <input
              type="text"
              value={mesa}
              onChange={(e) => setMesa(e.target.value)}
              className="w-full border-2 rounded-lg px-3 py-3 text-base focus:border-warm-500 focus:outline-none"
              placeholder="Ej: 5"
            />
          </div>

          {currentCart.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay items</p>
          ) : (
            <>
              <div className="space-y-2 mb-4 max-h-[40vh] lg:max-h-60 overflow-y-auto">
                {currentCart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{item.name}</div>
                      <div className="text-sm text-gray-600">
                        S/ {item.price.toFixed(2)} x {item.quantity}
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-700 ml-2 text-xl w-8 h-8 flex items-center justify-center shrink-0"
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
                className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white py-4 rounded-lg font-semibold text-lg transition-colors active:scale-95 transform"
              >
                Enviar Pedido
              </button>

              {showSuccess && (
                <div className="mt-3 p-3 bg-green-100 text-green-700 rounded-lg text-center font-medium">
                  ✓ Pedido enviado correctamente
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
