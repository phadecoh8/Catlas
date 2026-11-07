import { FounderAuditLogPage } from "@/components/admin/founder-pages";

export default function FounderAuditLogRoute() {
  return (
    <FounderAuditLogPage
      previewMode={process.env.NODE_ENV === "development"}
    />
  );
}
