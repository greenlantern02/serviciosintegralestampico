"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Trash2 } from "lucide-react";
import { UploadModal } from "@/components/admin/UploadModal";
import type { MediaItem } from "@/types/cms";

export type ImagenRow = { mediaId: string; url: string; alt: string };

interface ImageUploaderProps {
  value: ImagenRow[];
  onChange: (rows: ImagenRow[]) => void;
}

export function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const [showModal, setShowModal] = useState(false);

  function handleUploaded(item: MediaItem) {
    onChange([...value, { mediaId: item.id, url: item.url, alt: item.alt }]);
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {value.map((img, i) => (
          <div key={img.mediaId} className="relative w-24 h-24 rounded-lg overflow-hidden group border border-white/10">
            <Image src={img.url} alt={img.alt || "imagen"} fill className="object-cover" sizes="96px" unoptimized />
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute inset-0 bg-black/0 group-hover:bg-black/50 flex items-center justify-center transition-colors"
            >
              <Trash2 className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        ))}

        {value.length < 10 && (
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="w-24 h-24 rounded-lg border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-1 hover:border-brand-teal/40 transition-colors text-white/30 hover:text-white/60"
          >
            <Plus className="w-5 h-5" />
            <span className="text-xs">Agregar</span>
          </button>
        )}
      </div>

      {showModal && (
        <UploadModal onClose={() => setShowModal(false)} onUploaded={handleUploaded} />
      )}
    </div>
  );
}
