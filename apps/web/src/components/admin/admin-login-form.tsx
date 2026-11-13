"use client";

import { getSession, signIn } from "next-auth/react";
import { useState, type FormEvent } from "react";
import { CatlasLogo } from "@/components/layout/logo";
import { recordImportantActivity } from "@/lib/site-activity";

type LoginResult = {
  message?: string;
  requiresTwoFactor?: boolean;
  challengeToken?: string;
  redirectTo?: string;
};

export function AdminLoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTwoFactorStep, setIsTwoFactorStep] = useState(false);
  const [challengeToken, setChallengeToken] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);
    try {
      let credentials: Record<string, string>;

      if (isTwoFactorStep) {
        credentials = {
          challengeToken,
          code: String(formData.get("code") ?? ""),
        };
      } else {
        const email = String(formData.get("email") ?? "");
        const password = String(formData.get("password") ?? "");
        const challengeResponse = await fetch("/api/admin/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
        const challengeResult =
          (await challengeResponse.json()) as LoginResult;

        if (!challengeResponse.ok) {
          setErrorMessage(
            challengeResult.message ?? "Sign-in failed. Please try again.",
          );
          return;
        }

        if (
          challengeResult.requiresTwoFactor &&
          challengeResult.challengeToken
        ) {
          setChallengeToken(challengeResult.challengeToken);
          setIsTwoFactorStep(true);
          return;
        }

        credentials = { email, password };
      }

      const result = await signIn("credentials", {
        ...credentials,
        redirect: false,
      });

      if (!result || result.error) {
        setErrorMessage("The email, password, or code is incorrect.");
        return;
      }

      const session = await getSession();
      const role = session?.user?.role;
      recordImportantActivity(
        "AUTH",
        role ? `Admin sign-in succeeded · role=${role}` : "Admin sign-in succeeded",
      );

      if (session?.redirectTo) {
        window.location.assign(session.redirectTo);
        return;
      }

      setErrorMessage("Sign-in could not be completed. Please try again.");
    } catch {
      setErrorMessage(
        "Admin sign-in is temporarily unavailable. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="admin-login-page">
      <section
        aria-labelledby="admin-login-heading"
        className="admin-login-card"
      >
        <a aria-label="Catlas home" className="admin-login-brand" href="/">
          <CatlasLogo className="admin-login-logo" />
          <span>Catlas</span>
        </a>

        <p className="admin-login-eyebrow">ADMINISTRATION</p>
        <h1 id="admin-login-heading">
          {isTwoFactorStep ? "Verify it’s you" : "Welcome back"}
        </h1>
        <p className="admin-login-description">
          {isTwoFactorStep
            ? "Enter the code from your authenticator app or a backup code."
            : "Sign in with your assigned admin email and password."}
        </p>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          {isTwoFactorStep ? (
            <label className="admin-login-field" htmlFor="admin-code">
              <span>Authenticator or backup code</span>
              <input
                autoComplete="one-time-code"
                autoFocus
                id="admin-code"
                inputMode="numeric"
                name="code"
                required
              />
            </label>
          ) : (
            <>
              <label className="admin-login-field" htmlFor="admin-email">
                <span>Email</span>
                <input
                  autoComplete="username"
                  autoFocus
                  id="admin-email"
                  name="email"
                  required
                  type="email"
                />
              </label>

              <label className="admin-login-field" htmlFor="admin-password">
                <span>Password</span>
                <input
                  autoComplete="current-password"
                  id="admin-password"
                  name="password"
                  required
                  type="password"
                />
              </label>
            </>
          )}

          {errorMessage ? (
            <p className="admin-login-error" role="alert">
              {errorMessage}
            </p>
          ) : null}

          <button
            className="admin-login-submit"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting
              ? "Signing in..."
              : isTwoFactorStep
                ? "Verify and continue"
                : "Sign in"}
          </button>
        </form>

        {isTwoFactorStep ? (
          <button
            className="admin-login-back"
            onClick={() => {
              setChallengeToken("");
              setIsTwoFactorStep(false);
              setErrorMessage("");
            }}
            type="button"
          >
            Back to email and password
          </button>
        ) : null}
      </section>
    </main>
  );
}
