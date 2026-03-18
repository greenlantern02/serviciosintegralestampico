"use server";

import { eq, desc } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/session";
import { productos, categorias, productoImagenes, media, especificaciones, caracteristicas, precios } from "@/db/schema";
import { slugify } from "@/lib/slugify";
import type { Producto, Categoria } from "@/types/cms";
import type { AdminProductoForm } from "@/types/admin";
import type { ActionResult } from "@/types/actions";

function rowToCategoria(row: typeof categorias.$inferSelect): Categoria {
  return {
    id: row.id, nombre: row.nombre, slug: row.slug,
    descripcion: row.descripcion ?? null, color: row.color ?? null,
    icono: row.icono ?? null,
    createdAt: row.createdAt ?? new Date(), updatedAt: row.updatedAt ?? new Date(),
  };
}

async function buildProducto(pRow: typeof productos.$inferSelect): Promise<Producto> {
  const db = getDb();
  const [catRows, imgRows, specRows, caracRows, precioRows] = await Promise.all([
    pRow.categoriaId
      ? db.select().from(categorias).where(eq(categorias.id, pRow.categoriaId)).limit(1)
      : Promise.resolve([]),
    db.select({ pi: productoImagenes, m: media })
      .from(productoImagenes)
      .innerJoin(media, eq(productoImagenes.mediaId, media.id))
      .where(eq(productoImagenes.productoId, pRow.id))
      .orderBy(productoImagenes.orden),
    db.select().from(especificaciones).where(eq(especificaciones.productoId, pRow.id)).orderBy(especificaciones.orden),
    db.select().from(caracteristicas).where(eq(caracteristicas.productoId, pRow.id)).orderBy(caracteristicas.orden),
    db.select().from(precios).where(eq(precios.productoId, pRow.id)).limit(1),
  ]);

  return {
    id: pRow.id, nombre: pRow.nombre, slug: pRow.slug,
    categoriaId: pRow.categoriaId ?? null,
    categoria: catRows[0] ? rowToCategoria(catRows[0]) : null,
    estado: pRow.estado, destacado: Boolean(pRow.destacado),
    descripcionCorta: pRow.descripcionCorta ?? null,
    descripcion: pRow.descripcion ?? null,
    imagenes: imgRows.map((r) => ({
      id: r.pi.id, productoId: r.pi.productoId, mediaId: r.pi.mediaId,
      media: { id: r.m.id, filename: r.m.filename, url: r.m.url, r2Key: r.m.r2Key, alt: r.m.alt, mimeType: r.m.mimeType, size: r.m.size, width: r.m.width ?? null, height: r.m.height ?? null, createdAt: r.m.createdAt ?? new Date() },
      orden: r.pi.orden,
    })),
    especificaciones: specRows.map((r) => ({
      id: r.id, productoId: r.productoId, clave: r.clave, valor: r.valor, orden: r.orden,
    })),
    caracteristicas: caracRows.map((r) => ({
      id: r.id, productoId: r.productoId, texto: r.texto, orden: r.orden,
    })),
    precio: precioRows[0]
      ? { id: precioRows[0].id, productoId: precioRows[0].productoId, precio: precioRows[0].precio, precioAnterior: precioRows[0].precioAnterior ?? null, stock: precioRows[0].stock, unidad: precioRows[0].unidad ?? null, updatedAt: precioRows[0].updatedAt ?? new Date() }
      : null,
    createdAt: pRow.createdAt ?? new Date(), updatedAt: pRow.updatedAt ?? new Date(),
  };
}

export async function listProductosAdmin(): Promise<Producto[]> {
  const session = await getSession();
  if (!session) return [];

  const db = getDb();
  const rows = await db
    .select({ p: productos, c: categorias })
    .from(productos)
    .leftJoin(categorias, eq(productos.categoriaId, categorias.id))
    .orderBy(desc(productos.updatedAt));

  return rows.map((r) => ({
    id: r.p.id, nombre: r.p.nombre, slug: r.p.slug,
    categoriaId: r.p.categoriaId ?? null,
    categoria: r.c ? rowToCategoria(r.c) : null,
    estado: r.p.estado, destacado: Boolean(r.p.destacado),
    descripcionCorta: r.p.descripcionCorta ?? null,
    descripcion: r.p.descripcion ?? null,
    imagenes: [], especificaciones: [], caracteristicas: [], precio: null,
    createdAt: r.p.createdAt ?? new Date(), updatedAt: r.p.updatedAt ?? new Date(),
  }));
}

export async function getProductoAdminById(id: string): Promise<Producto | null> {
  const session = await getSession();
  if (!session) return null;

  const db = getDb();
  const rows = await db.select().from(productos).where(eq(productos.id, id)).limit(1);
  if (!rows[0]) return null;
  return buildProducto(rows[0]);
}

export async function createProducto(form: AdminProductoForm): Promise<ActionResult<Producto>> {
  const session = await getSession();
  if (!session) return { success: false, error: "No autorizado." };

  const id = crypto.randomUUID();
  const now = new Date();
  const slug = form.slug || slugify(form.nombre);
  const db = getDb();

  await db.insert(productos).values({
    id, nombre: form.nombre, slug,
    categoriaId: form.categoriaId || null,
    estado: form.estado, destacado: form.destacado,
    descripcionCorta: form.descripcionCorta || null,
    descripcion: form.descripcion || null,
    createdAt: now, updatedAt: now,
  });

  await upsertRelations(id, form, now);
  const result = await buildProducto((await db.select().from(productos).where(eq(productos.id, id)).limit(1))[0]);
  return { success: true, data: result };
}

export async function updateProducto(id: string, form: AdminProductoForm): Promise<ActionResult<Producto>> {
  const session = await getSession();
  if (!session) return { success: false, error: "No autorizado." };

  const slug = form.slug || slugify(form.nombre);
  const now = new Date();
  const db = getDb();

  await db.update(productos).set({
    nombre: form.nombre, slug,
    categoriaId: form.categoriaId || null,
    estado: form.estado, destacado: form.destacado,
    descripcionCorta: form.descripcionCorta || null,
    descripcion: form.descripcion || null,
    updatedAt: now,
  }).where(eq(productos.id, id));

  await upsertRelations(id, form, now);
  const result = await buildProducto((await db.select().from(productos).where(eq(productos.id, id)).limit(1))[0]);
  return { success: true, data: result };
}

async function upsertRelations(productoId: string, form: AdminProductoForm, now: Date) {
  const db = getDb();

  await db.delete(productoImagenes).where(eq(productoImagenes.productoId, productoId));
  if (form.imagenes.length > 0) {
    await db.insert(productoImagenes).values(
      form.imagenes.map((img) => ({
        id: crypto.randomUUID(),
        productoId, mediaId: img.mediaId, orden: img.orden,
      }))
    );
  }

  await db.delete(especificaciones).where(eq(especificaciones.productoId, productoId));
  if (form.especificaciones.length > 0) {
    await db.insert(especificaciones).values(
      form.especificaciones.map((spec) => ({
        id: crypto.randomUUID(),
        productoId, clave: spec.clave, valor: spec.valor, orden: spec.orden,
      }))
    );
  }

  await db.delete(caracteristicas).where(eq(caracteristicas.productoId, productoId));
  if (form.caracteristicas.length > 0) {
    await db.insert(caracteristicas).values(
      form.caracteristicas.map((c) => ({
        id: crypto.randomUUID(),
        productoId, texto: c.texto, orden: c.orden,
      }))
    );
  }

  const existingPrecio = await db.select().from(precios).where(eq(precios.productoId, productoId)).limit(1);
  if (existingPrecio[0]) {
    await db.update(precios).set({
      precio: form.precio, precioAnterior: form.precioAnterior,
      stock: form.stock, unidad: form.unidad, updatedAt: now,
    }).where(eq(precios.productoId, productoId));
  } else {
    await db.insert(precios).values({
      id: crypto.randomUUID(), productoId,
      precio: form.precio, precioAnterior: form.precioAnterior,
      stock: form.stock, unidad: form.unidad || "pieza", updatedAt: now,
    });
  }
}

export async function deleteProducto(id: string): Promise<ActionResult<null>> {
  const session = await getSession();
  if (!session) return { success: false, error: "No autorizado." };

  const db = getDb();
  await db.delete(productos).where(eq(productos.id, id));
  return { success: true, data: null };
}
