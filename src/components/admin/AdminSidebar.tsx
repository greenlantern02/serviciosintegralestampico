"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, FolderOpen, Image, LayoutDashboard, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/actions/admin/auth";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/productos", label: "Productos", icon: Package, exact: false },
  { href: "/admin/categorias", label: "Categorías", icon: FolderOpen, exact: false },
  { href: "/admin/media", label: "Media", icon: Image, exact: false },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 flex-shrink-0 bg-[#0f1117] border-r border-white/10 flex flex-col min-h-screen">
      <div className="px-6 py-5 border-b border-white/10">
        <span className="text-white font-black text-lg tracking-tight">SI Admin</span>
        <p className="text-white/40 text-xs mt-0.5">Servicios Integrales</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href) && (exact || pathname !== "/admin");
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand-teal/10 text-brand-teal"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-4">
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/40 hover:text-white hover:bg-white/5 transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </form>
      </div>
    </aside>
  );
}
