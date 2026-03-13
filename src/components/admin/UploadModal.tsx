"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { X, Upload } from "lucide-react";
import type { MediaItem } from "@/types/cms";

interface UploadModalProps {
  onClose: () => void;
  onUploaded: (item: MediaItem) => void;
}

export function UploadModal({ onClose, onUploaded }: UploadModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [alt, setAlt] = useState("");
  const [dimensions, setDimensions] = useState<{ w: number; h: number } | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setAlt(f.name.replace(/\.[^.]+$/, ""));
    const url = URL.createObjectURL(f);
    setPreview(url);
  }

  function handleImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    setDimensions({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight });
  }

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    setError("");

    const fd = new FormData();
    fd.append("file", file);
    fd.append("alt", alt);
    if (dimensions) {
      fd.append("width", String(dimensions.w));
      fd.append("height", String(dimensions.h));
    }

    const res = await fetch("/api/admin/media/upload", { method: "POST", body: fd });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError((body as { error?: string }).error ?? "Error al subir el archivo.");
      setUploading(false);
      return;
    }

    const item = (await res.json()) as MediaItem;
    onUploaded(item);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1e2330] rounded-xl w-full max-w-md border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h2 className="text-white font-semibold text-sm">Subir imagen</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-2.5 rounded-lg">
              {error}
            </div>
          )}

          <div
            onClick={() => inputRef.current?.click()}
            className="border-2 border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-brand-teal/40 transition-colors"
          >
            {preview ? (
              <div className="relative w-full aspect-video">
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-contain rounded-lg"
                  onLoad={handleImageLoad}
                  unoptimized
                />
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 text-white/20" />
                <p className="text-white/40 text-sm">Click para seleccionar imagen</p>
                <p className="text-white/20 text-xs">JPEG, PNG, WebP, SVG · Máx. 10 MB</p>
              </>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-white/60 text-xs font-medium">Texto alternativo (alt)</label>
            <input
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-teal"
              placeholder="Descripción de la imagen"
            />
          </div>
        </div>

        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="flex-1 bg-brand-teal text-white font-semibold py-2.5 rounded-lg text-sm hover:bg-brand-teal/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? "Subiendo..." : "Subir"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-white/5 text-white/60 font-semibold py-2.5 rounded-lg text-sm hover:bg-white/10 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
