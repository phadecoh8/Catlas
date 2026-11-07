import { FounderOverview } from "@/components/admin/founder-pages";

export default function FounderPage() {
  return (
    <FounderOverview
      previewMode={process.env.NODE_ENV === "development"}
    />
  );
}
