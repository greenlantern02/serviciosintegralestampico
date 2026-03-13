import { NextRequest, NextResponse } from "next/server";
import { getR2Bucket } from "@/lib/r2";

export const runtime = "edge";

// Local dev only — serves R2 objects through Next.js so images load without a
// public R2 domain. In production the frontend uses R2_PUBLIC_DOMAIN directly.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
): Promise<NextResponse> {
  if (process.env.NODE_ENV !== "development") {
    return new NextResponse("Not found", { status: 404 });
  }

  const { key } = await params;
  const r2Key = key.join("/");

  const bucket = getR2Bucket();
  const object = await bucket.get(r2Key);

  if (!object) {
    return new NextResponse("Not found", { status: 404 });
  }

  const data = await object.arrayBuffer();
  const contentType = object.httpMetadata?.contentType ?? "application/octet-stream";

  return new NextResponse(data, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
