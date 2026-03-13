import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { getCurrentUser } from "@/actions/admin/auth";
import { listCategoriasAdmin, deleteCategoria } from "@/actions/admin/categorias";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default async function CategoriasPage() {
  const user = await getCurrentUser();
  const cats = await listCategoriasAdmin();

  async function handleDelete(id: string) {
    "use server";
    await deleteCategoria(id);
  }

  const colorDot: Record<string, string> = {
    teal: "bg-teal-500",
    navy: "bg-blue-900",
    orange: "bg-orange-500",
    coral: "bg-red-400",
  };

  return (
    <div className="flex flex-col flex-1">
      <AdminHeader user={user!} title="Categorías" />

      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-white/40 text-sm">{cats.length} categoría{cats.length !== 1 ? "s" : ""}</p>
          <Link
            href="/admin/categorias/nuevo"
            className="flex items-center gap-2 bg-brand-teal text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-brand-teal/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nueva categoría
          </Link>
        </div>

        {cats.length === 0 ? (
          <div className="text-center py-20 text-white/30 text-sm">
            No hay categorías todavía.
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="text-left px-4 py-3 text-white/50 font-medium">Nombre</th>
                  <th className="text-left px-4 py-3 text-white/50 font-medium">Slug</th>
                  <th className="text-left px-4 py-3 text-white/50 font-medium">Color</th>
                  <th className="text-left px-4 py-3 text-white/50 font-medium">Ícono</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {cats.map((cat) => (
                  <tr key={cat.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3 text-white font-medium">{cat.nombre}</td>
                    <td className="px-4 py-3 text-white/40 font-mono text-xs">{cat.slug}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block w-3 h-3 rounded-full ${colorDot[cat.color ?? "teal"] ?? "bg-gray-500"}`} />
                    </td>
                    <td className="px-4 py-3 text-white/40 font-mono text-xs">{cat.icono ?? "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <Link
                          href={`/admin/categorias/${cat.id}`}
                          className="p-1.5 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <form action={handleDelete.bind(null, cat.id)}>
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
