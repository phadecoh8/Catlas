import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  FlaskConical,
} from "lucide-react";

const faculties = [
  {
    title: "Faculty of Engineering Labs",
    href: "/labs/engineering",
  },
  {
    title: "Faculty of CIESA Labs",
    href: "/labs/ciesa",
  },
];

export default function LabsPage() {
  return (
    <main className="app-screen information-screen">
      <div className="detail-page-title">
        <Link aria-label="Back to home" href="/home">
          <ArrowLeft />
        </Link>
        <h1>Labs</h1>
      </div>
      <section aria-label="Labs by faculty" className="settings-section">
        {faculties.map(({ title, href }) => (
          <Link className="settings-link-row" href={href} key={href}>
            <span className="preference-icon orange">
              <FlaskConical aria-hidden="true" />
            </span>
            <span className="preference-copy">
              <strong>{title}</strong>
              <span>Browse laboratories in this faculty</span>
            </span>
            <ChevronRight
              aria-hidden="true"
              className="settings-chevron"
            />
          </Link>
        ))}
      </section>
    </main>
  );
}
