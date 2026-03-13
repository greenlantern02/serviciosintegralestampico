import Link from "next/link";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { getCurrentUser } from "@/actions/admin/auth";
import { listProductosAdmin, deleteProducto } from "@/actions/admin/productos";
import { AdminHeader } from "@/components/admin/AdminHeader";
import type { ProductoEstado } from "@/types/cms";

const estadoBadge: Record<ProductoEstado, string> = {
  publicado: "bg-teal-500/10 text-teal-400 border-teal-500/20",
  borrador:  "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  archivado: "bg-white/5 text-white/30 border-white/10",
};

export default async function ProductosAdminPage() {
  const [user, prods] = await Promise.all([getCurrentUser(), listProductosAdmin()]);

  async function handleDelete(id: string) {
    "use server";
    await deleteProducto(id);
  }

  return (
    <div className="flex flex-col flex-1">
      <AdminHeader user={user!} title="Productos" />

      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-white/40 text-sm">{prods.length} producto{prods.length !== 1 ? "s" : ""}</p>
          <Link
            href="/admin/productos/nuevo"
            className="flex items-center gap-2 bg-brand-teal text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-brand-teal/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nuevo producto
          </Link>
        </div>

        {prods.length === 0 ? (
          <div className="text-center py-20 text-white/30 text-sm">No hay productos todavía.</div>
        ) : (
          <div className="rounded-xl border border-white/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="text-left px-4 py-3 text-white/50 font-medium">Nombre</th>
                  <th className="text-left px-4 py-3 text-white/50 font-medium">Categoría</th>
                  <th className="text-left px-4 py-3 text-white/50 font-medium">Estado</th>
                  <th className="text-left px-4 py-3 text-white/50 font-medium">Dest.</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {prods.map((p) => (
                  <tr key={p.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3 text-white font-medium max-w-[240px] truncate">{p.nombre}</td>
                    <td className="px-4 py-3 text-white/50 text-xs">{p.categoria?.nombre ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded border font-medium ${estadoBadge[p.estado]}`}>
                        {p.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {p.destacado && <Star className="w-3.5 h-3.5 text-yellow-400" />}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <Link
                          href={`/admin/productos/${p.id}`}
                          className="p-1.5 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <form action={handleDelete.bind(null, p.id)}>
                          <button
                            type="submit"
                            className="p-1.5 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
