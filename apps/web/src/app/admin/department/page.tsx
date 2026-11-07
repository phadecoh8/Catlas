import { redirect } from "next/navigation";
import { AdminRolePreview } from "@/components/admin/admin-role-preview";

export default function DepartmentDashboardPage() {
  if (process.env.NODE_ENV !== "development") {
    redirect("/admin/login");
  }

  return (
    <AdminRolePreview
      description="Department students grouped by level and department updates."
      role="Department HOD / committee"
      sections={["Students by level", "Feedback", "Announcements", "Events"]}
    />
  );
}
