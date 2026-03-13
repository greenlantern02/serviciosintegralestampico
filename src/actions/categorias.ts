import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { categorias } from "@/db/schema";
import type { Categoria } from "@/types/cms";

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

export async function getCategorias(): Promise<Categoria[]> {
  const db = getDb();
  const rows = await db.select().from(categorias).orderBy(categorias.nombre);
  return rows.map(rowToCategoria);
}

export async function getCategoriaBySlug(slug: string): Promise<Categoria | null> {
  const db = getDb();
  const rows = await db.select().from(categorias).where(eq(categorias.slug, slug)).limit(1);
  return rows[0] ? rowToCategoria(rows[0]) : null;
}
