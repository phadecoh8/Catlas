"use client";

import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import Link from "next/link";
import {
  BookOpen,
  Bookmark,
  Building2,
  Check,
  ChevronRight,
  FlaskConical,
  Presentation,
  Search as SearchIcon,
  type LucideIcon,
} from "lucide-react";
import { SearchFilters } from "@/components/search/search-filters";

type SearchPlace = {
  name: string;
  details: string;
  href: string;
  color: string;
  Icon: LucideIcon;
};

const places: SearchPlace[] = [
  {
    name: "Faculty of Engineering",
    details: "Faculty building · Engineering Road",
    href: "/location/faculty-engineering",
    color: "blue",
    Icon: Building2,
  },
  {
    name: "MTE Lab",
    details: "Laboratory · Engineering Annex",
    href: "/location/mte-lab",
    color: "orange",
    Icon: FlaskConical,
  },
  {
    name: "Engineering LT",
    details: "Lecture theatre · Ground floor",
    href: "/location/engineering-lt",
    color: "purple",
    Icon: Presentation,
  },
  {
    name: "MTE 301",
    details: "Course · Engineering Block B, B12",
    href: "/location/mte-301",
    color: "blue",
    Icon: BookOpen,
  },
  {
    name: "Central Library",
    details: "Library services",
    href: "/location/central-library",
    color: "purple",
    Icon: BookOpen,
  },
  {
    name: "Senate House",
    details: "Administration",
    href: "/location/senate-house",
    color: "blue",
    Icon: Building2,
  },
  {
    name: "Mechanical Workshop",
    details: "Faculty of Engineering",
    href: "/location/mte-lab",
    color: "orange",
    Icon: FlaskConical,
  },
];

const recentSearches = [
  {
    name: "Mechatronics Lab",
    details: "Faculty of Engineering",
    href: "/location/mte-lab",
  },
  {
    name: "Engineering LT",
    details: "Faculty of Engineering",
    href: "/location/engineering-lt",
  },
  {
    name: "Mechanical Workshop",
    details: "Faculty of Engineering",
    href: "/search?query=Mechanical%20Workshop",
  },
];

const mostBookmarked = [
  {
    name: "Central Library",
    details: "Library services",
    href: "/location/central-library",
  },
  {
    name: "Senate House",
    details: "Administration",
    href: "/location/senate-house",
  },
  {
    name: "Faculty of Engineering",
    details: "Faculty of Engineering",
    href: "/location/faculty-engineering",
  },
];

const fuzzyResults = [
  {
    name: "Mechatronics Lab",
    details: "Faculty of Engineering",
    href: "/location/mte-lab",
  },
  {
    name: "Mechanical Engineering",
    details: "Faculty of Engineering",
    href: "/location/faculty-engineering",
  },
  {
    name: "Mechatronics Workshop",
    details: "Faculty of Engineering",
    href: "/location/mte-lab",
  },
];

function getResults(query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (normalizedQuery === "engineering") {
    return places.slice(0, 4);
  }

  return places.filter((place) => {
    return (
      place.name.toLowerCase().includes(normalizedQuery) ||
      place.details.toLowerCase().includes(normalizedQuery)
    );
  });
}

function SearchPlaceRow({ place }: { place: SearchPlace }) {
  const Icon = place.Icon;

  return (
    <Link className="search-place-row" href={place.href}>
      <span className={`place-icon ${place.color}`}>
        <Icon aria-hidden="true" />
      </span>
      <span className="place-copy">
        <span className="place-name">{place.name}</span>
        <span className="place-details">{place.details}</span>
      </span>
      <ChevronRight aria-hidden="true" className="place-chevron" />
    </Link>
  );
}

function SearchStart({
  onClearRecent,
  onSelectSearch,
  recent,
}: {
  onClearRecent: () => void;
  onSelectSearch: (query: string) => void;
  recent: typeof recentSearches;
}) {
  return (
    <div className="search-start-content">
      <section aria-labelledby="recent-searches-heading">
        <div className="search-start-heading">
          <h2 id="recent-searches-heading">Recent searches</h2>
          <button onClick={onClearRecent} type="button">Clear</button>
        </div>
        <div className="search-start-list">
          {recent.map((place) => (
            <button
              className="search-start-row"
              key={place.name}
              onClick={() => onSelectSearch(place.name)}
              type="button"
            >
              <span aria-hidden="true" className="search-list-thumbnail" />
              <span className="search-start-copy">
                <strong>{place.name}</strong>
                <span>{place.details}</span>
              </span>
              <Bookmark aria-hidden="true" className="search-start-bookmark" />
            </button>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="most-bookmarked-heading"
        className="most-bookmarked-section"
      >
        <h2 id="most-bookmarked-heading">Most bookmarked</h2>
        <div className="search-start-list">
          {mostBookmarked.map((place) => (
            <Link
              className="search-start-row"
              href={place.href}
              key={place.name}
            >
              <span aria-hidden="true" className="search-list-thumbnail" />
              <span className="search-start-copy">
                <strong>{place.name}</strong>
                <span>{place.details}</span>
              </span>
              <Bookmark
                aria-hidden="true"
                className="search-start-bookmark is-saved"
                fill="currentColor"
              />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function FuzzySearchResults({ query }: { query: string }) {
  const suggestion = "Mechatronics Lab";
  const isSuggested = suggestion.toLowerCase().includes(query.toLowerCase());

  return (
    <>
      {isSuggested ? (
        <p className="search-typo-suggestion">
          Did you mean: <strong>{suggestion}</strong>
        </p>
      ) : null}
      <section aria-labelledby="fuzzy-results-heading">
        <div className="search-results-heading">
          <h2 id="fuzzy-results-heading">Results</h2>
          <span>{fuzzyResults.length} PLACES</span>
        </div>
        <div className="search-compact-list">
          {fuzzyResults.map((place) => (
            <Link
              className="search-compact-row"
              href={place.href}
              key={place.name}
            >
              <span aria-hidden="true" className="search-list-thumbnail" />
              <span className="search-start-copy">
                <strong>{place.name}</strong>
                <span>{place.details}</span>
              </span>
              <Bookmark aria-hidden="true" className="search-start-bookmark" />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

function SearchNotFound() {
  return (
    <section className="search-empty-state">
      <div aria-hidden="true" className="search-empty-avatar">cat</div>
      <h2>No place found</h2>
      <p>Check the spelling or try a building name</p>
      <Link href="/settings/feedback">Report a missing place</Link>
    </section>
  );
}

export function SearchPage({ initialQuery }: { initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [recent, setRecent] = useState(recentSearches);
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const results = useMemo(() => getResults(query), [query]);
  const isStart = query.trim().length === 0;
  const isFuzzy = query.trim().toLowerCase().startsWith("mecha");
  const isDefaultResults = query.trim().toLowerCase() === "engineering";
  const isNotFound = !isStart && !isFuzzy && results.length === 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  function clearSearch() {
    setQuery("");
  }

  return (
    <main className="app-screen search-screen">
      <h1 className="route-heading">Search</h1>

      <form className="search-form" onSubmit={handleSubmit}>
        <label className="search-input-wrap">
          <SearchIcon aria-hidden="true" />
          <input
            aria-label="Search campus places"
            autoComplete="off"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search buildings, rooms or courses"
            value={query}
          />
          {query && !isFuzzy && !isNotFound ? (
            <button
              aria-label="Clear search"
              onClick={clearSearch}
              type="button"
            >
              ×
            </button>
          ) : null}
        </label>
        {!isStart && !isFuzzy && !isNotFound ? <SearchFilters /> : null}
      </form>

      {isStart ? (
        <SearchStart
          onClearRecent={() => setRecent([])}
          onSelectSearch={setQuery}
          recent={recent}
        />
      ) : null}

      {isFuzzy ? <FuzzySearchResults query={query.trim()} /> : null}

      {isNotFound ? <SearchNotFound /> : null}

      {!isStart && !isFuzzy && !isNotFound ? (
        <>
          <div aria-label="Search categories" className="search-tabs">
            {[
              { label: "All" },
              { label: "Buildings" },
              { label: "Rooms" },
            ].map(({ label }) => (
              <button
                aria-current={activeTab === label ? "page" : undefined}
                className={`search-tab${activeTab === label ? " selected" : ""}`}
                key={label}
                onClick={() => setActiveTab(label)}
                type="button"
              >
                {activeTab === label ? <Check aria-hidden="true" /> : null}
                {label}
              </button>
            ))}
          </div>

          <section
            aria-labelledby="results-heading"
            className="search-results-section"
          >
            <div className="search-results-heading">
              <h2 id="results-heading">Results</h2>
              <span>{results.length} PLACES</span>
            </div>
            <div className="search-place-list">
              {results.map((place) => (
                <SearchPlaceRow key={place.name} place={place} />
              ))}
            </div>
          </section>

          {isDefaultResults ? (
            <section
              aria-labelledby="find-way-heading"
              className="find-way-section"
            >
              <h2 id="find-way-heading">Find your way</h2>
              <p>Search a course code, room or campus landmark.</p>
              <div className="suggestion-list">
                <button onClick={() => setQuery("Central Library")} type="button">
                  <SearchIcon aria-hidden="true" />
                  Central Library
                </button>
                <button onClick={() => setQuery("Senate House")} type="button">
                  <SearchIcon aria-hidden="true" />
                  Senate House
                </button>
              </div>
            </section>
          ) : null}
        </>
      ) : null}
    </main>
  );
}
