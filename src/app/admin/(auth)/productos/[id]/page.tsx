import { notFound } from "next/navigation";
import { getCurrentUser } from "@/actions/admin/auth";
import { getProductoAdminById } from "@/actions/admin/productos";
import { listCategoriasAdmin } from "@/actions/admin/categorias";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProductoForm } from "@/components/admin/ProductoForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditarProductoPage({ params }: Props) {
  const { id } = await params;
  const [user, producto, cats] = await Promise.all([
    getCurrentUser(),
    getProductoAdminById(id),
    listCategoriasAdmin(),
  ]);

  if (!producto) notFound();

  return (
    <div className="flex flex-col flex-1">
      <AdminHeader user={user!} title={`Editar: ${producto.nombre}`} />
      <div className="flex-1 p-6 overflow-y-auto">
        <ProductoForm producto={producto} categorias={cats} />
      </div>
    </div>
  );
}
