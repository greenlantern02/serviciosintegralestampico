"use server";

import { eq, count } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/session";
import { productos, categorias, media } from "@/db/schema";
import type { DashboardStats } from "@/types/admin";

export async function getDashboardStats(): Promise<DashboardStats | null> {
  const session = await getSession();
  if (!session) return null;

  const db = getDb();
  const [totalProds, totalCats, totalMedia, publicados, borradores, archivados] = await Promise.all([
    db.select({ n: count() }).from(productos),
    db.select({ n: count() }).from(categorias),
    db.select({ n: count() }).from(media),
    db.select({ n: count() }).from(productos).where(eq(productos.estado, "publicado")),
    db.select({ n: count() }).from(productos).where(eq(productos.estado, "borrador")),
    db.select({ n: count() }).from(productos).where(eq(productos.estado, "archivado")),
  ]);

  return {
    totalProductos: totalProds[0].n,
    totalCategorias: totalCats[0].n,
    totalMedia: totalMedia[0].n,
    productosPorEstado: {
      publicado: publicados[0].n,
      borrador: borradores[0].n,
      archivado: archivados[0].n,
    },
  };
}
