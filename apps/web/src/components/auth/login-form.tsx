"use client";

import Link from "next/link";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { CatlasLogo } from "@/components/layout/logo";
import { recordImportantActivity } from "@/lib/site-activity";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const result = await signIn("student", {
        email,
        password,
        redirect: false,
      });

      if (!result?.ok) {
        setError(
          "Sign in failed. Check your email and password, and verify your email address.",
        );
        return;
      }

      const session = await getSession();
      recordImportantActivity("AUTH", "Student sign-in succeeded");
      router.replace(session?.redirectTo || "/home");
      router.refresh();
    } catch {
      setError("Sign in is unavailable right now. Try again shortly.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="admin-login-page">
      <section
        aria-labelledby="login-heading"
        className="admin-login-card auth-card"
      >
        <Link aria-label="Catlas home" className="admin-login-brand" href="/">
          <CatlasLogo className="admin-login-logo" />
          <span>Catlas</span>
        </Link>
        <p className="admin-login-eyebrow">STUDENT ACCOUNT</p>
        <h1 id="login-heading">Welcome back</h1>
        <p className="admin-login-description">
          Sign in to find your way around campus.
        </p>
        <form className="admin-login-form" onSubmit={handleSubmit}>
          <label className="admin-login-field" htmlFor="login-email">
            Email address
            <input
              autoComplete="email"
              id="login-email"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </label>
          <label className="admin-login-field" htmlFor="login-password">
            Password
            <input
              autoComplete="current-password"
              id="login-password"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>
          {error ? (
            <p className="admin-login-error" role="alert">{error}</p>
          ) : null}
          <button
            className="admin-login-submit"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="auth-form-note">
          Need an account? <Link href="/signup">Create one</Link>
        </p>
        <Link className="admin-login-back" href="/admin/login">
          Admin sign in
        </Link>
      </section>
    </main>
  );
}
