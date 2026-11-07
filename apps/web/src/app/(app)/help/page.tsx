"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bot,
  ChevronDown,
  ChevronRight,
  Search,
} from "lucide-react";

const questions = [
  {
    question: "How do I find a building?",
    answer:
      "Open Search and enter a building name. Choose a result, then tap Get directions to see your walking route.",
  },
  {
    question: "Can I use Catlas offline?",
    answer:
      "Places you have opened can remain available on your device. Map tiles and route responses need an internet connection.",
  },
  {
    question: "How do I save a place?",
    answer:
      "Open a place's building details and choose Save place. You can find it later from Saved on Home.",
  },
  {
    question: "How do I report wrong details?",
    answer:
      "Open the place details and report the incorrect information, or send feedback from Settings.",
  },
  {
    question: "Who posts my class updates?",
    answer:
      "Your class governor posts class updates and assignments for your department and level.",
  },
];

export default function HelpPage() {
  const [query, setQuery] = useState("");
  const filteredQuestions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return questions;
    }

    return questions.filter(({ question, answer }) => {
      return `${question} ${answer}`.toLowerCase().includes(normalizedQuery);
    });
  }, [query]);

  return (
    <main className="app-screen information-screen help-screen">
      <div className="detail-page-title">
        <Link aria-label="Back to settings" href="/settings">
          <ArrowLeft aria-hidden="true" />
        </Link>
        <h1>Help centre</h1>
      </div>

      <label className="help-search-field">
        <Search aria-hidden="true" />
        <input
          aria-label="Search for help"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search for help"
          value={query}
        />
      </label>

      <Link className="help-assistant-link" href="/catline">
        <span className="help-assistant-icon">
          <Bot aria-hidden="true" />
        </span>
        <span className="help-assistant-copy">
          <strong>Ask Catline</strong>
          <span>Find answers about your campus</span>
        </span>
        <ChevronRight aria-hidden="true" className="settings-chevron" />
      </Link>

      <section aria-labelledby="faq-heading" className="help-faq-section">
        <h2 id="faq-heading">Frequently asked questions</h2>
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map(({ question, answer }, index) => (
            <details
              className="help-question"
              key={question}
              open={index === 0 && !query}
            >
              <summary>
                {question}
                <ChevronDown aria-hidden="true" />
              </summary>
              <p>{answer}</p>
            </details>
          ))
        ) : (
          <p className="help-no-results">No help articles match your search.</p>
        )}
      </section>
    </main>
  );
}
