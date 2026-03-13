"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/slugify";
import { createProducto, updateProducto } from "@/actions/admin/productos";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ImageUploader, type ImagenRow } from "@/components/admin/ImageUploader";
import { EspecificacionesEditor, type EspecificacionRow } from "@/components/admin/EspecificacionesEditor";
import type { Producto, Categoria, ProductoEstado } from "@/types/cms";

interface ProductoFormProps {
  producto?: Producto;
  categorias: Categoria[];
}

export function ProductoForm({ producto, categorias }: ProductoFormProps) {
  const router = useRouter();
  const [nombre, setNombre] = useState(producto?.nombre ?? "");
  const [slug, setSlug] = useState(producto?.slug ?? "");
  const [categoriaId, setCategoriaId] = useState(producto?.categoriaId ?? "");
  const [estado, setEstado] = useState<ProductoEstado>(producto?.estado ?? "borrador");
  const [destacado, setDestacado] = useState(producto?.destacado ?? false);
  const [descripcionCorta, setDescripcionCorta] = useState(producto?.descripcionCorta ?? "");
  const [descripcion, setDescripcion] = useState(producto?.descripcion ?? "");
  const [imagenes, setImagenes] = useState<ImagenRow[]>(
    producto?.imagenes.map((i) => ({ mediaId: i.mediaId, url: i.media.url, alt: i.media.alt })) ?? []
  );
  const [especificaciones, setEspecificaciones] = useState<EspecificacionRow[]>(
    producto?.especificaciones.map((e) => ({ clave: e.clave, valor: e.valor })) ?? []
  );
  const [precio, setPrecio] = useState(producto?.precio?.precio ?? 0);
  const [precioAnterior, setPrecioAnterior] = useState(producto?.precio?.precioAnterior ?? 0);
  const [stock, setStock] = useState(producto?.precio?.stock ?? 0);
  const [unidad, setUnidad] = useState(producto?.precio?.unidad ?? "pieza");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function handleNombreChange(value: string) {
    setNombre(value);
    if (!producto) setSlug(slugify(value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim()) { setError("El nombre es requerido."); return; }
    setSaving(true);
    setError("");

    const form = {
      nombre, slug: slug || slugify(nombre), categoriaId, estado, destacado,
      descripcionCorta, descripcion,
      imagenes: imagenes.map((img, i) => ({ mediaId: img.mediaId, orden: i })),
      especificaciones: especificaciones.map((s, i) => ({ ...s, orden: i })),
      precio, precioAnterior: precioAnterior || null, stock, unidad,
    };

    const result = producto
      ? await updateProducto(producto.id, form)
      : await createProducto(form);

    if (!result.success) {
      setError(result.error);
      setSaving(false);
      return;
    }
    router.push("/admin/productos");
    router.refresh();
  }

  const fieldCls = "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-teal";
  const labelCls = "text-white/70 text-sm font-medium";

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Básico */}
      <section className="space-y-4">
        <h2 className="text-white/30 text-xs uppercase tracking-widest font-semibold">Información básica</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 sm:col-span-2">
            <label className={labelCls}>Nombre *</label>
            <input type="text" value={nombre} onChange={(e) => handleNombreChange(e.target.value)} required className={fieldCls} placeholder="Casco de seguridad tipo I" />
          </div>
          <div className="space-y-1.5">
            <label className={labelCls}>Slug</label>
            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className={`${fieldCls} font-mono`} placeholder="casco-seguridad-tipo-i" />
          </div>
          <div className="space-y-1.5">
            <label className={labelCls}>Categoría</label>
            <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} className={fieldCls}>
              <option value="">Sin categoría</option>
              {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className={labelCls}>Estado</label>
            <select value={estado} onChange={(e) => setEstado(e.target.value as ProductoEstado)} className={fieldCls}>
              <option value="borrador">Borrador</option>
              <option value="publicado">Publicado</option>
              <option value="archivado">Archivado</option>
            </select>
          </div>
          <div className="flex items-center gap-3 pt-5">
            <input type="checkbox" id="destacado" checked={destacado} onChange={(e) => setDestacado(e.target.checked)} className="w-4 h-4 accent-brand-teal" />
            <label htmlFor="destacado" className={labelCls}>Producto destacado</label>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label className={labelCls}>Descripción corta (≤160 chars)</label>
            <textarea value={descripcionCorta} onChange={(e) => setDescripcionCorta(e.target.value)} maxLength={160} rows={2} className={`${fieldCls} resize-none`} placeholder="Breve descripción para listados..." />
          </div>
        </div>
      </section>

      {/* Imágenes */}
      <section className="space-y-3">
        <h2 className="text-white/30 text-xs uppercase tracking-widest font-semibold">Imágenes (máx. 10)</h2>
        <ImageUploader value={imagenes} onChange={setImagenes} />
      </section>

      {/* Precio e inventario */}
      <section className="space-y-4">
        <h2 className="text-white/30 text-xs uppercase tracking-widest font-semibold">Precio e inventario</h2>
        <div className="grid sm:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className={labelCls}>Precio</label>
            <input type="number" min={0} step="0.01" value={precio} onChange={(e) => setPrecio(Number(e.target.value))} className={fieldCls} placeholder="0.00" />
          </div>
          <div className="space-y-1.5">
            <label className={labelCls}>Precio anterior</label>
            <input type="number" min={0} step="0.01" value={precioAnterior} onChange={(e) => setPrecioAnterior(Number(e.target.value))} className={fieldCls} placeholder="0.00" />
          </div>
          <div className="space-y-1.5">
            <label className={labelCls}>Stock</label>
            <input type="number" min={0} value={stock} onChange={(e) => setStock(Number(e.target.value))} className={fieldCls} />
          </div>
          <div className="space-y-1.5">
            <label className={labelCls}>Unidad</label>
            <input type="text" value={unidad} onChange={(e) => setUnidad(e.target.value)} className={fieldCls} placeholder="pieza, caja, par..." />
          </div>
        </div>
      </section>

      {/* Especificaciones */}
      <section className="space-y-3">
        <h2 className="text-white/30 text-xs uppercase tracking-widest font-semibold">Especificaciones técnicas</h2>
        <EspecificacionesEditor value={especificaciones} onChange={setEspecificaciones} />
      </section>

      {/* Descripción completa */}
      <section className="space-y-3">
        <h2 className="text-white/30 text-xs uppercase tracking-widest font-semibold">Descripción completa</h2>
        <RichTextEditor value={descripcion} onChange={setDescripcion} />
      </section>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="bg-brand-teal text-white font-semibold px-6 py-2.5 rounded-lg text-sm hover:bg-brand-teal/90 transition-colors disabled:opacity-50">
          {saving ? "Guardando..." : producto ? "Guardar cambios" : "Crear producto"}
        </button>
        <button type="button" onClick={() => router.push("/admin/productos")} className="bg-white/5 text-white/60 font-semibold px-6 py-2.5 rounded-lg text-sm hover:bg-white/10 transition-colors">
          Cancelar
        </button>
      </div>
    </form>
  );
}
