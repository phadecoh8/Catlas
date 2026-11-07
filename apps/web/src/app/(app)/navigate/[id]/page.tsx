import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";

export default async function NavigatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="app-screen map-pending-screen">
      <div className="detail-page-title">
        <Link aria-label="Back to place details" href={`/location/${id}`}>
          <ArrowLeft />
        </Link>
        <h1>Directions</h1>
      </div>
      <section className="map-pending-card">
        <MapPin aria-hidden="true" />
        <h2>Map details are coming next</h2>
        <p>
          The map view will be completed when the campus location, map design,
          and map layer are provided.
        </p>
        <Link href={`/location/${id}`}>Back to building details</Link>
      </section>
    </main>
  );
}
