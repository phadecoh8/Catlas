import { redirect } from "next/navigation";
import { AdminRolePreview } from "@/components/admin/admin-role-preview";

export default function DeanDashboardPage() {
  if (process.env.NODE_ENV !== "development") {
    redirect("/admin/login");
  }

  return (
    <AdminRolePreview
      description="Faculty student overview and faculty updates."
      role="Dean"
      sections={["Faculty students", "Feedback", "Announcements", "Events"]}
    />
  );
}
