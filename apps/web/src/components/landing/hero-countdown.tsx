"use client";

import {
  useEffect,
  useState,
} from "react";

// Owner input: the single place to change the launch moment.
// Lagos is UTC+1 all year, so the offset stays fixed.
const launchDate = "2027-02-15T10:00:00+01:00";

const launchTime = new Date(launchDate).getTime();
const second = 1000;
const minute = 60 * second;
const hour = 60 * minute;
const day = 24 * hour;

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function readCountdown(): Countdown {
  const remaining = Math.max(launchTime - Date.now(), 0);

  return {
    days: Math.floor(remaining / day),
    hours: Math.floor(remaining / hour) % 24,
    minutes: Math.floor(remaining / minute) % 60,
    seconds: Math.floor(remaining / second) % 60,
  };
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export function HeroCountdown() {
  // Null on the server and on the first client render, so both match.
  const [countdown, setCountdown] = useState<Countdown | null>(null);

  useEffect(() => {
    setCountdown(readCountdown());

    const timer = window.setInterval(() => {
      setCountdown(readCountdown());
    }, second);

    return () => window.clearInterval(timer);
  }, []);

  const value = countdown ?? {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  const units = [
    {
      label: "days",
      value: String(value.days),
    },
    {
      label: "hrs",
      value: pad(value.hours),
    },
    {
      label: "min",
      value: pad(value.minutes),
    },
    {
      label: "sec",
      value: pad(value.seconds),
    },
  ];

  return (
    // Blurred until the owner is ready to show the date.
    // Remove the is-blurred class to reveal the countdown.
    <div
      aria-hidden="true"
      className="hero-countdown is-blurred"
    >
      <span className="countdown-label">Launching in</span>
      <span className="countdown-units">
        {units.map((unit) => (
          <span
            className="countdown-unit"
            key={unit.label}
          >
            <strong>{unit.value}</strong>
            <small>{unit.label}</small>
          </span>
        ))}
      </span>
    </div>
  );
}
