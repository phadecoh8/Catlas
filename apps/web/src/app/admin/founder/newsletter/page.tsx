import { FounderNewsletterPage } from "@/components/admin/founder-pages";

export default function FounderNewsletterRoute() {
  return (
    <FounderNewsletterPage
      previewMode={process.env.NODE_ENV === "development"}
    />
  );
}
