"use client";

import { useState } from "react";
import {
  Flag,
  X,
} from "lucide-react";

const problemTypes = [
  { value: "wrong_location", label: "Wrong location" },
  { value: "wrong_photo", label: "Wrong photo" },
  { value: "wrong_details", label: "Wrong office or room details" },
  { value: "app_bug", label: "App bug" },
  { value: "other", label: "Other" },
];

export function ReportProblemDialog({
  locationId,
}: {
  locationId: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="report-problem-trigger"
        onClick={() => setOpen(true)}
        type="button"
      >
        <Flag aria-hidden="true" />
        REPORT A PROBLEM
      </button>

      {open ? (
        <div
          className="report-problem-overlay"
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <section
            aria-labelledby="report-problem-heading"
            aria-modal="true"
            className="report-problem-sheet"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="sheet-handle" />
            <header className="report-problem-header">
              <h2 id="report-problem-heading">Report a problem</h2>
              <button
                aria-label="Close report form"
                onClick={() => setOpen(false)}
                type="button"
              >
                <X aria-hidden="true" />
              </button>
            </header>

            <form action="/api/v1/reports" method="post">
              <input name="location_id" type="hidden" value={locationId} />
              <fieldset className="report-problem-options">
                <legend className="sr-only">Problem type</legend>
                {problemTypes.map(({ value, label }) => (
                  <label className="report-problem-option" key={value}>
                    <span>{label}</span>
                    <input
                      name="type"
                      required
                      type="radio"
                      value={value}
                    />
                  </label>
                ))}
              </fieldset>
              <label className="sr-only" htmlFor="report-problem-note">
                Tell us what is wrong
              </label>
              <textarea
                id="report-problem-note"
                maxLength={1000}
                name="note"
                placeholder="Tell us what is wrong"
                rows={3}
              />
              <button className="primary-action" type="submit">
                Send
              </button>
            </form>
          </section>
        </div>
      ) : null}
    </>
  );
}
