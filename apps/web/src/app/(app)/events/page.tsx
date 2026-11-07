import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const events = [
  {
    day: "06",
    name: "Engineering career fair",
    place: "Engineering foyer",
    time: "10:00 am – 2:00 pm",
  },
  {
    day: "09",
    name: "Robotics showcase",
    place: "Mechatronics Lab",
    time: "12:00 pm – 3:00 pm",
  },
  {
    day: "12",
    name: "Freshers’ campus tour",
    place: "Senate House entrance",
    time: "9:00 am – 11:00 am",
  },
  {
    day: "18",
    name: "Research & innovation",
    place: "Engineering LT",
    time: "1:00 pm – 4:00 pm",
  },
];

export default function EventsPage() {
  return (
    <main className="app-screen information-screen events-page">
      <div className="detail-page-title">
        <Link aria-label="Back to home" href="/home">
          <ArrowLeft aria-hidden="true" />
        </Link>
        <h1>Events</h1>
      </div>

      <section aria-labelledby="events-heading" className="events-section">
        <div className="events-section-heading">
          <h2 id="events-heading">Around campus</h2>
          <span>NOVEMBER</span>
        </div>
        <div className="event-list">
          {events.map((event) => (
            <article className="event-row" key={event.day}>
              <time
                className="event-date"
                dateTime={`2026-11-${event.day}`}
              >
                <strong>{event.day}</strong>
                <span>NOV</span>
              </time>
              <div className="event-copy">
                <h3>{event.name}</h3>
                <p>{event.place}</p>
                <p>{event.time}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
