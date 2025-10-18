"use client";
import React, { useState, useEffect } from "react";
import { usePedidosStore } from "@/store/usePedidosStore";
import { usePagosStore } from "@/store/usePagosStore";
import { useUserStore } from "@/store/useUserStore";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";
import { Pedido } from "@/mock/pedidosData";
import { Pago } from "@/mock/pagosData";
import { useSesionesStore } from "@/store/useSesionesStore";
import ProtectedRoute from "@/components/ProtectedRoute";

// Modal de Pago
interface ModalPagoProps {
  pedidos: Pedido[];
  mesa: string;
  onClose: () => void;
  onSuccess: () => void;
}

function ModalPago({ pedidos, mesa, onClose, onSuccess }: ModalPagoProps) {
  const user = useUserStore((s) => s.user);
  const registrarPago = usePagosStore((s) => s.registrarPago);

  const [pagadoCon, setPagadoCon] = useState<string>("");
  const [metodoPago, setMetodoPago] = useState<
    "efectivo" | "tarjeta" | "transferencia"
  >("efectivo");
  const [isProcessing, setIsProcessing] = useState(false);

  // Calcular total de todos los pedidos de la mesa
  const allItems = pedidos.flatMap((p) => p.items);
  const total = allItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const vuelto = pagadoCon ? Math.max(0, parseFloat(pagadoCon) - total) : 0;
  const pagadoConNum = pagadoCon ? parseFloat(pagadoCon) : 0;
  const esPagoSuficiente = pagadoConNum >= total;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (metodoPago === "efectivo" && !esPagoSuficiente) {
      alert("El monto pagado es insuficiente");
      return;
    }

    setIsProcessing(true);
    try {
      // Si es tarjeta o transferencia, el monto pagado es exacto
      const montoPagado = metodoPago === "efectivo" ? pagadoConNum : total;

      await registrarPago({
        pedidoId: pedidos[0].firebaseId || pedidos[0].id.toString(),
        mesa,
        total,
        pagadoCon: montoPagado,
        metodoPago,
        cajero: user?.email || "unknown",
        items: allItems.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      const vueltoFinal = metodoPago === "efectivo" ? vuelto : 0;
      alert(
        `✅ Pago registrado exitosamente\n\n💰 Total: S/ ${total.toFixed(
          2
        )}\n💵 Pagado con: S/ ${montoPagado.toFixed(
          2
        )}\n🔄 Vuelto: S/ ${vueltoFinal.toFixed(2)}`
      );
      onSuccess();
      onClose();
    } catch (error: any) {
      alert(`Error al registrar pago: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

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
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl sm:text-3xl font-bold">💰 Cobrar Mesa</h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 w-8 h-8 rounded-full flex items-center justify-center text-2xl"
            >
              ×
            </button>
          </div>
          <p className="text-green-100 text-sm">Mesa {mesa}</p>
        </div>

        <div className="p-4 sm:p-6 border-b">
          <h3 className="font-semibold mb-3 text-gray-800">📋 Resumen</h3>
          <div className="space-y-2 mb-4">
            {allItems.map((item, idx) => (
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

        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              💳 Método de Pago
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMetodoPago("efectivo")}
                className={`p-3 rounded-lg border-2 transition-all text-xs sm:text-sm ${
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
                className={`p-3 rounded-lg border-2 transition-all text-xs sm:text-sm ${
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
                className={`p-3 rounded-lg border-2 transition-all text-xs sm:text-sm ${
                  metodoPago === "transferencia"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                📱 Transfer
              </button>
            </div>
          </div>

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
              {isProcessing ? "Procesando..." : "💰 Confirmar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Componente separado para el resumen general
function ResumenGeneral() {
  const pedidos = usePedidosStore((state) => state.pedidos);
  const pagos = usePagosStore((state) => state.pagos);
  const getTotalVentasDia = usePagosStore((s) => s.getTotalVentasDia);

  const totalItems = pedidos.reduce((sum, p) => sum + p.items.length, 0);
  const ventaPendiente = pedidos.reduce(
    (sum, p) => sum + p.items.reduce((s, i) => s + i.price * i.quantity, 0),
    0
  );

  const mesasMap = new Map<string, Pedido[]>();
  pedidos.forEach((pedido) => {
    const existing = mesasMap.get(pedido.mesa) || [];
    mesasMap.set(pedido.mesa, [...existing, pedido]);
  });

  const ventasDia = getTotalVentasDia();
  const transaccionesHoy = pagos.filter((p) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return new Date(p.timestamp) >= hoy;
  }).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
      <div className="bg-white rounded-lg shadow p-3 sm:p-4">
        <div className="text-xs sm:text-sm text-gray-600">Mesas Activas</div>
        <div className="text-2xl sm:text-3xl font-bold text-purple-600">
          {mesasMap.size}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-3 sm:p-4">
        <div className="text-xs sm:text-sm text-gray-600">Venta Pendiente</div>
        <div className="text-xl sm:text-2xl font-bold text-orange-600">
          S/ {ventaPendiente.toFixed(0)}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-3 sm:p-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
        <div className="text-xs sm:text-sm text-green-600 font-semibold">
          💰 Ventas Hoy
        </div>
        <div className="text-xl sm:text-2xl font-bold text-green-700">
          S/ {ventasDia.toFixed(0)}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-3 sm:p-4">
        <div className="text-xs sm:text-sm text-gray-600">🧾 Transacciones</div>
        <div className="text-2xl sm:text-3xl font-bold text-blue-600">
          {transaccionesHoy}
        </div>
      </div>
    </div>
  );
}

// Modal de Cierre de Caja
interface ModalCerrarCajaProps {
  pagos: Pago[];
  onClose: () => void;
  onConfirm: () => void;
}

function ModalCerrarCaja({ pagos, onClose, onConfirm }: ModalCerrarCajaProps) {
  const user = useUserStore((s) => s.user);
  const cerrarCaja = useSesionesStore((s) => s.cerrarCaja);
  const [isProcessing, setIsProcessing] = useState(false);

  const totalVentas = pagos.reduce((sum, p) => sum + p.total, 0);
  const totalTransacciones = pagos.length;

  const desglosePorMetodo = {
    efectivo: pagos
      .filter((p) => p.metodoPago === "efectivo")
      .reduce((sum, p) => sum + p.total, 0),
    tarjeta: pagos
      .filter((p) => p.metodoPago === "tarjeta")
      .reduce((sum, p) => sum + p.total, 0),
    transferencia: pagos
      .filter((p) => p.metodoPago === "transferencia")
      .reduce((sum, p) => sum + p.total, 0),
  };

  const handleCerrarCaja = async () => {
    console.log("🔍 Iniciando cierre de caja...");
    console.log("👤 Usuario:", user);
    console.log("💰 Total ventas:", totalVentas);
    console.log("🧾 Transacciones:", totalTransacciones);
    console.log("📦 Pagos:", pagos);

    if (!user) {
      alert("❌ Error: No hay usuario autenticado");
      console.error("❌ No hay usuario autenticado");
      return;
    }

    if (totalTransacciones === 0) {
      alert("❌ Error: No hay transacciones para cerrar");
      console.error("❌ No hay transacciones para cerrar");
      return;
    }

    const confirmacion = window.confirm(
      `⚠️ ADVERTENCIA: Cerrar Caja\n\n` +
        `Esta acción guardará la sesión actual y limpiará:\n` +
        `• Todos los pedidos pendientes\n` +
        `• Todos los pagos del día\n\n` +
        `Total a cerrar: S/ ${totalVentas.toFixed(2)}\n` +
        `Transacciones: ${totalTransacciones}\n\n` +
        `¿Estás seguro de continuar?`
    );

    if (!confirmacion) {
      console.log("❌ Usuario canceló el cierre");
      return;
    }

    console.log("✅ Usuario confirmó, procediendo a cerrar caja...");
    setIsProcessing(true);

    try {
      console.log("📤 Enviando datos a cerrarCaja...");
      await cerrarCaja(pagos, user.email);
      console.log("✅ Caja cerrada exitosamente");

      alert(
        `✅ Caja cerrada exitosamente\n\n💰 Total: S/ ${totalVentas.toFixed(
          2
        )}\n🧾 Transacciones: ${totalTransacciones}`
      );
      onConfirm();
      onClose();
    } catch (error: any) {
      console.error("❌ Error al cerrar caja:", error);
      alert(`❌ Error al cerrar caja: ${error.message || "Error desconocido"}`);
    } finally {
      setIsProcessing(false);
      console.log("🏁 Proceso finalizado");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl sm:text-3xl font-bold">🔒 Cerrar Caja</h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 w-8 h-8 rounded-full flex items-center justify-center text-2xl"
            >
              ×
            </button>
          </div>
          <p className="text-red-100 text-sm">Resumen del día</p>
        </div>

        <div className="p-4 sm:p-6">
          {/* Estadísticas Generales */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
              <div className="text-xs text-green-600 font-semibold mb-1">
                Total Ventas
              </div>
              <div className="text-2xl font-bold text-green-700">
                S/ {totalVentas.toFixed(2)}
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
              <div className="text-xs text-blue-600 font-semibold mb-1">
                Transacciones
              </div>
              <div className="text-2xl font-bold text-blue-700">
                {totalTransacciones}
              </div>
            </div>
          </div>

          {/* Desglose por Método de Pago */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-gray-800">
              💳 Desglose por Método
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  💵 Efectivo
                </span>
                <span className="font-bold text-green-700">
                  S/ {desglosePorMetodo.efectivo.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  💳 Tarjeta
                </span>
                <span className="font-bold text-blue-700">
                  S/ {desglosePorMetodo.tarjeta.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center bg-purple-50 p-3 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  📱 Transferencia
                </span>
                <span className="font-bold text-purple-700">
                  S/ {desglosePorMetodo.transferencia.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Advertencia */}
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div className="flex-1">
                <h4 className="font-bold text-yellow-900 mb-1">Atención</h4>
                <p className="text-sm text-yellow-800">
                  Al cerrar la caja se guardarán todos los datos en una sesión y
                  se limpiarán los pedidos y pagos actuales. Esta acción no se
                  puede deshacer.
                </p>
              </div>
            </div>
          </div>

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
              type="button"
              onClick={handleCerrarCaja}
              disabled={isProcessing || totalTransacciones === 0}
              className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
            >
              {isProcessing ? "Cerrando..." : "🔒 Cerrar Caja"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Modal de Detalle de Pago
interface ModalDetallePagoProps {
  pago: Pago;
  onClose: () => void;
}

function ModalDetallePago({ pago, onClose }: ModalDetallePagoProps) {
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl sm:text-3xl font-bold">
              🧾 Detalle de Pago
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 w-8 h-8 rounded-full flex items-center justify-center text-2xl"
            >
              ×
            </button>
          </div>
          <p className="text-purple-100 text-sm">
            {new Date(pago.timestamp).toLocaleString("es-ES", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div className="p-4 sm:p-6">
          {/* Información General */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-xs text-purple-600 font-semibold mb-1">
                Mesa
              </div>
              <div className="text-2xl font-bold text-purple-700">
                Mesa {pago.mesa}
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-xs text-blue-600 font-semibold mb-1">
                Método de Pago
              </div>
              <div className="text-sm font-bold text-blue-700">
                {pago.metodoPago === "efectivo"
                  ? "💵 Efectivo"
                  : pago.metodoPago === "tarjeta"
                  ? "💳 Tarjeta"
                  : "📱 Transferencia"}
              </div>
            </div>
          </div>

          {/* Items del Pedido */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-gray-800 flex items-center gap-2">
              <span>📋</span> Items del Pedido
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {pago.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center bg-gray-50 rounded-lg p-3"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">
                      {item.quantity}× {item.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      S/ {item.price.toFixed(2)} c/u
                    </div>
                  </div>
                  <div className="font-semibold text-gray-800">
                    S/ {(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detalle de Montos */}
          <div className="border-t pt-4 space-y-3">
            {/* Total a Pagar - DESTACADO */}
            <div className="flex justify-between items-center bg-gradient-to-r from-yellow-100 to-yellow-200 p-4 rounded-lg border-2 border-yellow-300 shadow-md">
              <span className="text-lg font-bold text-yellow-900">
                💳 Total a Pagar:
              </span>
              <span className="text-3xl font-extrabold text-yellow-900">
                S/ {pago.total.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg">
              <span className="font-semibold text-green-700">
                💵 Cliente pagó con:
              </span>
              <span className="text-xl font-bold text-green-700">
                S/ {pago.pagadoCon.toFixed(2)}
              </span>
            </div>

            {pago.vuelto > 0 && (
              <div className="flex justify-between items-center bg-orange-50 p-3 rounded-lg">
                <span className="font-semibold text-orange-700">
                  🔄 Vuelto entregado:
                </span>
                <span className="text-xl font-bold text-orange-700">
                  S/ {pago.vuelto.toFixed(2)}
                </span>
              </div>
            )}

            {pago.vuelto === 0 && pago.metodoPago !== "efectivo" && (
              <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg">
                <span className="text-sm text-blue-700">
                  ℹ️ Pago exacto - Sin vuelto
                </span>
              </div>
            )}
          </div>

          {/* Información del Cajero */}
          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Atendido por:</span>
              <span className="font-semibold text-gray-800">
                👤 {pago.cajero}
              </span>
            </div>
          </div>

          {/* Botón Cerrar */}
          <div className="mt-6">
            <button
              onClick={onClose}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente para historial de pagos
function HistorialPagos({ pagos }: { pagos: Pago[] }) {
  const [busqueda, setBusqueda] = useState("");
  const [pagoSeleccionado, setPagoSeleccionado] = useState<Pago | null>(null);

  const pagosFiltrados = pagos.filter((pago) => {
    const searchLower = busqueda.toLowerCase();
    return (
      pago.mesa.toLowerCase().includes(searchLower) ||
      pago.cajero.toLowerCase().includes(searchLower) ||
      pago.metodoPago.toLowerCase().includes(searchLower)
    );
  });

  const pagosOrdenados = [...pagosFiltrados].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">📋 Historial de Pagos</h2>
        <input
          type="text"
          placeholder="Buscar por mesa, cajero..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
        />
      </div>

      {pagosOrdenados.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No se encontraron pagos
        </p>
      ) : (
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Fecha/Hora
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Mesa
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden sm:table-cell">
                    Items
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden md:table-cell">
                    Método
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden lg:table-cell">
                    Cajero
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pagosOrdenados.map((pago) => (
                  <tr
                    key={pago.id}
                    onClick={() => setPagoSeleccionado(pago)}
                    className="hover:bg-purple-50 cursor-pointer transition-colors"
                  >
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                      {new Date(pago.timestamp).toLocaleString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <span className="text-xs sm:text-sm font-semibold text-purple-600">
                        Mesa {pago.mesa}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden sm:table-cell">
                      {pago.items.length} items
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-bold text-green-600">
                      S/ {pago.total.toFixed(2)}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          pago.metodoPago === "efectivo"
                            ? "bg-green-100 text-green-700"
                            : pago.metodoPago === "tarjeta"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {pago.metodoPago === "efectivo"
                          ? "💵 Efectivo"
                          : pago.metodoPago === "tarjeta"
                          ? "💳 Tarjeta"
                          : "📱 Transfer"}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden lg:table-cell">
                      {pago.cajero.split("@")[0]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de Detalle */}
      {pagoSeleccionado && (
        <ModalDetallePago
          pago={pagoSeleccionado}
          onClose={() => setPagoSeleccionado(null)}
        />
      )}
    </div>
  );
}

// Componente para una mesa individual
const MesaCard = React.memo(({ mesa, isSelected, onClick, onCobrar }: any) => {
  return (
    <div
      className={`border-2 rounded-lg transition-all hover:shadow-lg ${
        isSelected
          ? "border-purple-500 bg-purple-50"
          : "border-gray-200 hover:border-purple-300"
      }`}
    >
      <div onClick={onClick} className="p-4 cursor-pointer">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
              Mesa {mesa.mesa}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500">
              {mesa.totalPedidos} pedido{mesa.totalPedidos !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="text-right">
            <div className="text-base sm:text-lg font-bold text-green-600">
              S/ {mesa.totalVenta.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">{mesa.totalItems} items</div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-1 text-xs">
          {mesa.itemsPendientes > 0 && (
            <div className="bg-yellow-100 text-yellow-700 rounded px-1 sm:px-2 py-1 text-center">
              ⏳ {mesa.itemsPendientes}
            </div>
          )}
          {mesa.itemsPreparando > 0 && (
            <div className="bg-blue-100 text-blue-700 rounded px-1 sm:px-2 py-1 text-center">
              🔥 {mesa.itemsPreparando}
            </div>
          )}
          {mesa.itemsListos > 0 && (
            <div className="bg-green-100 text-green-700 rounded px-1 sm:px-2 py-1 text-center">
              ✅ {mesa.itemsListos}
            </div>
          )}
          {mesa.itemsEntregados > 0 && (
            <div className="bg-gray-100 text-gray-700 rounded px-1 sm:px-2 py-1 text-center">
              🎉 {mesa.itemsEntregados}
            </div>
          )}
        </div>
      </div>

      <div className="px-4 pb-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCobrar(mesa.mesa);
          }}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2 sm:py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg active:scale-95 text-sm sm:text-base"
        >
          💰 Cobrar Mesa
        </button>
      </div>
    </div>
  );
});

MesaCard.displayName = "MesaCard";

// Componente para lista de mesas
function MesasActivas({ onSelectMesa, selectedMesa, onCobrar }: any) {
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
        (sum, p) =>
          sum + p.items.filter((i) => i.estado === "pendiente").length,
        0
      ),
      itemsPreparando: pedidos.reduce(
        (sum, p) =>
          sum + p.items.filter((i) => i.estado === "preparando").length,
        0
      ),
      itemsListos: pedidos.reduce(
        (sum, p) => sum + p.items.filter((i) => i.estado === "listo").length,
        0
      ),
      itemsEntregados: pedidos.reduce(
        (sum, p) =>
          sum + p.items.filter((i) => i.estado === "entregado").length,
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
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-6">🏠 Mesas Activas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mesas.map((mesa) => (
          <MesaCard
            key={mesa.mesa}
            mesa={mesa}
            isSelected={selectedMesa === mesa.mesa}
            onClick={() => onSelectMesa(mesa.mesa)}
            onCobrar={onCobrar}
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
          <div
            key={pedido.id}
            className="border-2 border-gray-200 rounded-lg p-4"
          >
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

function AdminPageContent() {
  useRealtimeSync();
  const [isMounted, setIsMounted] = useState(false);
  const [selectedMesa, setSelectedMesa] = useState<string | null>(null);
  const [mesaACobrar, setMesaACobrar] = useState<string | null>(null);
  const [vistaActual, setVistaActual] = useState<"mesas" | "historial">(
    "mesas"
  );
  const [mostrarModalCerrarCaja, setMostrarModalCerrarCaja] = useState(false);

  const fetchPagos = usePagosStore((s) => s.fetchPagos);
  const pagos = usePagosStore((s) => s.pagos);
  const pedidos = usePedidosStore((s) => s.pedidos);

  useEffect(() => {
    setIsMounted(true);
    fetchPagos();
  }, [fetchPagos]);

  const handlePagoSuccess = () => {
    fetchPagos();
  };

  const handleCerrarCajaSuccess = () => {
    fetchPagos();
    setVistaActual("mesas");
  };

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
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-2">
              👨‍💼 <span>Panel de Administración</span>
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Gestiona pagos y cierra caja
            </p>
          </div>

          {/* Botón Cerrar Caja */}
          <button
            onClick={() => setMostrarModalCerrarCaja(true)}
            disabled={pagos.length === 0}
            className="inline-flex items-center gap-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all shadow-lg active:scale-95 transform shrink-0"
          >
            🔒 Cerrar Caja
          </button>
        </div>{" "}
        <ResumenGeneral />
        {/* Tabs de navegación */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setVistaActual("mesas")}
            className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all ${
              vistaActual === "mesas"
                ? "bg-purple-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            🏠 Mesas Activas
          </button>
          <button
            onClick={() => setVistaActual("historial")}
            className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all ${
              vistaActual === "historial"
                ? "bg-purple-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            � Historial de Pagos
          </button>
        </div>
        {vistaActual === "mesas" ? (
          <>
            <MesasActivas
              onSelectMesa={setSelectedMesa}
              selectedMesa={selectedMesa}
              onCobrar={setMesaACobrar}
            />
            {selectedMesa && (
              <DetalleMesa
                mesa={selectedMesa}
                onClose={() => setSelectedMesa(null)}
              />
            )}
          </>
        ) : (
          <HistorialPagos pagos={pagos} />
        )}
        {/* Modal de Pago */}
        {mesaACobrar && (
          <ModalPago
            pedidos={pedidos.filter((p) => p.mesa === mesaACobrar)}
            mesa={mesaACobrar}
            onClose={() => setMesaACobrar(null)}
            onSuccess={handlePagoSuccess}
          />
        )}
        {/* Modal de Cerrar Caja */}
        {mostrarModalCerrarCaja && (
          <ModalCerrarCaja
            pagos={pagos}
            onClose={() => setMostrarModalCerrarCaja(false)}
            onConfirm={handleCerrarCajaSuccess}
          />
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminPageContent />
    </ProtectedRoute>
  );
}
