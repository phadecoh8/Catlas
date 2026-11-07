"use client";

import {
  type FormEvent,
  useId,
  useRef,
  useState,
} from "react";

type SubmissionState = "idle" | "submitting" | "success" | "error";

const LEVELS = [100, 200, 300, 400, 500, 600];

export function WaitlistForm() {
  const [submissionState, setSubmissionState] = useState<SubmissionState>(
    "idle",
  );
  const [message, setMessage] = useState("");
  const formStartedAt = useRef(Date.now());
  const formId = useId();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmissionState("submitting");
    setMessage("");

    const formElement = event.currentTarget;
    const formData = new FormData(formElement);
    const payload = {
      name: formData.get("name"),
      school: formData.get("school"),
      faculty: formData.get("faculty"),
      department: formData.get("department"),
      level: formData.get("level"),
      email: formData.get("email"),
      consent: formData.get("consent") === "on",
      website: formData.get("website"),
      startedAt: formStartedAt.current,
    };

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as {
        message?: string;
      };

      if (!response.ok) {
        setSubmissionState("error");
        setMessage(result.message ?? "We could not submit your request.");
        return;
      }

      setSubmissionState("success");
      setMessage(result.message ?? "You are on the list.");
      formElement.reset();
    } catch {
      setSubmissionState("error");
      setMessage("We could not submit your request. Please try again.");
    }
  }

  return (
    <form
      className="waitlist-form"
      onSubmit={handleSubmit}
    >
      <label
        className="waitlist-field"
        htmlFor={`${formId}-name`}
      >
        <span className="waitlist-label">Name</span>
        <input
          autoComplete="name"
          id={`${formId}-name`}
          name="name"
          placeholder="Your full name"
          required
        />
      </label>

      <label
        className="waitlist-field"
        htmlFor={`${formId}-school`}
      >
        <span className="waitlist-label">School</span>
        <input
          autoComplete="organization"
          id={`${formId}-school`}
          name="school"
          placeholder="University name"
          required
        />
      </label>

      <div className="waitlist-row">
        <label
          className="waitlist-field"
          htmlFor={`${formId}-faculty`}
        >
          <span className="waitlist-label">Faculty</span>
          <input
            id={`${formId}-faculty`}
            name="faculty"
            placeholder="e.g. Engineering"
            required
          />
        </label>

        <label
          className="waitlist-field"
          htmlFor={`${formId}-department`}
        >
          <span className="waitlist-label">Department</span>
          <input
            id={`${formId}-department`}
            name="department"
            placeholder="e.g. Mechatronics"
            required
          />
        </label>
      </div>

      <div className="waitlist-row">
        <label
          className="waitlist-field"
          htmlFor={`${formId}-level`}
        >
          <span className="waitlist-label">Level</span>
          <select
            defaultValue=""
            id={`${formId}-level`}
            name="level"
            required
          >
            <option
              disabled
              value=""
            >
              Select level
            </option>
            {LEVELS.map((level) => {
              return (
                <option
                  key={level}
                  value={level}
                >
                  {level} Level
                </option>
              );
            })}
          </select>
        </label>

        <label
          className="waitlist-field"
          htmlFor={`${formId}-email`}
        >
          <span className="waitlist-label">Email</span>
          <input
            autoComplete="email"
            id={`${formId}-email`}
            name="email"
            placeholder="you@example.com"
            required
            type="email"
          />
        </label>
      </div>

      <label className="waitlist-consent">
        <input
          name="consent"
          required
          type="checkbox"
        />
        <span>
          I agree to the <a href="/privacy-policy">Privacy Policy</a>
          {" and "}
          <a href="/terms-of-service">Terms of Service</a>.
        </span>
      </label>

      <label
        aria-hidden="true"
        className="waitlist-honeypot"
        htmlFor={`${formId}-website`}
      >
        Website
        <input
          autoComplete="off"
          id={`${formId}-website`}
          name="website"
          tabIndex={-1}
        />
      </label>

      {submissionState === "error" ? (
        <p
          className="waitlist-message error"
          role="alert"
        >
          {message}
        </p>
      ) : null}

      {submissionState === "success" ? (
        <p
          className="waitlist-message success"
          role="status"
        >
          {message}
        </p>
      ) : null}

      <button
        className="button waitlist-submit"
        disabled={submissionState === "submitting"}
        type="submit"
      >
        {submissionState === "submitting"
          ? "Submitting..."
          : "Join waitlist"}
      </button>
    </form>
  );
}
