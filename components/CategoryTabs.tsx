"use client";
import React from "react";

interface Props {
  categories: string[];
  active: string;
  onSelect: (category: string) => void;
}

export default function CategoryTabs({ categories, active, onSelect }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
            active === cat
              ? "bg-warm-500 text-white"
              : "bg-white hover:bg-gray-50 text-gray-700"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
