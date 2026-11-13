import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AuditLogPage from "@/components/admin/audit-terminal";

export default async function FounderAuditLogRoute() {
  const session = await auth();

  if (
    session?.user.role !== "founder" ||
    session.user.provider !== "admin" ||
    session.user.mfaVerified !== true
  ) {
    redirect("/admin/login");
  }

  return <AuditLogPage />;
}
