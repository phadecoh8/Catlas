import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  ClipboardList,
  Megaphone,
  Presentation,
  type LucideIcon,
} from "lucide-react";

const notifications: {
  title: string;
  description: string;
  time: string;
  href: string;
  Icon: LucideIcon;
  unread: boolean;
}[] = [
  {
    title: "Class moved",
    description: "MTE 301 is now in Room B12, Block B.",
    time: "5 min ago",
    href: "/classroom/mte-301",
    Icon: Presentation,
    unread: true,
  },
  {
    title: "New announcement",
    description: "A message from the Dean of Engineering.",
    time: "25 min ago",
    href: "/announcements",
    Icon: Megaphone,
    unread: true,
  },
  {
    title: "Assignment due tomorrow",
    description: "MTE 305 · Control Systems",
    time: "Yesterday · 4:30 pm",
    href: "/classroom",
    Icon: ClipboardList,
    unread: false,
  },
];

export default function NotificationsPage() {
  const unreadCount = notifications.filter(
    (notification) => notification.unread,
  ).length;

  return (
    <main className="app-screen information-screen notifications-page">
      <div className="detail-page-title">
        <Link aria-label="Back to home" href="/home">
          <ArrowLeft aria-hidden="true" />
        </Link>
        <h1>Notifications</h1>
      </div>

      <section aria-labelledby="notifications-heading">
        <div className="notifications-section-heading">
          <h2 id="notifications-heading">Updates for you</h2>
          <span>{unreadCount} UNREAD</span>
        </div>
        <div className="notification-list">
          {notifications.map((notification) => (
            <Link
              className="notification-row"
              href={notification.href}
              key={notification.title}
            >
              <span className="notification-icon">
                <notification.Icon aria-hidden="true" />
              </span>
              <span className="notification-copy">
                <strong>{notification.title}</strong>
                <span>{notification.description}</span>
              </span>
              <ChevronRight
                aria-hidden="true"
                className="notification-chevron"
              />
              <time className="notification-time">
                {notification.time}
              </time>
              {notification.unread ? (
                <span
                  aria-label="Unread"
                  className="notification-unread-dot"
                />
              ) : null}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
