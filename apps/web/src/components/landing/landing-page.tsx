import {
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

import { About } from "@/components/landing/about";
import { Faq } from "@/components/landing/faq";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHeader } from "@/components/landing/landing-header";
import { MapAnimation } from "@/components/landing/map-animation";

export function LandingPage() {
  return (
    <main>
      <LandingHeader />
      <Hero />

      <section
        className="route-section"
        id="route-demo"
      >
        <div className="section-heading route-heading">
          <span className="eyebrow">YOUR CAMPUS, IN MOTION</span>
          <h2>
            From &quot;where is it?&quot;
            <br />
            <em>to &quot;I&apos;m here.&quot;</em>
          </h2>
          <p>
            One simple route. A live sense of direction. A clear arrival,
            right on your phone.
          </p>
        </div>
        <MapAnimation />
        <p className="route-caption">
          <span className="route-caption-line" />
          Pick a place. Follow the red trail. Arrive.
        </p>
      </section>

      <HowItWorks />
      <About />
      <Faq />

      <section
        className="join-section"
        id="join"
      >
        <div className="join-glow" />
        <span className="eyebrow">THE JOURNEY STARTS HERE</span>
        <h2>
          Your campus is waiting.
          <br />
          <em>Let&apos;s find it together.</em>
        </h2>
        <p>Get updates as Catlas gets ready to guide you around campus.</p>
        <Link
          className="button join-button"
          href="/join"
        >
          Request early access
          <ArrowRight aria-hidden="true" size={17} />
        </Link>
        <span className="join-note">
          <ShieldCheck size={14} />
          No spam. Just the occasional campus update.
        </span>
      </section>

      <LandingFooter />
    </main>
  );
}
