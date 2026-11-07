import Link from "next/link";
import {
  Building2,
  FlaskConical,
  Waypoints,
} from "lucide-react";

export default function ClassroomPage() {
  return (
    <main className="app-screen classroom-screen">
      <h1 className="route-heading">Classroom</h1>

      <div className="class-date-row">
        <strong>Tuesday, 27 October</strong>
        <span>WEEK 4</span>
      </div>

      <section aria-labelledby="up-next-heading" className="class-section">
        <h2 id="up-next-heading">Up next</h2>
        <article className="next-class-card">
          <Link className="next-class-info" href="/classroom/mte-301">
            <div className="class-course-row">
              <strong>MTE 301</strong>
              <span>IN 20 MIN</span>
            </div>
            <h3>Engineering Mathematics III</h3>
            <p>10:00–12:00 · Room B12, Block B</p>
          </Link>
          <div className="class-details-row">
            <span>
              <Waypoints aria-hidden="true" />
              4 min walk
            </span>
            <span>
              <Building2 aria-hidden="true" />
              Ground floor
            </span>
          </div>
          <Link className="class-directions-button" href="/navigate/mte-301">
            <Waypoints aria-hidden="true" />
            DIRECTIONS TO CLASS
          </Link>
        </article>
      </section>

      <section
        aria-labelledby="later-today-heading"
        className="later-class-section"
      >
        <h2 id="later-today-heading">Later today</h2>
        <Link className="later-class-row" href="/location/mte-lab">
          <span className="place-icon orange">
            <FlaskConical aria-hidden="true" />
          </span>
          <span className="place-copy">
            <strong>MTE 305 · Control Systems</strong>
            <span>13:00–15:00 · MTE Lab</span>
          </span>
          <time>13:00</time>
        </Link>
      </section>

      <section aria-labelledby="courses-heading" className="courses-section">
        <h2 id="courses-heading">My courses</h2>
        <p>Add your courses to keep your timetable handy.</p>
        <button className="outline-action" type="button">
          ADD A COURSE
        </button>
      </section>
    </main>
  );
}
