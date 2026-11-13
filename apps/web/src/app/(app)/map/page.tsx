import Link from "next/link";
import { Map } from "lucide-react";

export default function MapPage() {
  return (
    <main className="app-screen map-pending-screen">
      <div className="detail-page-title">
        <h1>Campus map</h1>
      </div>
      <section className="map-pending-card">
        <Map aria-hidden="true" />
        <h2>Map integration workspace</h2>
        <p>
          Choose a campus place to start building its map and directions.
        </p>
        <Link href="/search">Find a place</Link>
      </section>
    </main>
  );
}
