import { redirect } from "next/navigation";
import { AdminRolePreview } from "@/components/admin/admin-role-preview";

export default function ViceChancellorDashboardPage() {
  if (process.env.NODE_ENV !== "development") {
    redirect("/admin/login");
  }

  return (
    <AdminRolePreview
      description="School-wide overview and school administration."
      role="Vice-Chancellor"
      sections={[
        "Students",
        "Feedback",
        "Session dates",
        "Locations and buildings",
        "Bulk upload",
        "Verification lists",
        "Location reports",
        "Graduation review",
        "Announcements and events",
        "Audit log",
      ]}
    />
  );
}
