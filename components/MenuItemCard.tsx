"use client";
import React from "react";
import { usePedidosStore } from "@/store/usePedidosStore";
import { MenuItem } from "@/mock/menuData";
import Image from "next/image";

interface Props {
  item: MenuItem;
}

export default function MenuItemCard({ item }: Props) {
  const addToCart = usePedidosStore((s) => s.addToCart);

  return (
    <div className="card hover:shadow-md transition-shadow active:scale-[0.98] transform">
      <div className="relative h-36 sm:h-40 mb-3 rounded-lg overflow-hidden bg-gray-100">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={false}
        />
      </div>
      <h3 className="font-semibold text-base sm:text-lg mb-1 truncate">
        {item.name}
      </h3>
      <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">
        {item.description}
      </p>
      <div className="flex justify-between items-center gap-2">
        <span className="text-warm-600 font-bold text-lg sm:text-xl whitespace-nowrap">
          S/ {item.price.toFixed(2)}
        </span>
        <button
          onClick={() =>
            addToCart({ id: item.id, name: item.name, price: item.price })
          }
          className="bg-warm-500 hover:bg-warm-600 active:bg-warm-700 text-white px-4 py-2.5 rounded-lg transition-colors font-semibold text-sm active:scale-95 transform"
        >
          Agregar
        </button>
      </div>
    </div>
  );
}
