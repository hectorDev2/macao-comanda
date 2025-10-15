"use client";

import { usePedidosStore } from "@/store/usePedidosStore";
import { useEffect } from "react";

export default function NotificationCenter() {
  const notifications = usePedidosStore((s) => s.notifications);
  const clearNotification = usePedidosStore((s) => s.clearNotification);

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`
            p-4 rounded-lg shadow-lg backdrop-blur-sm border-l-4 
            animate-slide-in-right transform transition-all duration-300
            ${
              notif.type === "success"
                ? "bg-green-50/95 border-green-500 text-green-800"
                : ""
            }
            ${
              notif.type === "info"
                ? "bg-blue-50/95 border-blue-500 text-blue-800"
                : ""
            }
            ${
              notif.type === "warning"
                ? "bg-yellow-50/95 border-yellow-500 text-yellow-800"
                : ""
            }
          `}
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium">{notif.message}</p>
            <button
              onClick={() => clearNotification(notif.id)}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0"
            >
              ✕
            </button>
          </div>
          <p className="text-xs opacity-70 mt-1">
            {new Date(notif.timestamp).toLocaleTimeString("es-ES")}
          </p>
        </div>
      ))}
    </div>
  );
}
