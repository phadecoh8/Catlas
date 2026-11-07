import type { Metadata } from "next";
import Image from "next/image";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { LandingFooter } from "@/components/landing/landing-footer";
import { WaitlistForm } from "@/components/landing/waitlist-form";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export const metadata: Metadata = {
  title: "Join the waitlist | Catlas",
  description:
    "Tell us where you study so we can bring Catlas to your campus.",
};

export default function JoinPage() {
  return (
    <main>
      <header className="site-header">
        <a
          aria-label="Catlas home"
          className="brand"
          href="/"
        >
          <span className="brand-mark">
            <Image
              alt=""
              className="brand-logo"
              height={31}
              src="/logo.png"
              width={31}
            />
          </span>
          <span>
            Catlas<span className="brand-period">.</span>
          </span>
        </a>

        <div className="header-actions">
          <ThemeToggle />
          <a
            className="text-link join-back-link"
            href="/"
          >
            <ArrowLeft size={15} />
            Back to home
          </a>
        </div>
      </header>

      <section className="join-page-section">
        <div className="join-glow" />
        <div className="join-form-card">
          <span className="eyebrow">EARLY ACCESS</span>
          <h1>Join the Catlas waitlist</h1>
          <p className="join-card-intro">
            Tell us where you study so we can bring Catlas to your campus.
          </p>

          <WaitlistForm />

          <span className="join-note">
            <ShieldCheck size={14} />
            No spam. Just the occasional campus update.
          </span>
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}
