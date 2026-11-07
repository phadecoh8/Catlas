import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  FlaskConical,
} from "lucide-react";

const facultyLabs: Record<
  string,
  {
    title: string;
    labs: { name: string; href: string }[];
  }
> = {
  engineering: {
    title: "Faculty of Engineering Labs",
    labs: [{ name: "MTE Lab", href: "/location/mte-lab" }],
  },
  ciesa: {
    title: "Faculty of CIESA Labs",
    labs: [],
  },
};

export default async function FacultyLabsPage({
  params,
}: {
  params: Promise<{ faculty: string }>;
}) {
  const { faculty } = await params;
  const facultyContent = facultyLabs[faculty];
  const title = facultyContent?.title ?? "Faculty labs";
  const labs = facultyContent?.labs ?? [];

  return (
    <main className="app-screen information-screen">
      <div className="detail-page-title">
        <Link aria-label="Back to labs" href="/labs">
          <ArrowLeft />
        </Link>
        <h1>{title}</h1>
      </div>
      {labs.length > 0 ? (
        <section aria-label={title} className="settings-section">
          {labs.map(({ name, href }) => (
            <Link className="settings-link-row" href={href} key={href}>
              <span className="preference-icon orange">
                <FlaskConical aria-hidden="true" />
              </span>
              <span className="preference-copy">
                <strong>{name}</strong>
                <span>View building details</span>
              </span>
              <ChevronRight
                aria-hidden="true"
                className="settings-chevron"
              />
            </Link>
          ))}
        </section>
      ) : (
        <section className="about-intro">
          <h2>No labs listed yet</h2>
          <p>Lab details for this faculty will be added when provided.</p>
        </section>
      )}
    </main>
  );
}
