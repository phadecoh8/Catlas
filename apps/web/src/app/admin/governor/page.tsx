import { redirect } from "next/navigation";
import { AdminRolePreview } from "@/components/admin/admin-role-preview";

export default function ClassGovernorDashboardPage() {
  if (process.env.NODE_ENV !== "development") {
    redirect("/admin/login");
  }

  return (
    <AdminRolePreview
      description="Class updates and assignments for the governor’s own level."
      role="Class governor"
      sections={["Students", "Class updates", "Assignments"]}
    />
  );
}
