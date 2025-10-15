"use client";
import React from "react";
import { usersMock } from "@/mock/users";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

export default function LoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const router = useRouter();
  const setUser = useUserStore((s) => s.setUser);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found = usersMock.find(
      (u) => u.email === email && u.password === password
    );
    if (!found) return setError("Credenciales inválidas");
    setUser({ email: found.email, role: found.role });
    if (found.role === "mesero") router.push("/dashboard/mesero");
    if (found.role === "cocina") router.push("/dashboard/cocina");
    if (found.role === "admin") router.push("/dashboard/admin");
  }

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md card">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-center">
          Iniciar sesión
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            className="border-2 p-3 sm:p-4 rounded-lg text-base focus:border-warm-500 focus:outline-none transition-colors"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="border-2 p-3 sm:p-4 rounded-lg text-base focus:border-warm-500 focus:outline-none transition-colors"
            placeholder="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="bg-warm-500 hover:bg-warm-600 text-white py-3 sm:py-4 rounded-lg font-semibold text-lg transition-colors active:scale-95 transform">
            Entrar
          </button>
          {error && (
            <div className="text-red-600 bg-red-50 p-3 rounded-lg text-center font-medium">
              {error}
            </div>
          )}
        </form>
        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
          <p className="font-semibold mb-2">Usuarios de prueba:</p>
          <ul className="space-y-1 text-xs sm:text-sm">
            <li>• mesero@local.com</li>
            <li>• cocina@local.com</li>
            <li>• admin@local.com</li>
            <li className="text-gray-500 mt-2">Password: 1234</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
