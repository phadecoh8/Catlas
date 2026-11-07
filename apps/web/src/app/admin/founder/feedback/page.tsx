import { FounderFeedbackPage } from "@/components/admin/founder-pages";

export default function FounderFeedbackRoute() {
  return (
    <FounderFeedbackPage
      previewMode={process.env.NODE_ENV === "development"}
    />
  );
}
