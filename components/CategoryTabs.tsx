"use client";
import React from "react";

interface Props {
  categories: string[];
  active: string;
  onSelect: (category: string) => void;
}

export default function CategoryTabs({ categories, active, onSelect }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0 scrollbar-hide">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg whitespace-nowrap transition-all font-medium text-sm sm:text-base active:scale-95 transform ${
            active === cat
              ? "bg-warm-500 text-white shadow-md"
              : "bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-700 shadow"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
