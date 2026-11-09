import Link from "next/link";
import {
  Accessibility,
  Bell,
  BookOpen,
  Building2,
  ChevronRight,
  CircleHelp,
  Download,
  UserRoundPlus,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { SignOutButton } from "@/components/auth/sign-out-button";

function PreferenceRow({
  Icon,
  label,
  description,
  checked,
  color,
}: {
  Icon: LucideIcon;
  label: string;
  description: string;
  checked: boolean;
  color: string;
}) {
  return (
    <label className="preference-row">
      <span className={`preference-icon ${color}`}><Icon aria-hidden="true" /></span>
      <span className="preference-copy">
        <strong>{label}</strong>
        <span>{description}</span>
      </span>
      <input defaultChecked={checked} type="checkbox" />
    </label>
  );
}

function SettingsLink({
  Icon,
  title,
  description,
  href,
  color,
}: {
  Icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  color: string;
}) {
  return (
    <Link className="settings-link-row" href={href}>
      <span className={`preference-icon ${color}`}><Icon aria-hidden="true" /></span>
      <span className="preference-copy">
        <strong>{title}</strong>
        <span>{description}</span>
      </span>
      <ChevronRight aria-hidden="true" className="settings-chevron" />
    </Link>
  );
}

export default function SettingsPage() {
  return (
    <main className="app-screen settings-screen">
      <h1 className="route-heading">Settings</h1>

      <section aria-labelledby="preferences-heading" className="settings-section">
        <h2 id="preferences-heading">Preferences</h2>
        <div className="preference-list">
          <ThemeToggle variant="settings" />
          <PreferenceRow
            checked
            color="blue"
            description="20 minutes before your class"
            Icon={Bell}
            label="Class reminders"
          />
          <PreferenceRow
            checked={false}
            color="ash"
            description="Prefer accessible paths"
            Icon={Accessibility}
            label="Step-free routes"
          />
          <Link
            className="settings-link-row account-preference-row"
            href="/settings/account"
          >
            <span className="preference-icon blue">
              <UserRound aria-hidden="true" />
            </span>
            <span className="preference-copy">
              <strong>Account</strong>
              <span>Manage your account details</span>
            </span>
            <ChevronRight
              aria-hidden="true"
              className="settings-chevron"
            />
          </Link>
        </div>
      </section>

      <section aria-labelledby="campus-support-heading" className="settings-section">
        <h2 id="campus-support-heading">Campus &amp; support</h2>
        <div className="settings-link-list">
          <SettingsLink
            color="blue"
            description="Your school campus"
            href="/settings/campus"
            Icon={Building2}
            title="My campus"
          />
          <SettingsLink
            color="ash"
            description="Campus places saved on this device"
            href="/bookmarks"
            Icon={Download}
            title="Offline campus map"
          />
          <SettingsLink
            color="orange"
            description="Get help using Catlas"
            href="/help"
            Icon={CircleHelp}
            title="Help"
          />
          <SettingsLink
            color="purple"
            description="Learn about Catlas"
            href="/settings/about"
            Icon={BookOpen}
            title="About Catlas"
          />
          <SettingsLink
            color="blue"
            description="Send feedback to your school"
            href="/settings/feedback"
            Icon={CircleHelp}
            title="Feedback"
          />
          <SettingsLink
            color="purple"
            description="Meet the founder and find their links"
            href="/settings/founder"
            Icon={UserRoundPlus}
            title="Founder"
          />
        </div>
      </section>

      <div className="settings-meta">
        <span>CNS · Campus Navigation System</span>
        <span>v1.0</span>
      </div>
      <div className="settings-legal-links">
        <Link href="/settings/privacy-policy">Privacy policy</Link>
        <Link href="/settings/terms-of-service">Terms of service</Link>
        <SignOutButton />
      </div>

    </main>
  );
}
