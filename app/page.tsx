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
    <div className="max-w-md mx-auto mt-8 card">
      <h1 className="text-2xl font-semibold mb-4">Iniciar sesión</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          className="border p-2 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-warm-500 text-white py-2 rounded">Entrar</button>
        {error && <div className="text-red-500">{error}</div>}
      </form>
      <div className="mt-4 text-sm text-gray-600">
        Usuarios de prueba: mesero@local.com / cocina@local.com /
        admin@local.com (password 1234)
      </div>
    </div>
  );
}
