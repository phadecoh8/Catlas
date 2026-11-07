import Image from "next/image";
import Link from "next/link";
import { ScrollLink } from "@/components/landing/scroll-link";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function LandingHeader() {
  return (
    <header className="site-header">
      <ScrollLink
        aria-label="Catlas home"
        className="brand"
        targetId="top"
      >
        <span className="brand-mark">
          <Image
            alt=""
            className="brand-logo"
            height={31}
            priority
            src="/logo.png"
            width={31}
          />
        </span>
        <span>
          Catlas<span className="brand-period">.</span>
        </span>
      </ScrollLink>

      <nav
        aria-label="Main navigation"
        className="header-links"
      >
        <ScrollLink targetId="how-it-works">
          How it works
        </ScrollLink>
        <ScrollLink targetId="about">
          About
        </ScrollLink>
        <ScrollLink targetId="faq">
          FAQ
        </ScrollLink>
      </nav>

      <div className="header-actions">
        <ThemeToggle />
        <Link
          className="button button-small"
          href="/join"
        >
          Join the waitlist
        </Link>
      </div>
    </header>
  );
}
