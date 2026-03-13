import { getCurrentUser } from "@/actions/admin/auth";
import { listMedia } from "@/actions/admin/media";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { MediaGrid } from "@/components/admin/MediaGrid";

export default async function MediaPage() {
  const [user, items] = await Promise.all([getCurrentUser(), listMedia()]);

  return (
    <div className="flex flex-col flex-1">
      <AdminHeader user={user!} title="Media" />
      <div className="flex-1 p-6">
        <MediaGrid initialItems={items} />
      </div>
    </div>
  );
}
