import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";

export default function NearMePage() {
  return (
    <main className="app-screen information-screen">
      <div className="detail-page-title">
        <Link aria-label="Back to home" href="/home">
          <ArrowLeft />
        </Link>
        <h1>Near me</h1>
      </div>
      <section className="about-intro">
        <h2>Nearby buildings</h2>
        <p>
          Find campus buildings around your current location. Nearby search
          will be available when device location is connected.
        </p>
        <div className="about-step">
          <span><MapPin aria-hidden="true" /></span>
          <div>
            <h3>Location needed</h3>
            <p>Allow location access to see nearby campus buildings.</p>
          </div>
        </div>
      </section>
      <Link className="primary-action" href="/search">
        SEARCH CAMPUS PLACES
      </Link>
    </main>
  );
}
