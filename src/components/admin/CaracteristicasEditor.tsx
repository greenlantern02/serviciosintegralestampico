"use client";

import { Plus, Trash2 } from "lucide-react";

export type CaracteristicaRow = { texto: string };

interface CaracteristicasEditorProps {
  value: CaracteristicaRow[];
  onChange: (rows: CaracteristicaRow[]) => void;
}

export function CaracteristicasEditor({ value, onChange }: CaracteristicasEditorProps) {
  function add() {
    onChange([...value, { texto: "" }]);
  }

  function update(index: number, text: string) {
    onChange(value.map((r, i) => (i === index ? { texto: text } : r)));
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
            value={row.texto}
            onChange={(e) => update(i, e.target.value)}
            placeholder="Característica del producto..."
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
        Agregar característica
      </button>
    </div>
  );
}
