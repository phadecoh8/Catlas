import { FounderProblemsPage } from "@/components/admin/founder-pages";

export default function FounderProblemsRoute() {
  return (
    <FounderProblemsPage
      previewMode={process.env.NODE_ENV === "development"}
    />
  );
}
