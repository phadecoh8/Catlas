export type FaqItem = {
  question: string;
  answer: string;
  linkLabel?: string;
  linkHref?: string;
};

// Draft copy from docs/LANDING-PAGE-PLAN.md, pending the owner's review.
// Items 5 and 6 are still marked "(confirm)" in the plan, so they may
// change once the owner confirms them.
export const faqItems: FaqItem[] = [
  {
    question: "What is Catlas?",
    answer:
      "Catlas is a campus navigation app. It shows you a place, what is inside it, and the walking route to get there.",
  },
  {
    question: "Who can use it?",
    answer:
      "Students of schools that join Catlas, and visitors, who can see the places their school has opened to them.",
  },
  {
    question: "Does it work without internet?",
    answer:
      "If your network drops, Catlas keeps guiding you with your phone's GPS, using the details it saved for that place. Full offline maps are not available yet.",
  },
  {
    question: "Which schools can use it?",
    answer:
      "We are starting with a demo at one university, in the Faculty of Engineering and the Faculty of CIESA. More schools will follow.",
  },
  {
    question: "What if a place or a detail is wrong?",
    answer:
      "Use the Report a problem button on any place. It goes to your school.",
  },
  {
    question: "How do I join?",
    answer: "We will email you when your school is ready.",
    linkLabel: "Join the waitlist",
    linkHref: "/join",
  },
];
