import Link from "next/link";
import {
  ArrowLeft,
  BriefcaseBusiness,
} from "lucide-react";

const socialLinks = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    Icon: InstagramIcon,
  },
  {
    label: "GitHub",
    href: "https://github.com/phadecoh",
    Icon: GithubIcon,
  },
  {
    label: "X",
    href: "https://x.com",
    Icon: XIcon,
  },
  {
    label: "Portfolio",
    href: "https://phadecoh.vercel.app",
    Icon: BriefcaseBusiness,
  },
];

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <rect
        height="17"
        rx="5"
        stroke="currentColor"
        strokeWidth="2"
        width="17"
        x="3.5"
        y="3.5"
      />
      <circle
        cx="12"
        cy="12"
        r="4"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="17.5" cy="6.5" fill="currentColor" r="1.2" />
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.76-.24.76-.54v-2.1c-3.1.68-3.76-1.32-3.76-1.32-.51-1.3-1.24-1.65-1.24-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 1.72 2.62 1.23 3.26.94.1-.73.39-1.23.71-1.51-2.48-.28-5.09-1.24-5.09-5.53 0-1.22.44-2.22 1.16-3-.12-.28-.5-1.42.11-2.96 0 0 .95-.3 3.08 1.15a10.7 10.7 0 0 1 5.6 0c2.13-1.45 3.08-1.15 3.08-1.15.61 1.54.23 2.68.11 2.96.72.78 1.16 1.78 1.16 3 0 4.3-2.62 5.25-5.11 5.52.4.35.76 1.03.76 2.08v3.1c0 .3.2.65.77.54A11.2 11.2 0 0 0 12 .8Z" />
    </svg>
  );
}

export default function FounderPage() {
  return (
    <main className="app-screen information-screen founder-screen">
      <div className="detail-page-title">
        <Link aria-label="Back to settings" href="/settings">
          <ArrowLeft aria-hidden="true" />
        </Link>
        <h1>Founder</h1>
      </div>

      <p className="founder-intro">Connect with Fadero Joshua.</p>
      <div aria-label="Founder social links" className="founder-social-list">
        {socialLinks.map(({ label, href, Icon }) => (
          <a
            className="founder-social-link"
            href={href}
            key={label}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Icon aria-hidden="true" className="founder-social-icon" />
            <span>{label}</span>
          </a>
        ))}
      </div>
    </main>
  );
}
