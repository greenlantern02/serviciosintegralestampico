"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/slugify";
import { createCategoria, updateCategoria } from "@/actions/admin/categorias";
import type { Categoria, CategoriaColor } from "@/types/cms";

const COLORS: { value: CategoriaColor; label: string; cls: string }[] = [
  { value: "teal", label: "Teal", cls: "bg-teal-500" },
  { value: "navy", label: "Navy", cls: "bg-blue-900" },
  { value: "orange", label: "Naranja", cls: "bg-orange-500" },
  { value: "coral", label: "Coral", cls: "bg-red-400" },
];

const ICONOS = [
  "hard-hat", "footprints", "chef-hat", "sparkles",
  "package", "shopping-bag", "shield",
];

interface CategoriaFormProps {
  categoria?: Categoria;
}

export function CategoriaForm({ categoria }: CategoriaFormProps) {
  const router = useRouter();
  const [nombre, setNombre] = useState(categoria?.nombre ?? "");
  const [slug, setSlug] = useState(categoria?.slug ?? "");
  const [descripcion, setDescripcion] = useState(categoria?.descripcion ?? "");
  const [color, setColor] = useState<CategoriaColor>(categoria?.color ?? "teal");
  const [icono, setIcono] = useState(categoria?.icono ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function handleNombreChange(value: string) {
    setNombre(value);
    if (!categoria) setSlug(slugify(value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim()) { setError("El nombre es requerido."); return; }
    setSaving(true);
    setError("");

    const form = { nombre, slug: slug || slugify(nombre), descripcion, color, icono };
    const result = categoria
      ? await updateCategoria(categoria.id, form)
      : await createCategoria(form);

    if (!result.success) {
      setError(result.error);
      setSaving(false);
      return;
    }
    router.push("/admin/categorias");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-white/70 text-sm font-medium">Nombre *</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => handleNombreChange(e.target.value)}
          required
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-teal"
          placeholder="EPP y Seguridad"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-white/70 text-sm font-medium">Slug</label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white/70 text-sm focus:outline-none focus:border-brand-teal font-mono"
          placeholder="epp-y-seguridad"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-white/70 text-sm font-medium">Descripción</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-teal resize-none"
          placeholder="Equipos de protección personal..."
        />
      </div>

      <div className="space-y-2">
        <label className="text-white/70 text-sm font-medium">Color</label>
        <div className="flex gap-3">
          {COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setColor(c.value)}
              className={`w-8 h-8 rounded-full ${c.cls} ring-2 ring-offset-2 ring-offset-[#181c24] transition-all ${
                color === c.value ? "ring-white" : "ring-transparent"
              }`}
              title={c.label}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-white/70 text-sm font-medium">Ícono</label>
        <div className="flex flex-wrap gap-2">
          {ICONOS.map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIcono(i === icono ? "" : i)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                icono === i
                  ? "bg-brand-teal text-white"
                  : "bg-white/5 text-white/50 hover:bg-white/10"
              }`}
            >
              {i}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-brand-teal text-white font-semibold px-6 py-2.5 rounded-lg text-sm hover:bg-brand-teal/90 transition-colors disabled:opacity-50"
        >
          {saving ? "Guardando..." : categoria ? "Guardar cambios" : "Crear categoría"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/categorias")}
          className="bg-white/5 text-white/60 font-semibold px-6 py-2.5 rounded-lg text-sm hover:bg-white/10 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
