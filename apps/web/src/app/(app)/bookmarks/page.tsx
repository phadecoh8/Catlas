import Link from "next/link";
import {
  ArrowLeft,
  Bookmark,
} from "lucide-react";

const bookmarks = [
  {
    name: "Mechatronics Lab",
    details: "Faculty of Engineering",
    href: "/location/mte-lab",
  },
  {
    name: "Central Library",
    details: "Library services",
    href: "/location/central-library",
  },
  {
    name: "Engineering LT",
    details: "Faculty of Engineering",
    href: "/location/engineering-lt",
  },
  {
    name: "Senate House",
    details: "Administration",
    href: "/location/senate-house",
  },
];

function EmptyBookmarks() {
  return (
    <section className="bookmarks-empty">
      <div aria-hidden="true" className="bookmarks-empty-avatar">
        cat
      </div>
      <h2>No saved places yet</h2>
      <p>
        Save a place to find it quickly next time you’re heading across campus.
      </p>
      <Link className="bookmarks-add-button" href="/search">
        ADD BOOKMARKS
      </Link>
    </section>
  );
}

export default function BookmarksPage() {
  return (
    <main className="app-screen information-screen bookmarks-page">
      <div className="detail-page-title">
        <Link aria-label="Back to home" href="/home">
          <ArrowLeft aria-hidden="true" />
        </Link>
        <h1>Bookmarks</h1>
      </div>

      {bookmarks.length === 0 ? (
        <EmptyBookmarks />
      ) : (
        <>
          <p className="bookmarks-subtitle">
            Your saved places, ready when you need them.
          </p>
          <section aria-label="Saved places" className="bookmark-list">
            {bookmarks.map(({ name, details, href }) => (
              <Link className="bookmark-row" href={href} key={name}>
                <span aria-hidden="true" className="bookmark-thumbnail" />
                <span className="bookmark-copy">
                  <strong>{name}</strong>
                  <span>{details}</span>
                </span>
                <Bookmark
                  aria-label="Bookmarked"
                  className="bookmark-mark"
                  fill="currentColor"
                />
              </Link>
            ))}
          </section>
        </>
      )}
    </main>
  );
}
