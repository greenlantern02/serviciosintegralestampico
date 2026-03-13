import { getCurrentUser } from "@/actions/admin/auth";
import { listCategoriasAdmin } from "@/actions/admin/categorias";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProductoForm } from "@/components/admin/ProductoForm";

export default async function NuevoProductoPage() {
  const [user, cats] = await Promise.all([getCurrentUser(), listCategoriasAdmin()]);

  return (
    <div className="flex flex-col flex-1">
      <AdminHeader user={user!} title="Nuevo producto" />
      <div className="flex-1 p-6 overflow-y-auto">
        <ProductoForm categorias={cats} />
      </div>
    </div>
  );
}
