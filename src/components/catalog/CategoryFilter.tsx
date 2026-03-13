"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Categoria } from "@/types/cms";

interface CategoryFilterProps {
  categorias: Categoria[];
  activa?: string;
}

export function CategoryFilter({ categorias, activa }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setCategory(slug: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set("categoria", slug);
    } else {
      params.delete("categoria");
    }
    router.push(`/productos?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => setCategory(null)}
        className={cn(
          "px-4 py-2 rounded-full text-sm font-semibold transition-colors border-2",
          !activa
            ? "bg-brand-navy text-white border-brand-navy"
            : "bg-transparent text-brand-navy border-brand-navy/20 hover:border-brand-navy"
        )}
      >
        Todos
      </button>
      {categorias.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setCategory(cat.slug)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-semibold transition-colors border-2",
            activa === cat.slug
              ? "bg-brand-teal text-white border-brand-teal"
              : "bg-transparent text-brand-teal border-brand-teal/30 hover:border-brand-teal"
          )}
        >
          {cat.nombre}
        </button>
      ))}
    </div>
  );
}
