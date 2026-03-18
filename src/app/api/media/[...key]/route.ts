import { NextRequest, NextResponse } from "next/server";
import { getR2Bucket } from "@/lib/r2";

// Serves R2 objects through the Worker — works in both dev and production
// since the R2 bucket has no public access configured.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
): Promise<NextResponse> {
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
