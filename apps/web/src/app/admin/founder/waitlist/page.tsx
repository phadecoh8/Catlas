import { FounderDashboard } from "@/components/admin/founder-dashboard";

export default function FounderWaitlistPage() {
  return (
    <FounderDashboard
      previewMode={process.env.NODE_ENV === "development"}
    />
  );
}
