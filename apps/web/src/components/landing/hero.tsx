import {
  ArrowDown,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { HeroCountdown } from "@/components/landing/hero-countdown";
import { ScrollLink } from "@/components/landing/scroll-link";
import { HeroAnimation } from "@/components/landing/hero-animation";

export function Hero() {
  return (
    <section className="hero-section" id="top">
      <div className="hero-grid" />
      <div className="hero-content">
        <span className="eyebrow">
          <span className="pulse-dot" /> CAMPUS, WITHOUT THE GUESSWORK
        </span>
        <h1>
          Find your place.
          <br />
          <em>Find your way.</em>
        </h1>
        <p className="hero-copy">
          The campus guide that takes you from searching for a place to
          walking right through its doors.
        </p>
        <div className="hero-actions">
          <Link
            className="button"
            href="/join"
          >
            Get early access
            <ArrowRight aria-hidden="true" size={17} />
          </Link>
          <ScrollLink
            className="text-link"
            targetId="route-demo"
          >
            <span className="play-dot">
              <ArrowDown size={14} />
            </span>
            See how it works
          </ScrollLink>
        </div>
        <HeroCountdown />
        <div className="hero-proof">
          <span className="proof-icon">
            <ShieldCheck size={16} />
          </span>
          <span>Built for the wayfinding needs of African campuses</span>
        </div>
      </div>

      <HeroAnimation />

      <ScrollLink
        aria-label="Scroll to route demo"
        className="scroll-hint"
        targetId="route-demo"
      >
        <span /> SCROLL TO EXPLORE
      </ScrollLink>
    </section>
  );
}
