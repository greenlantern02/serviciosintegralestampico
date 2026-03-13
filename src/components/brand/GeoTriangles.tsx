import { cn } from "@/lib/utils";

export function GeoTR({ className }: { className?: string }) {
  return (
    <div className={cn("absolute top-0 right-0 pointer-events-none overflow-hidden", className)} aria-hidden>
      <svg width="140" height="140" viewBox="0 0 140 140" fill="none">
        <polygon points="70,0 140,0 140,70" fill="#1D3F5E" opacity="0.13" />
        <polygon points="100,0 140,0 140,40" fill="#1D3F5E" opacity="0.2" />
      </svg>
    </div>
  );
}

export function GeoBL({ className }: { className?: string }) {
  return (
    <div className={cn("absolute bottom-0 left-0 pointer-events-none overflow-hidden", className)} aria-hidden>
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
        <polygon points="0,60 60,120 0,120" fill="#3BBFC0" opacity="0.12" />
      </svg>
    </div>
  );
}
