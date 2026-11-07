"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { faqItems } from "@/content/faq";

export function Faq() {
  return (
    <section
      className="faq-section"
      id="faq"
    >
      <div className="section-heading faq-heading">
        <span className="eyebrow">GOOD TO KNOW</span>
        <h2>
          Questions,
          <br />
          <em>answered.</em>
        </h2>
        <p>
          Everything you might want to know about Catlas before it reaches
          your school.
        </p>
      </div>

      <div className="faq-list">
        {faqItems.map((item) => {
          return (
            <details
              className="faq-item"
              key={item.question}
            >
              <summary className="faq-question">
                {item.question}
                <ChevronDown aria-hidden="true" size={16} />
              </summary>
              <p className="faq-answer">
                {item.linkHref && item.linkLabel ? (
                  <Link
                    className="faq-link"
                    href={item.linkHref}
                  >
                    {item.linkLabel}
                  </Link>
                ) : null}
                {item.answer ? ` ${item.answer}` : ""}
              </p>
            </details>
          );
        })}
      </div>
    </section>
  );
}
