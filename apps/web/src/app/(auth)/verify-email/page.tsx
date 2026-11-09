import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <main className="admin-login-page">
      <section
        aria-labelledby="verify-email-heading"
        className="admin-login-card"
      >
        <p className="admin-login-eyebrow">EMAIL VERIFICATION</p>
        <h1 id="verify-email-heading">Check your inbox</h1>
        <p className="admin-login-description">
          Use the verification link we emailed you. After your email is
          verified, sign in to continue.
        </p>
        <Link className="admin-login-submit auth-verify-link" href="/login">
          Go to sign in
        </Link>
      </section>
    </main>
  );
}
