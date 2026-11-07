"use client";

import { useState } from "react";
import { Check, SlidersHorizontal, X } from "lucide-react";

export function SearchFilters() {
  const [open, setOpen] = useState(false);
  const [placeType, setPlaceType] = useState("All places");
  const [distance, setDistance] = useState("Any");
  const [openNow, setOpenNow] = useState(false);
  const [stepFree, setStepFree] = useState(true);

  const placeTypes = [
    "All places",
    "Buildings",
    "Classrooms",
    "Libraries",
    "Labs",
  ];
  const distances = ["Any", "5 min", "10 min"];

  return (
    <>
      <button
        aria-label="Open search filters"
        className="search-filter-trigger"
        onClick={() => setOpen(true)}
        type="button"
      >
        <SlidersHorizontal aria-hidden="true" />
      </button>
      {open && (
        <div
          className="filter-overlay"
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <section
            aria-labelledby="filter-heading"
            aria-modal="true"
            className="filter-sheet"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="sheet-handle" />
            <header className="filter-header">
              <h2 id="filter-heading">Search filters</h2>
              <button
                aria-label="Close filters"
                onClick={() => setOpen(false)}
                type="button"
              >
                <X />
              </button>
            </header>

            <fieldset className="filter-group">
              <legend>Place type</legend>
              <div className="filter-options">
                {placeTypes.map((option) => (
                  <button
                    aria-pressed={placeType === option}
                    className={`filter-chip${placeType === option ? " selected" : ""}`}
                    key={option}
                    onClick={() => setPlaceType(option)}
                    type="button"
                  >
                    {placeType === option && <Check aria-hidden="true" />}
                    {option}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="filter-group">
              <legend>Walking distance</legend>
              <div className="filter-options">
                {distances.map((option) => (
                  <button
                    aria-pressed={distance === option}
                    className={`filter-chip${distance === option ? " selected" : ""}`}
                    key={option}
                    onClick={() => setDistance(option)}
                    type="button"
                  >
                    {distance === option && <Check aria-hidden="true" />}
                    {option}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="filter-toggles">
              <label className="filter-toggle">
                <span>Open now</span>
                <input
                  checked={openNow}
                  onChange={(event) => setOpenNow(event.target.checked)}
                  type="checkbox"
                />
              </label>
              <label className="filter-toggle">
                <span>Step-free access</span>
                <input
                  checked={stepFree}
                  onChange={(event) => setStepFree(event.target.checked)}
                  type="checkbox"
                />
              </label>
              <p>Only show places with an accessible entrance.</p>
            </div>

            <div className="filter-actions">
              <button
                className="filter-apply"
                onClick={() => setOpen(false)}
                type="button"
              >
                SHOW 4 PLACES
              </button>
              <button
                className="filter-reset"
                onClick={() => {
                  setPlaceType("All places");
                  setDistance("Any");
                  setOpenNow(false);
                  setStepFree(true);
                }}
                type="button"
              >
                RESET FILTERS
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
