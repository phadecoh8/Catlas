"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { CatlasLogo } from "@/components/layout/logo";
import { SchoolPicker } from "@/components/auth/school-picker";

type SignupResponse = {
  error?: string;
  message?: string;
};

export function SignupForm() {
  const router = useRouter();
  const [surname, setSurname] = useState("");
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [level, setLevel] = useState("");
  const [jambRegNo, setJambRegNo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          surname,
          firstName,
          phone,
          schoolId,
          facultyId,
          departmentId,
          level: Number(level),
          jambRegNo: jambRegNo || undefined,
          email,
          password,
          consent,
        }),
      });

      const result = (await response.json()) as SignupResponse;
      if (!response.ok) {
        setError(result.error || "We could not create the account.");
        return;
      }

      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch {
      setError("Account creation is unavailable right now. Try again shortly.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="admin-login-page auth-page">
      <section
        aria-labelledby="signup-heading"
        className="admin-login-card auth-card auth-signup-card"
      >
        <Link aria-label="Catlas home" className="admin-login-brand" href="/">
          <CatlasLogo className="admin-login-logo" />
          <span>Catlas</span>
        </Link>
        <p className="admin-login-eyebrow">STUDENT ACCOUNT</p>
        <h1 id="signup-heading">Create your account</h1>
        <p className="admin-login-description">
          Add your details to get campus updates for your department.
        </p>
        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="auth-name-fields">
            <label className="admin-login-field" htmlFor="signup-first-name">
              First name
              <input
                autoComplete="given-name"
                id="signup-first-name"
                onChange={(event) => setFirstName(event.target.value)}
                required
                value={firstName}
              />
            </label>
            <label className="admin-login-field" htmlFor="signup-surname">
              Surname
              <input
                autoComplete="family-name"
                id="signup-surname"
                onChange={(event) => setSurname(event.target.value)}
                required
                value={surname}
              />
            </label>
          </div>
          <label className="admin-login-field" htmlFor="signup-phone">
            Phone number
            <input
              autoComplete="tel"
              id="signup-phone"
              onChange={(event) => setPhone(event.target.value)}
              required
              type="tel"
              value={phone}
            />
          </label>
          <SchoolPicker
            departmentId={departmentId}
            facultyId={facultyId}
            onDepartmentChange={setDepartmentId}
            onFacultyChange={setFacultyId}
            onSchoolChange={(value) => {
              setSchoolId(value);
              setFacultyId("");
              setDepartmentId("");
            }}
            schoolId={schoolId}
          />
          <label className="admin-login-field" htmlFor="signup-level">
            Current level
            <select
              id="signup-level"
              onChange={(event) => setLevel(event.target.value)}
              required
              value={level}
            >
              <option value="">Choose your level</option>
              {[100, 200, 300, 400, 500, 600, 700, 800].map((item) => (
                <option key={item} value={item}>{item} level</option>
              ))}
            </select>
          </label>
          <label className="admin-login-field" htmlFor="signup-jamb">
            JAMB registration number
            <input
              autoComplete="off"
              id="signup-jamb"
              onChange={(event) => setJambRegNo(event.target.value)}
              value={jambRegNo}
            />
          </label>
          <label className="admin-login-field" htmlFor="signup-email">
            Email address
            <input
              autoComplete="email"
              id="signup-email"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </label>
          <label className="admin-login-field" htmlFor="signup-password">
            Password
            <input
              autoComplete="new-password"
              id="signup-password"
              minLength={12}
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
            <span className="auth-field-help">Use at least 12 characters.</span>
          </label>
          <label className="auth-consent" htmlFor="signup-consent">
            <input
              checked={consent}
              id="signup-consent"
              onChange={(event) => setConsent(event.target.checked)}
              required
              type="checkbox"
            />
            <span>
              I agree to the <Link href="/privacy-policy">Privacy Policy</Link>
              {" and "}
              <Link href="/terms-of-service">Terms of Service</Link>.
            </span>
          </label>
          {error ? (
            <p className="admin-login-error" role="alert">{error}</p>
          ) : null}
          <button
            className="admin-login-submit"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>
        <p className="auth-form-note">
          Already have an account? <Link href="/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
}
