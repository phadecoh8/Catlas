import { NewsletterComposer } from "@/components/admin/newsletter-composer";

export default function FounderNewsletterUpdatesPage() {
  return (
    <NewsletterComposer
      previewMode={process.env.NODE_ENV === "development"}
    />
  );
}
