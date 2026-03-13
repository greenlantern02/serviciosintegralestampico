"use server";

import { eq, desc } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/session";
import { categorias } from "@/db/schema";
import { slugify } from "@/lib/slugify";
import type { Categoria } from "@/types/cms";
import type { AdminCategoriaForm } from "@/types/admin";
import type { ActionResult } from "@/types/actions";

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

export async function listCategoriasAdmin(): Promise<Categoria[]> {
  const session = await getSession();
  if (!session) return [];

  const db = getDb();
  const rows = await db.select().from(categorias).orderBy(desc(categorias.createdAt));
  return rows.map(rowToCategoria);
}

export async function getCategoriaById(id: string): Promise<Categoria | null> {
  const session = await getSession();
  if (!session) return null;

  const db = getDb();
  const rows = await db.select().from(categorias).where(eq(categorias.id, id)).limit(1);
  return rows[0] ? rowToCategoria(rows[0]) : null;
}

export async function createCategoria(form: AdminCategoriaForm): Promise<ActionResult<Categoria>> {
  const session = await getSession();
  if (!session) return { success: false, error: "No autorizado." };

  const id = crypto.randomUUID();
  const now = new Date();
  const slug = form.slug || slugify(form.nombre);

  const db = getDb();
  await db.insert(categorias).values({
    id,
    nombre: form.nombre,
    slug,
    descripcion: form.descripcion || null,
    color: form.color || null,
    icono: form.icono || null,
    createdAt: now,
    updatedAt: now,
  });

  const rows = await db.select().from(categorias).where(eq(categorias.id, id)).limit(1);
  return { success: true, data: rowToCategoria(rows[0]) };
}

export async function updateCategoria(
  id: string,
  form: AdminCategoriaForm
): Promise<ActionResult<Categoria>> {
  const session = await getSession();
  if (!session) return { success: false, error: "No autorizado." };

  const slug = form.slug || slugify(form.nombre);
  const db = getDb();

  await db
    .update(categorias)
    .set({
      nombre: form.nombre,
      slug,
      descripcion: form.descripcion || null,
      color: form.color || null,
      icono: form.icono || null,
      updatedAt: new Date(),
    })
    .where(eq(categorias.id, id));

  const rows = await db.select().from(categorias).where(eq(categorias.id, id)).limit(1);
  return { success: true, data: rowToCategoria(rows[0]) };
}

export async function deleteCategoria(id: string): Promise<ActionResult<null>> {
  const session = await getSession();
  if (!session) return { success: false, error: "No autorizado." };

  const db = getDb();
  await db.delete(categorias).where(eq(categorias.id, id));
  return { success: true, data: null };
}
