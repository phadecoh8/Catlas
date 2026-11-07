import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function FeedbackPage() {
  return (
    <main className="app-screen information-screen feedback-screen">
      <div className="detail-page-title">
        <Link aria-label="Back to settings" href="/settings">
          <ArrowLeft aria-hidden="true" />
        </Link>
        <h1>Feedback</h1>
      </div>

      <p className="feedback-recipient">Your feedback goes to your school</p>
      <p className="feedback-description">
        Help make campus life better. Tell us what is working and what could
        improve.
      </p>

      <form action="/api/v1/feedback" className="feedback-form" method="post">
        <label className="sr-only" htmlFor="feedback-message">
          Share your feedback
        </label>
        <textarea
          id="feedback-message"
          maxLength={2000}
          name="message"
          placeholder="Share your feedback..."
          required
          rows={6}
        />
        <button className="primary-action" type="submit">
          Send feedback
        </button>
      </form>
    </main>
  );
}
