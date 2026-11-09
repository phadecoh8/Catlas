import Link from "next/link";
import { ArrowLeft, MapPin, Search, Waypoints } from "lucide-react";
import { CatlasLogo } from "@/components/layout/logo";

const steps = [
  {
    title: "Search",
    description: "Find campus buildings, rooms and landmarks.",
    Icon: Search,
  },
  {
    title: "Navigate",
    description: "Follow a walking route to your destination.",
    Icon: Waypoints,
  },
  {
    title: "Arrive",
    description: "See building details and what is inside.",
    Icon: MapPin,
  },
];

export default function AboutPage() {
  return (
    <main className="app-screen information-screen">
      <div className="detail-page-title">
        <Link aria-label="Back to settings" href="/settings"><ArrowLeft /></Link>
        <h1>About Catlas</h1>
      </div>
      <div className="about-brand">
        <CatlasLogo className="about-brand-logo" />
        <p>Campus Navigation System</p>
      </div>
      <section className="about-intro">
        <h2>Find your way around campus.</h2>
        <p>
          Catlas helps students and visitors find campus locations, see what is
          inside, and follow a walking route to get there.
        </p>
      </section>
      <section aria-labelledby="about-steps-heading" className="about-steps">
        <h2 id="about-steps-heading">How Catlas works</h2>
        {steps.map(({ title, description, Icon }) => (
          <article className="about-step" key={title}>
            <span><Icon aria-hidden="true" /></span>
            <div><h3>{title}</h3><p>{description}</p></div>
          </article>
        ))}
      </section>
      <section className="about-footer">
        <p>Catlas · Version 1.0</p>
        <Link href="/settings/feedback">Send feedback</Link>
      </section>
    </main>
  );
}
