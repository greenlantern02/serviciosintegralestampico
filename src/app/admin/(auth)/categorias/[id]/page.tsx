import { notFound } from "next/navigation";
import { getCurrentUser } from "@/actions/admin/auth";
import { getCategoriaById } from "@/actions/admin/categorias";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CategoriaForm } from "@/components/admin/CategoriaForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditarCategoriaPage({ params }: Props) {
  const { id } = await params;
  const [user, categoria] = await Promise.all([getCurrentUser(), getCategoriaById(id)]);

  if (!categoria) notFound();

  return (
    <div className="flex flex-col flex-1">
      <AdminHeader user={user!} title={`Editar: ${categoria.nombre}`} />
      <div className="flex-1 p-6">
        <CategoriaForm categoria={categoria} />
      </div>
    </div>
  );
}
