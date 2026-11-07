import Link from "next/link";
import {
  ArrowLeft,
  Bookmark,
  ChevronRight,
  Clock3,
  FlaskConical,
  Presentation,
  Route,
  Accessibility,
} from "lucide-react";
import { ReportProblemDialog } from "@/components/location/report-problem-dialog";

const indoorPlaces = [
  {
    title: "Room B12 · Block B",
    details: "Ground floor · MTE 301 classroom",
    Icon: Presentation,
    color: "blue",
    href: "/location/mte-301",
  },
  {
    title: "MTE Lab",
    details: "Engineering Annex · Ground floor",
    Icon: FlaskConical,
    color: "orange",
    href: "/location/mte-lab",
  },
];

const placeContent: Record<
  string,
  { name: string; address: string; note: string }
> = {
  "faculty-engineering": {
    name: "Faculty of Engineering",
    address: "Engineering Road · Campus",
    note: "Main entrance faces Engineering Road.",
  },
  "mte-lab": {
    name: "MTE Lab",
    address: "Engineering Annex · Ground floor",
    note: "Laboratory details will be provided by the school.",
  },
  "engineering-lt": {
    name: "Engineering LT",
    address: "Ground floor · Lecture theatre",
    note: "Lecture theatre details will be provided by the school.",
  },
  "mte-301": {
    name: "MTE 301",
    address: "Engineering Block B · Room B12",
    note: "Classroom details will be provided by the school.",
  },
  "central-library": {
    name: "Central Library",
    address: "Campus location to be provided by the school.",
    note: "Library details will be provided by the school.",
  },
  "senate-house": {
    name: "Senate House",
    address: "Campus location to be provided by the school.",
    note: "Building details will be provided by the school.",
  },
};

export default async function LocationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const place = placeContent[id] ?? {
    name: "Campus place",
    address: "School-provided location details",
    note: "Place details will be provided by the school.",
  };

  return (
    <main className="app-screen location-screen">
      <div className="detail-page-title">
        <Link aria-label="Back to search" href="/search"><ArrowLeft /></Link>
        <h1>Building details</h1>
      </div>

      <div aria-label="Building photo placeholder" className="building-photo-placeholder" />
      <section className="building-summary">
        <h2>{place.name}</h2>
        <p>{place.address}</p>
        <div className="building-status-row">
          <span className="open-badge">OPEN NOW</span>
          <span className="detail-pill"><Clock3 />Closes at 18:00</span>
        </div>
        <div className="building-status-row">
          <span className="detail-pill"><Route />280 m · 4 min walk</span>
          <span className="detail-pill"><Accessibility />Step-free entry</span>
        </div>
      </section>

      <section aria-labelledby="inside-heading" className="inside-building-section">
        <h2 id="inside-heading">Inside this building</h2>
        <div className="inside-place-list">
          {indoorPlaces.map(({ title, details, Icon, color, href }) => (
            <Link className="inside-place-row" href={href} key={title}>
              <span className={`place-icon ${color}`}><Icon aria-hidden="true" /></span>
              <span className="place-copy">
                <strong>{title}</strong>
                <span>{details}</span>
              </span>
              <ChevronRight aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <div className="detail-actions">
        <Link className="primary-action" href={`/navigate/${id}`}>
          <Route aria-hidden="true" />GET DIRECTIONS
        </Link>
        <button className="outline-action" type="button">
          <Bookmark aria-hidden="true" />SAVE PLACE
        </button>
        <ReportProblemDialog locationId={id} />
      </div>
      <p className="building-note">{place.note}</p>
    </main>
  );
}
