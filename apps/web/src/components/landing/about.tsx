import {
  BookOpen,
  Building2,
  Check,
  MapPin,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export function About() {
  return (
    <section
      className="about-section"
      id="about"
    >
      <div className="about-art">
        <span className="about-ripple ripple-a" aria-hidden="true" />
        <span className="about-ripple ripple-b" aria-hidden="true" />
        <span className="about-ripple ripple-c" aria-hidden="true" />
        <div className="about-ring ring-one" />
        <div className="about-ring ring-two" />
        <div className="about-center">
          <Building2 size={36} />
          <span>YOUR CAMPUS</span>
        </div>
        <span className="about-node node-one">
          <BookOpen size={16} />
        </span>
        <span className="about-node node-two">
          <MapPin size={16} />
        </span>
        <span className="about-node node-three">
          <Sparkles size={16} />
        </span>
      </div>
      <div className="about-copy">
        <span className="eyebrow">MADE FOR CAMPUS LIFE</span>
        <h2>
          More than a map.
          <br />
          <em>A campus companion.</em>
        </h2>
        <p>
          From your first lecture to your last stop of the day, Catlas helps
          students and visitors move around campus with confidence.
        </p>
        <ul className="about-list">
          <li>
            <span><Check size={13} /></span>
            Find buildings, rooms and campus landmarks
          </li>
          <li>
            <span><Check size={13} /></span>
            See what is inside before you set off
          </li>
          <li>
            <span><Check size={13} /></span>
            Keep up with class updates and deadlines
          </li>
        </ul>
        <Link
          className="text-link about-link"
          href="/join"
        >
          Be part of what&apos;s next <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
