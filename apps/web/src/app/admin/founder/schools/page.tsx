import { FounderSchoolsPage } from "@/components/admin/founder-pages";

export default function FounderSchoolsRoute() {
  return (
    <FounderSchoolsPage
      previewMode={process.env.NODE_ENV === "development"}
    />
  );
}
