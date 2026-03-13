import Link from "next/link";
import { Package, FolderOpen, Image, TrendingUp } from "lucide-react";
import { getCurrentUser } from "@/actions/admin/auth";
import { getDashboardStats } from "@/actions/admin/dashboard";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default async function DashboardPage() {
  const [user, stats] = await Promise.all([getCurrentUser(), getDashboardStats()]);

  const cards = [
    {
      label: "Productos",
      value: stats?.totalProductos ?? 0,
      sub: `${stats?.productosPorEstado.publicado ?? 0} publicados`,
      icon: Package,
      href: "/admin/productos",
      color: "text-brand-teal",
    },
    {
      label: "Categorías",
      value: stats?.totalCategorias ?? 0,
      sub: "categorías activas",
      icon: FolderOpen,
      href: "/admin/categorias",
      color: "text-blue-400",
    },
    {
      label: "Archivos",
      value: stats?.totalMedia ?? 0,
      sub: "imágenes en R2",
      icon: Image,
      href: "/admin/media",
      color: "text-purple-400",
    },
    {
      label: "Destacados",
      value: stats?.productosPorEstado.publicado ?? 0,
      sub: `${stats?.productosPorEstado.borrador ?? 0} en borrador`,
      icon: TrendingUp,
      href: "/admin/productos",
      color: "text-yellow-400",
    },
  ];

  return (
    <div className="flex flex-col flex-1">
      <AdminHeader user={user!} title="Dashboard" />

      <div className="flex-1 p-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {cards.map(({ label, value, sub, icon: Icon, href, color }) => (
            <Link
              key={label}
              href={href}
              className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-white/20 hover:bg-white/8 transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/50 text-sm font-medium">{label}</span>
                <Icon className={`w-5 h-5 ${color} opacity-60 group-hover:opacity-100 transition-opacity`} />
              </div>
              <p className="text-white text-3xl font-black">{value}</p>
              <p className="text-white/30 text-xs mt-1">{sub}</p>
            </Link>
          ))}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <h2 className="text-white/50 text-sm font-medium mb-4">Estado del catálogo</h2>
          <div className="flex gap-6 text-sm">
            <div>
              <span className="inline-block w-2 h-2 rounded-full bg-teal-400 mr-2" />
              <span className="text-white">{stats?.productosPorEstado.publicado ?? 0}</span>
              <span className="text-white/40 ml-1.5">publicados</span>
            </div>
            <div>
              <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 mr-2" />
              <span className="text-white">{stats?.productosPorEstado.borrador ?? 0}</span>
              <span className="text-white/40 ml-1.5">borradores</span>
            </div>
            <div>
              <span className="inline-block w-2 h-2 rounded-full bg-white/20 mr-2" />
              <span className="text-white">{stats?.productosPorEstado.archivado ?? 0}</span>
              <span className="text-white/40 ml-1.5">archivados</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
