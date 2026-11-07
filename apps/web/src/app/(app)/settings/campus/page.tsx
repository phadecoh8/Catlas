import Link from "next/link";
import { ArrowLeft, Building2, ChevronRight } from "lucide-react";

export default function CampusPage() {
  return (
    <main className="app-screen information-screen campus-screen">
      <div className="detail-page-title">
        <Link aria-label="Back to settings" href="/settings"><ArrowLeft /></Link>
        <h1>My campus</h1>
      </div>
      <section className="campus-card">
        <span className="preference-icon blue"><Building2 aria-hidden="true" /></span>
        <div>
          <h2>Your campus</h2>
          <p>Campus details will appear here once your school is connected.</p>
        </div>
        <ChevronRight aria-hidden="true" />
      </section>
      <Link className="outline-action" href="/search">BROWSE CAMPUS PLACES</Link>
    </main>
  );
}
