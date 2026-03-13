"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2, Upload } from "lucide-react";
import { deleteMedia } from "@/actions/admin/media";
import { UploadModal } from "@/components/admin/UploadModal";
import type { MediaItem } from "@/types/cms";

interface MediaGridProps {
  initialItems: MediaItem[];
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaGrid({ initialItems }: MediaGridProps) {
  const [items, setItems] = useState<MediaItem[]>(initialItems);
  const [showUpload, setShowUpload] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta imagen?")) return;
    setDeleting(id);
    const result = await deleteMedia(id);
    if (result.success) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    } else {
      alert(result.error);
    }
    setDeleting(null);
  }

  function handleUploaded(item: MediaItem) {
    setItems((prev) => [item, ...prev]);
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <p className="text-white/40 text-sm">{items.length} archivo{items.length !== 1 ? "s" : ""}</p>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 bg-brand-teal text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-brand-teal/90 transition-colors"
        >
          <Upload className="w-4 h-4" />
          Subir imagen
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 text-white/30 text-sm">No hay archivos todavía.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map((item) => (
            <div key={item.id} className="group relative rounded-xl overflow-hidden bg-white/5 border border-white/10 aspect-square">
              <Image
                src={item.url}
                alt={item.alt || item.filename}
                fill
                className="object-cover"
                sizes="200px"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex items-end">
                <div className="p-2 w-full translate-y-full group-hover:translate-y-0 transition-transform">
                  <p className="text-white text-xs font-medium truncate mb-1">{item.filename}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-white/50 text-xs">{formatBytes(item.size)}</span>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deleting === item.id}
                      className="p-1 text-white/70 hover:text-red-400 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showUpload && (
        <UploadModal onClose={() => setShowUpload(false)} onUploaded={handleUploaded} />
      )}
    </>
  );
}
