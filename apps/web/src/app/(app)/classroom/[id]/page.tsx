import Link from "next/link";
import {
  Accessibility,
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  CircleHelp,
  Plus,
  Presentation,
  Waypoints,
} from "lucide-react";

export default async function ClassDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="app-screen information-screen class-detail-screen">
      <div className="detail-page-title">
        <Link aria-label="Back to classroom" href="/classroom">
          <ArrowLeft aria-hidden="true" />
        </Link>
        <h1>Class details</h1>
        <Link
          aria-label="Help"
          className="class-details-help"
          href="/help"
        >
          <CircleHelp aria-hidden="true" />
        </Link>
      </div>

      <section className="class-detail-summary">
        <div className="class-detail-heading">
          <h2>{id.replaceAll("-", " ").toUpperCase()}</h2>
          <span>TODAY</span>
        </div>
        <h3>Engineering Mathematics III</h3>
        <p>300 level · Faculty of Engineering</p>
      </section>

      <section aria-label="Class schedule" className="class-schedule-card">
        <div className="class-schedule-heading">
          <strong>Tuesday · 10:00–12:00</strong>
          <span>IN 20 MIN</span>
        </div>
        <p>Dr. A. Okafor · 3 units</p>
        <div>
          <CalendarDays aria-hidden="true" />
          Every Tuesday
        </div>
      </section>

      <section aria-labelledby="where-to-go-heading" className="class-place-section">
        <h2 id="where-to-go-heading">Where to go</h2>
        <div aria-label="Map preview" className="class-location-map" />
        <Link className="class-room-row" href="/location/faculty-engineering">
          <span className="preference-icon blue">
            <Presentation aria-hidden="true" />
          </span>
          <span className="preference-copy">
            <strong>Room B12 · Block B</strong>
            <span>Faculty of Engineering · Ground floor</span>
          </span>
          <ChevronRight
            aria-hidden="true"
            className="settings-chevron"
          />
        </Link>
        <div className="class-route-pills">
          <span><Waypoints aria-hidden="true" />4 min walk</span>
          <span><Accessibility aria-hidden="true" />Step-free</span>
        </div>
      </section>

      <div className="class-detail-actions">
        <Link className="class-directions-button" href={`/navigate/${id}`}>
          <Waypoints aria-hidden="true" />
          DIRECTIONS TO CLASS
        </Link>
        <button className="outline-action" type="button">
          <Plus aria-hidden="true" />
          ADD TO MY COURSES
        </button>
      </div>
    </main>
  );
}
