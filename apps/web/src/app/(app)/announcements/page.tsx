import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const announcements = [
  {
    title: "Faculty town hall",
    author: "Dean, Faculty of Engineering",
    date: "05 Nov 2026",
    paragraphs: [
      "Join us on Friday to discuss faculty plans",
      "and share your ideas for the semester.",
    ],
  },
  {
    title: "Lab access update",
    author: "Dean, Faculty of Engineering",
    date: "04 Nov 2026",
    paragraphs: [
      "The Mechatronics Lab will close at 4 pm.",
      "Normal opening hours resume on Monday.",
    ],
  },
  {
    title: "Course registration",
    author: "Dean, Faculty of Engineering",
    date: "03 Nov 2026",
    paragraphs: [
      "Complete your course registration this week.",
      "Visit your adviser if you need assistance.",
    ],
  },
];

export default function AnnouncementsPage() {
  return (
    <main className="app-screen information-screen announcements-page">
      <div className="detail-page-title">
        <Link aria-label="Back to home" href="/home">
          <ArrowLeft aria-hidden="true" />
        </Link>
        <h1>Announcements</h1>
      </div>

      <p className="announcements-subtitle">The latest from your faculty</p>

      <section aria-label="Faculty announcements" className="announcement-list">
        {announcements.map((announcement) => (
          <article
            className="announcement-card"
            key={announcement.title}
          >
            <h2>{announcement.title}</h2>
            <p className="announcement-author">{announcement.author}</p>
            <time className="announcement-date">
              {announcement.date}
            </time>
            <div className="announcement-copy">
              {announcement.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
