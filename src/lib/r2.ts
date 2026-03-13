import { getCloudflareContext } from "@opennextjs/cloudflare";

export function getR2Bucket(): R2Bucket {
  const { env } = getCloudflareContext();
  return env.BUCKET;
}

export function getR2PublicUrl(r2Key: string): string {
  // In local dev, serve through the local proxy route instead of R2 public domain
  if (process.env.NODE_ENV === "development") {
    return `/api/media/${r2Key}`;
  }
  const domain = process.env.R2_PUBLIC_DOMAIN;
  if (!domain) throw new Error("R2_PUBLIC_DOMAIN is not set");
  return `https://${domain}/${r2Key}`;
}

export async function uploadToR2(
  r2Key: string,
  data: ArrayBuffer,
  contentType: string
): Promise<void> {
  const bucket = getR2Bucket();
  await bucket.put(r2Key, data, {
    httpMetadata: { contentType },
  });
}

export async function deleteFromR2(r2Key: string): Promise<void> {
  const bucket = getR2Bucket();
  await bucket.delete(r2Key);
}
