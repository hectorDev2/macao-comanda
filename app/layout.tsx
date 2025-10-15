import "./globals.css";
import React from "react";
import Navbar from "@/components/Navbar";
import NotificationCenter from "@/components/NotificationCenter";

export const metadata = {
  title: "Sistema de Comanda Digital",
  description: "Prototipo de comanda digital con Next.js, Tailwind y Zustand",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        <NotificationCenter />
        <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
