"use server";

import { eq, desc } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { deleteFromR2 } from "@/lib/r2";
import { getSession } from "@/lib/session";
import { media, productoImagenes } from "@/db/schema";
import type { MediaItem } from "@/types/cms";
import type { ActionResult } from "@/types/actions";

function rowToMediaItem(row: typeof media.$inferSelect): MediaItem {
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

export async function listMedia(): Promise<MediaItem[]> {
  const session = await getSession();
  if (!session) return [];

  const db = getDb();
  const rows = await db.select().from(media).orderBy(desc(media.createdAt));
  return rows.map(rowToMediaItem);
}

export async function deleteMedia(id: string): Promise<ActionResult<null>> {
  const session = await getSession();
  if (!session) return { success: false, error: "No autorizado." };

  const db = getDb();
  const rows = await db.select().from(media).where(eq(media.id, id)).limit(1);
  if (!rows[0]) return { success: false, error: "Archivo no encontrado." };

  // Check if in use
  const usages = await db
    .select()
    .from(productoImagenes)
    .where(eq(productoImagenes.mediaId, id))
    .limit(1);

  if (usages.length > 0) {
    return { success: false, error: "La imagen está siendo usada por un producto." };
  }

  await deleteFromR2(rows[0].r2Key);
  await db.delete(media).where(eq(media.id, id));

  return { success: true, data: null };
}
