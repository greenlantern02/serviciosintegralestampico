import type { SessionPayload } from "@/types/admin";

interface AdminHeaderProps {
  user: SessionPayload;
  title: string;
}

export function AdminHeader({ user, title }: AdminHeaderProps) {
  return (
    <header className="h-14 border-b border-white/10 flex items-center justify-between px-6 flex-shrink-0">
      <h1 className="text-white font-semibold text-base">{title}</h1>
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-brand-teal/20 flex items-center justify-center">
          <span className="text-brand-teal text-xs font-bold">
            {user.nombre.slice(0, 1).toUpperCase()}
          </span>
        </div>
        <span className="text-white/60 text-sm">{user.nombre}</span>
      </div>
    </header>
  );
}
