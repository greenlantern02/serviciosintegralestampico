import { getCurrentUser } from "@/actions/admin/auth";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CategoriaForm } from "@/components/admin/CategoriaForm";

export default async function NuevaCategoriaPage() {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-col flex-1">
      <AdminHeader user={user!} title="Nueva categoría" />
      <div className="flex-1 p-6">
        <CategoriaForm />
      </div>
    </div>
  );
}
