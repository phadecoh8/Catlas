import {
  MapPin,
  Navigation,
  Search,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Search your campus",
    description: "Find a lecture hall, office, lab or landmark in seconds.",
    Icon: Search,
  },
  {
    number: "02",
    title: "Follow your route",
    description: "See your location, walking time and a clear route to the door.",
    Icon: Navigation,
  },
  {
    number: "03",
    title: "Know when you arrive",
    description: "Get a helpful arrival message and details about the place.",
    Icon: MapPin,
  },
];

export function HowItWorks() {
  return (
    <section
      className="steps-section"
      id="how-it-works"
    >
      <div className="section-heading centered-heading">
        <span className="eyebrow">THREE STEPS. ZERO LOST TIME.</span>
        <h2>
          Your next place is <em>closer than you think.</em>
        </h2>
      </div>
      <div className="steps-grid">
        {steps.map(({ number, title, description, Icon }) => (
          <article
            className="step-card"
            key={number}
          >
            <div className="step-top">
              <span>{number}</span>
              <span className="step-icon">
                <Icon size={19} />
              </span>
            </div>
            <h3>{title}</h3>
            <p>{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
