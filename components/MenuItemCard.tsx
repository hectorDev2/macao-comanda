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
    <div className="card hover:shadow-md transition-shadow">
      <div className="relative h-40 mb-3 rounded-lg overflow-hidden bg-gray-100">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-warm-600 font-semibold text-lg">
          S/ {item.price}
        </span>
        <button
          onClick={() =>
            addToCart({ id: item.id, name: item.name, price: item.price })
          }
          className="bg-warm-500 hover:bg-warm-600 text-white px-4 py-2 rounded transition-colors"
        >
          Agregar
        </button>
      </div>
    </div>
  );
}
