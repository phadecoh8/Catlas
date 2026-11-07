import Link from "next/link";
import { redirect } from "next/navigation";

export default function AdminPreviewPage() {
  if (process.env.NODE_ENV !== "development") {
    redirect("/admin/login");
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <p className="admin-login-eyebrow">DEVELOPMENT PREVIEW</p>
        <h1>Admin dashboard previews</h1>
        <p className="admin-login-description">
          Open any dashboard to review its current layout without signing in.
        </p>
        <nav aria-label="Admin dashboard previews">
          <ul className="grid gap-3">
            <li>
              <Link className="admin-login-submit" href="/admin/founder">
                Founder
              </Link>
            </li>
            <li>
              <Link className="admin-login-submit" href="/admin/vc">
                Vice-Chancellor
              </Link>
            </li>
            <li>
              <Link className="admin-login-submit" href="/admin/dean">
                Dean
              </Link>
            </li>
            <li>
              <Link className="admin-login-submit" href="/admin/department">
                Department HOD / committee
              </Link>
            </li>
            <li>
              <Link className="admin-login-submit" href="/admin/governor">
                Class governor
              </Link>
            </li>
          </ul>
        </nav>
        <p className="admin-login-description">
          This preview is available only while running the development server.
        </p>
      </section>
    </main>
  );
}
