import { SearchPage } from "@/components/search/search-page";

export default async function SearchRoute({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const { query = "" } = await searchParams;

  return <SearchPage initialQuery={query} />;
}
