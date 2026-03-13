import { eq, and, desc, inArray } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { productos, categorias, productoImagenes, media, especificaciones, precios } from "@/db/schema";
import type { Producto, Categoria, ProductoImagen, Especificacion, MediaItem, Precio } from "@/types/cms";

// ─── Row mappers ─────────────────────────────────────────────────────────────

function rowToMedia(row: typeof media.$inferSelect): MediaItem {
  return {
    id: row.id,
    filename: row.filename,
    url: row.url,
    r2Key: row.r2Key,
    alt: row.alt,
    mimeType: row.mimeType,
    size: row.size,
    width: row.width ?? null,
    height: row.height ?? null,
    createdAt: row.createdAt ?? new Date(),
  };
}

function rowToCategoria(row: typeof categorias.$inferSelect): Categoria {
  return {
    id: row.id,
    nombre: row.nombre,
    slug: row.slug,
    descripcion: row.descripcion ?? null,
    color: row.color ?? null,
    icono: row.icono ?? null,
    createdAt: row.createdAt ?? new Date(),
    updatedAt: row.updatedAt ?? new Date(),
  };
}

// ─── Queries ──────────────────────────────────────────────────────────────────

async function attachRelations(
  productoRows: (typeof productos.$inferSelect)[],
  categoriaRows: (typeof categorias.$inferSelect | null)[]
): Promise<Producto[]> {
  if (productoRows.length === 0) return [];

  const db = getDb();
  const ids = productoRows.map((p) => p.id);

  // Fetch all imagenes + media for these products
  const imageRows = await db
    .select({ pi: productoImagenes, m: media })
    .from(productoImagenes)
    .innerJoin(media, eq(productoImagenes.mediaId, media.id))
    .where(
      ids.length === 1
        ? eq(productoImagenes.productoId, ids[0])
        : inArray(productoImagenes.productoId, ids)
    )
    .orderBy(productoImagenes.orden);

  // Fetch all especificaciones
  const specRows = await db
    .select()
    .from(especificaciones)
    .where(
      ids.length === 1
        ? eq(especificaciones.productoId, ids[0])
        : inArray(especificaciones.productoId, ids)
    )
    .orderBy(especificaciones.orden);

  // Fetch precios
  const precioRows = await db
    .select()
    .from(precios)
    .where(
      ids.length === 1
        ? eq(precios.productoId, ids[0])
        : inArray(precios.productoId, ids)
    );

  return productoRows.map((p, i) => {
    const catRow = categoriaRows[i];
    const imagenes: ProductoImagen[] = imageRows
      .filter((r) => r.pi.productoId === p.id)
      .map((r) => ({
        id: r.pi.id,
        productoId: r.pi.productoId,
        mediaId: r.pi.mediaId,
        media: rowToMedia(r.m),
        orden: r.pi.orden,
      }));

    const especificacionesData: Especificacion[] = specRows
      .filter((r) => r.productoId === p.id)
      .map((r) => ({
        id: r.id,
        productoId: r.productoId,
        clave: r.clave,
        valor: r.valor,
        orden: r.orden,
      }));

    const precioRow = precioRows.find((r) => r.productoId === p.id);
    const precioData: Precio | null = precioRow
      ? {
          id: precioRow.id,
          productoId: precioRow.productoId,
          precio: precioRow.precio,
          precioAnterior: precioRow.precioAnterior ?? null,
          stock: precioRow.stock,
          unidad: precioRow.unidad ?? null,
          updatedAt: precioRow.updatedAt ?? new Date(),
        }
      : null;

    return {
      id: p.id,
      nombre: p.nombre,
      slug: p.slug,
      categoriaId: p.categoriaId ?? null,
      categoria: catRow ? rowToCategoria(catRow) : null,
      estado: p.estado,
      destacado: Boolean(p.destacado),
      descripcionCorta: p.descripcionCorta ?? null,
      descripcion: p.descripcion ?? null,
      imagenes,
      especificaciones: especificacionesData,
      precio: precioData,
      createdAt: p.createdAt ?? new Date(),
      updatedAt: p.updatedAt ?? new Date(),
    };
  });
}

// ─── Public actions ───────────────────────────────────────────────────────────

export async function getFeaturedProducts(): Promise<Producto[]> {
  const db = getDb();
  const rows = await db
    .select({ p: productos, c: categorias })
    .from(productos)
    .leftJoin(categorias, eq(productos.categoriaId, categorias.id))
    .where(and(eq(productos.estado, "publicado"), eq(productos.destacado, true)))
    .orderBy(desc(productos.updatedAt))
    .limit(6);

  return attachRelations(
    rows.map((r) => r.p),
    rows.map((r) => r.c)
  );
}

export async function getProductosByCategoria(categoriaSlug?: string): Promise<Producto[]> {
  const db = getDb();

  if (categoriaSlug) {
    const catRows = await db
      .select()
      .from(categorias)
      .where(eq(categorias.slug, categoriaSlug))
      .limit(1);
    if (!catRows[0]) return [];

    const rows = await db
      .select({ p: productos, c: categorias })
      .from(productos)
      .leftJoin(categorias, eq(productos.categoriaId, categorias.id))
      .where(and(eq(productos.estado, "publicado"), eq(productos.categoriaId, catRows[0].id)))
      .orderBy(desc(productos.destacado), desc(productos.updatedAt))
      .limit(100);

    return attachRelations(
      rows.map((r) => r.p),
      rows.map((r) => r.c)
    );
  }

  const rows = await db
    .select({ p: productos, c: categorias })
    .from(productos)
    .leftJoin(categorias, eq(productos.categoriaId, categorias.id))
    .where(eq(productos.estado, "publicado"))
    .orderBy(desc(productos.destacado), desc(productos.updatedAt))
    .limit(100);

  return attachRelations(
    rows.map((r) => r.p),
    rows.map((r) => r.c)
  );
}

export async function getProductoBySlug(slug: string): Promise<Producto | null> {
  const db = getDb();
  const rows = await db
    .select({ p: productos, c: categorias })
    .from(productos)
    .leftJoin(categorias, eq(productos.categoriaId, categorias.id))
    .where(eq(productos.slug, slug))
    .limit(1);

  if (!rows[0]) return null;

  const result = await attachRelations([rows[0].p], [rows[0].c]);
  return result[0] ?? null;
}

export async function getProductoStaticPaths(): Promise<{ slug: string }[]> {
  const db = getDb();
  const rows = await db
    .select({ slug: productos.slug })
    .from(productos)
    .where(eq(productos.estado, "publicado"));
  return rows;
}
