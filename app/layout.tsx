import "./globals.css";
import React from "react";
import Navbar from "@/components/Navbar";
import NotificationCenter from "@/components/NotificationCenter";

export const metadata = {
  title: "Sistema de Comanda Digital",
  description:
    "Sistema de comanda digital en la nube con Firebase y tiempo real",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  themeColor: "#f97316",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body>
        <Navbar />
        <NotificationCenter />
        <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pt-[72px]">
          {children}
        </main>
      </body>
    </html>
  );
}
