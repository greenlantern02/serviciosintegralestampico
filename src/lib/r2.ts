import { getCloudflareContext } from "@opennextjs/cloudflare";

export function getR2Bucket(): R2Bucket {
  const { env } = getCloudflareContext();
  return env.BUCKET;
}

export function getR2PublicUrl(r2Key: string): string {
  // Serve through the Worker proxy — no public R2 domain required.
  return `/api/media/${r2Key}`;
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
