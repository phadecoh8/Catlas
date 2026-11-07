import Link from "next/link";
import {
  BookOpen,
  Bookmark,
  FlaskConical,
  MapPin,
} from "lucide-react";

const shortcuts = [
  { label: "Near me", href: "/near-me", Icon: MapPin },
  { label: "Library", href: "/location/central-library", Icon: BookOpen },
  { label: "Labs", href: "/labs", Icon: FlaskConical },
  { label: "Saved", href: "/bookmarks", Icon: Bookmark },
];

export default function HomePage() {
  return (
    <main className="home-screen">
      <h1 className="sr-only">Home</h1>
      <div className="campus-line">
        <MapPin aria-hidden="true" />
        <span>Campus location</span>
      </div>

      <section aria-labelledby="go-somewhere-heading" className="shortcuts">
        <h2 id="go-somewhere-heading">Go somewhere</h2>
        <div className="shortcut-grid">
          {shortcuts.map(({ label, href, Icon }) => (
            <Link className="shortcut" href={href} key={label}>
              <span className="shortcut-icon">
                <Icon aria-hidden="true" />
              </span>
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="events-heading" className="saved-section">
        <div className="section-heading">
          <h2 id="events-heading">Events</h2>
          <Link href="/events">VIEW ALL</Link>
        </div>
        <p>Upcoming campus events will appear here.</p>
      </section>

      <section
        aria-labelledby="announcements-heading"
        className="saved-section"
      >
        <div className="section-heading">
          <h2 id="announcements-heading">Announcements</h2>
          <Link href="/announcements">VIEW ALL</Link>
        </div>
        <p>Campus announcements will appear here.</p>
      </section>

      <section aria-labelledby="saved-heading" className="saved-section">
        <h2 id="saved-heading">Saved places</h2>
        <p>Your saved campus places will appear here.</p>
        <Link className="add-place-button" href="/search">
          ADD A PLACE
        </Link>
      </section>

    </main>
  );
}
