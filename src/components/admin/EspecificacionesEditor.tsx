"use client";

import { Plus, Trash2 } from "lucide-react";

export type EspecificacionRow = { clave: string; valor: string };

interface EspecificacionesEditorProps {
  value: EspecificacionRow[];
  onChange: (rows: EspecificacionRow[]) => void;
}

export function EspecificacionesEditor({ value, onChange }: EspecificacionesEditorProps) {
  function add() {
    onChange([...value, { clave: "", valor: "" }]);
  }

  function update(index: number, field: keyof EspecificacionRow, text: string) {
    const next = value.map((r, i) => (i === index ? { ...r, [field]: text } : r));
    onChange(next);
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-2">
      {value.map((row, i) => (
        <div key={i} className="flex gap-2">
          <input
            type="text"
            value={row.clave}
            onChange={(e) => update(i, "clave", e.target.value)}
            placeholder="Clave"
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-teal"
          />
          <input
            type="text"
            value={row.valor}
            onChange={(e) => update(i, "valor", e.target.value)}
            placeholder="Valor"
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-teal"
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="p-2 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        Agregar especificación
      </button>
    </div>
  );
}
