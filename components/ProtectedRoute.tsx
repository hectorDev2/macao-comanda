"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  allowedRoles?: Array<"mesero" | "cocina" | "admin">;
}

export default function ProtectedRoute({
  children,
  requiredPermission,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, loading, hasPermission } = useUserStore();

  useEffect(() => {
    // Esperar a que termine de cargar
    if (loading) return;

    // Si no hay usuario, redirigir al login
    if (!user) {
      console.log("🚫 No autenticado, redirigiendo al login");
      router.push("/");
      return;
    }

    // Verificar permiso específico si se proporciona
    if (requiredPermission && !hasPermission(requiredPermission)) {
      console.log(`🚫 Sin permiso: ${requiredPermission}`);
      router.push("/unauthorized");
      return;
    }

    // Verificar roles permitidos si se proporcionan
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      console.log(`🚫 Rol no permitido: ${user.role}`);
      router.push("/unauthorized");
      return;
    }

    console.log(`✅ Acceso permitido para ${user.email} (${user.role})`);
  }, [user, loading, requiredPermission, allowedRoles, router, hasPermission]);

  // Mostrar loading mientras se verifica
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-warm-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario, no mostrar nada (mientras redirige)
  if (!user) {
    return null;
  }

  // Verificar permisos antes de renderizar
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
