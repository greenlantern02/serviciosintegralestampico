import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { uploadToR2, getR2PublicUrl } from "@/lib/r2";
import { getSession } from "@/lib/session";
import { media } from "@/db/schema";
import type { MediaItem } from "@/types/cms";

export const runtime = "edge";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(req: NextRequest): Promise<NextResponse> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file");
  const alt = formData.get("alt")?.toString() ?? "";
  const widthStr = formData.get("width")?.toString();
  const heightStr = formData.get("height")?.toString();

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No se recibió un archivo válido." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Tipo de archivo no permitido." }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "El archivo supera el límite de 10 MB." }, { status: 400 });
  }

  const ext = file.name.split(".").pop() ?? "bin";
  const id = crypto.randomUUID();
  const r2Key = `media/${id}.${ext}`;

  const buffer = await file.arrayBuffer();
  await uploadToR2(r2Key, buffer, file.type);

  const url = getR2PublicUrl(r2Key);
  const now = new Date();

  const db = getDb();
  await db.insert(media).values({
    id,
    filename: file.name,
    url,
    r2Key,
    alt,
    mimeType: file.type,
    size: file.size,
    width: widthStr ? parseInt(widthStr, 10) : null,
    height: heightStr ? parseInt(heightStr, 10) : null,
    createdAt: now,
  });

  const rows = await db.select().from(media).where(eq(media.id, id)).limit(1);
  const row = rows[0];

  const item: MediaItem = {
    id: row.id,
    filename: row.filename,
    url: row.url,
    r2Key: row.r2Key,
    alt: row.alt,
    mimeType: row.mimeType,
    size: row.size,
    width: row.width ?? null,
    height: row.height ?? null,
    createdAt: row.createdAt ?? now,
  };

  return NextResponse.json(item, { status: 201 });
}
