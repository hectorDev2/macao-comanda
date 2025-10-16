"use client";
import React, { useState, useEffect } from "react";
import { usePedidosStore } from "@/store/usePedidosStore";
import { usePagosStore } from "@/store/usePagosStore";
import { useUserStore } from "@/store/useUserStore";
import { Pedido } from "@/mock/pedidosData";

interface ModalPagoProps {
  pedido: Pedido;
  onClose: () => void;
  onSuccess: () => void;
}

function ModalPago({ pedido, onClose, onSuccess }: ModalPagoProps) {
  const user = useUserStore((s) => s.user);
  const registrarPago = usePagosStore((s) => s.registrarPago);

  const [pagadoCon, setPagadoCon] = useState<string>("");
  const [metodoPago, setMetodoPago] = useState<
    "efectivo" | "tarjeta" | "transferencia"
  >("efectivo");
  const [isProcessing, setIsProcessing] = useState(false);

  // Calcular total del pedido
  const total = pedido.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const vuelto = pagadoCon ? Math.max(0, parseFloat(pagadoCon) - total) : 0;
  const pagadoConNum = pagadoCon ? parseFloat(pagadoCon) : 0;
  const esPagoSuficiente = pagadoConNum >= total;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!esPagoSuficiente) {
      alert("El monto pagado es insuficiente");
      return;
    }

    setIsProcessing(true);
    try {
      await registrarPago({
        pedidoId: pedido.firebaseId || pedido.id.toString(),
        mesa: pedido.mesa,
        total,
        pagadoCon: pagadoConNum,
        metodoPago,
        cajero: user?.email || "unknown",
        items: pedido.items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      alert(
        `✅ Pago registrado exitosamente\n\n💰 Total: S/ ${total.toFixed(
          2
        )}\n💵 Pagado con: S/ ${pagadoConNum.toFixed(
          2
        )}\n🔄 Vuelto: S/ ${vuelto.toFixed(2)}`
      );
      onSuccess();
      onClose();
    } catch (error: any) {
      alert(`Error al registrar pago: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Atajos rápidos
  const sugerencias = [50, 100, 200];

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl sm:text-3xl font-bold">💰 Caja</h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 w-8 h-8 rounded-full flex items-center justify-center text-2xl"
            >
              ×
            </button>
          </div>
          <p className="text-green-100 text-sm">Mesa {pedido.mesa}</p>
        </div>

        {/* Resumen del pedido */}
        <div className="p-4 sm:p-6 border-b">
          <h3 className="font-semibold mb-3 text-gray-800">
            📋 Resumen del Pedido
          </h3>
          <div className="space-y-2 mb-4">
            {pedido.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {item.quantity}× {item.name}
                </span>
                <span className="font-semibold">
                  S/ {(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 flex justify-between items-center">
            <span className="text-lg font-bold text-gray-800">Total:</span>
            <span className="text-2xl font-bold text-green-600">
              S/ {total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Formulario de pago */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
          {/* Método de pago */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              💳 Método de Pago
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMetodoPago("efectivo")}
                className={`p-3 rounded-lg border-2 transition-all ${
                  metodoPago === "efectivo"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                💵 Efectivo
              </button>
              <button
                type="button"
                onClick={() => setMetodoPago("tarjeta")}
                className={`p-3 rounded-lg border-2 transition-all ${
                  metodoPago === "tarjeta"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                💳 Tarjeta
              </button>
              <button
                type="button"
                onClick={() => setMetodoPago("transferencia")}
                className={`p-3 rounded-lg border-2 transition-all ${
                  metodoPago === "transferencia"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                📱 Transfer
              </button>
            </div>
          </div>

          {/* Monto pagado */}
          {metodoPago === "efectivo" && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  💵 Cliente paga con:
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={pagadoCon}
                  onChange={(e) => setPagadoCon(e.target.value)}
                  className={`w-full border-2 rounded-lg px-4 py-3 text-lg font-semibold focus:outline-none transition-colors ${
                    pagadoCon && !esPagoSuficiente
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 focus:border-green-500"
                  }`}
                  placeholder="0.00"
                  required
                  autoFocus
                />
                {pagadoCon && !esPagoSuficiente && (
                  <p className="text-red-600 text-xs mt-1">
                    ⚠️ Monto insuficiente (falta S/{" "}
                    {(total - pagadoConNum).toFixed(2)})
                  </p>
                )}
              </div>

              {/* Sugerencias rápidas */}
              <div className="mb-4">
                <label className="block text-xs text-gray-500 mb-2">
                  Sugerencias rápidas:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {sugerencias.map((monto) => (
                    <button
                      key={monto}
                      type="button"
                      onClick={() => setPagadoCon(monto.toString())}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-semibold transition-colors"
                    >
                      S/ {monto}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vuelto */}
              {pagadoCon && esPagoSuficiente && (
                <div className="mb-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-700">
                      🔄 Vuelto a entregar:
                    </span>
                    <span className="text-2xl font-bold text-orange-600">
                      S/ {vuelto.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Si es tarjeta o transferencia, no necesita vuelto */}
          {(metodoPago === "tarjeta" || metodoPago === "transferencia") && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
              <p className="text-sm text-blue-700">
                ℹ️{" "}
                {metodoPago === "tarjeta"
                  ? "Pago con tarjeta"
                  : "Pago por transferencia"}{" "}
                - Monto exacto:{" "}
                <span className="font-bold">S/ {total.toFixed(2)}</span>
              </p>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold transition-colors"
              disabled={isProcessing}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={
                isProcessing ||
                (metodoPago === "efectivo" && (!pagadoCon || !esPagoSuficiente))
              }
              className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
            >
              {isProcessing ? "Procesando..." : "💰 Confirmar Pago"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CajaPage() {
  const pedidos = usePedidosStore((s) => s.pedidos);
  const pagos = usePagosStore((s) => s.pagos);
  const fetchPagos = usePagosStore((s) => s.fetchPagos);
  const getTotalVentasDia = usePagosStore((s) => s.getTotalVentasDia);
  const getTotalVentasMes = usePagosStore((s) => s.getTotalVentasMes);

  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchPagos();
  }, [fetchPagos]);

  // Agrupar pedidos por mesa
  const pedidosPorMesa = pedidos.reduce((acc, pedido) => {
    if (!acc[pedido.mesa]) {
      acc[pedido.mesa] = [];
    }
    acc[pedido.mesa].push(pedido);
    return acc;
  }, {} as Record<string, Pedido[]>);

  const calcularTotalMesa = (pedidosMesa: Pedido[]) => {
    return pedidosMesa.reduce((total, pedido) => {
      return (
        total +
        pedido.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      );
    }, 0);
  };

  if (!isMounted) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Cargando...</div>
      </div>
    );
  }

  const ventasDia = getTotalVentasDia();
  const ventasMes = getTotalVentasMes();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
        💰 Sistema de Caja
      </h1>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
          <div className="text-sm text-green-600 font-semibold mb-1">
            📊 Ventas Hoy
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-green-700">
            S/ {ventasDia.toFixed(2)}
          </div>
        </div>

        <div className="card bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
          <div className="text-sm text-blue-600 font-semibold mb-1">
            📅 Ventas Mes
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-blue-700">
            S/ {ventasMes.toFixed(2)}
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
          <div className="text-sm text-purple-600 font-semibold mb-1">
            🧾 Transacciones Hoy
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-purple-700">
            {
              pagos.filter((p) => {
                const hoy = new Date();
                hoy.setHours(0, 0, 0, 0);
                return new Date(p.timestamp) >= hoy;
              }).length
            }
          </div>
        </div>
      </div>

      {/* Mesas con cuenta pendiente */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          🍽️ Mesas con Cuenta Pendiente
        </h2>

        {Object.keys(pedidosPorMesa).length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-2">✅</div>
            <p>No hay cuentas pendientes</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(pedidosPorMesa).map(([mesa, pedidosMesa]) => {
              const total = calcularTotalMesa(pedidosMesa);
              const itemsCount = pedidosMesa.reduce(
                (sum, p) => sum + p.items.length,
                0
              );

              return (
                <div
                  key={mesa}
                  className="border-2 border-warm-200 rounded-xl p-4 hover:border-warm-400 transition-all bg-gradient-to-br from-white to-warm-50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-warm-700">
                        Mesa {mesa}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {itemsCount} item{itemsCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Total</div>
                      <div className="text-2xl font-bold text-green-600">
                        S/ {total.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedPedido(pedidosMesa[0])}
                    className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white py-3 rounded-lg font-semibold transition-colors active:scale-95 transform"
                  >
                    💳 Cobrar Mesa
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Historial reciente */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          📜 Historial de Pagos (Hoy)
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b-2">
              <tr>
                <th className="text-left p-3 font-semibold">Hora</th>
                <th className="text-left p-3 font-semibold">Mesa</th>
                <th className="text-left p-3 font-semibold">Total</th>
                <th className="text-left p-3 font-semibold">Método</th>
                <th className="text-left p-3 font-semibold">Cajero</th>
              </tr>
            </thead>
            <tbody>
              {pagos
                .filter((p) => {
                  const hoy = new Date();
                  hoy.setHours(0, 0, 0, 0);
                  return new Date(p.timestamp) >= hoy;
                })
                .slice(0, 10)
                .map((pago) => (
                  <tr key={pago.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      {new Date(pago.timestamp).toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="p-3 font-semibold">Mesa {pago.mesa}</td>
                    <td className="p-3 font-bold text-green-600">
                      S/ {pago.total.toFixed(2)}
                    </td>
                    <td className="p-3">
                      {pago.metodoPago === "efectivo"
                        ? "💵 Efectivo"
                        : pago.metodoPago === "tarjeta"
                        ? "💳 Tarjeta"
                        : "📱 Transfer"}
                    </td>
                    <td className="p-3 text-xs text-gray-600 truncate max-w-[150px]">
                      {pago.cajero}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {pagos.filter((p) => {
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            return new Date(p.timestamp) >= hoy;
          }).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No hay transacciones hoy
            </div>
          )}
        </div>
      </div>

      {/* Modal de pago */}
      {selectedPedido && (
        <ModalPago
          pedido={selectedPedido}
          onClose={() => setSelectedPedido(null)}
          onSuccess={() => {
            fetchPagos();
          }}
        />
      )}
    </div>
  );
}
