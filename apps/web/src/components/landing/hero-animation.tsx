"use client";

import { useEffect, useRef } from "react";

const SCENE = {
  phone: 0,
  search: 800,
  map: 3400,
  walk: 6800,
  arrive: 10300,
  notice: 12100,
  brand: 16100,
  fade: 18400,
};

const LOOP_MS = 19000;

export function HeroAnimation() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;

    if (reduceMotion || connection?.saveData) {
      root.dataset.static = "true";
      return;
    }

    const timeline = root.animate(
      [
        { opacity: 1, offset: 0 },
        { opacity: 1, offset: SCENE.fade / LOOP_MS },
        { opacity: 0, offset: 0.99 },
        { opacity: 1, offset: 1 },
      ],
      { duration: LOOP_MS, iterations: Infinity },
    );
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        timeline.play();
        root.dataset.paused = "false";
      } else {
        timeline.pause();
        root.dataset.paused = "true";
      }
    });

    observer.observe(root);

    return () => {
      observer.disconnect();
      timeline.cancel();
    };
  }, []);

  return (
    <div className="hero-story" ref={rootRef}>
      <svg
        aria-label="A student searches for a campus building, follows a route,
          arrives, and gives a thumbs up."
        className="hero-story-svg"
        role="img"
        viewBox="0 0 1200 675"
      >
        <defs>
          <clipPath id="phone-screen-clip">
            <rect height="388" rx="25" width="220" x="490" y="128" />
          </clipPath>
        </defs>
        <g className="story-world">
          <path className="story-ground" d="M50 560H1150" />
          <g className="story-campus">
            <path d="M785 300 945 220l160 80Z" />
            <path d="M805 302h280v18H805zM820 488h250v20H820z" />
            <path d="M835 324v164m55-164v164m55-164v164m55-164v164" />
            <path d="M920 418h70v70h-70z" />
            <path d="M800 510h290v22H800z" />
          </g>
          <g className="story-trees">
            <path d="M730 558v-90m-32 0 32-65 32 65Z" />
            <path d="M1120 558v-105m-35 0 35-70 35 70Z" />
          </g>
          <g className="story-figure">
            <circle className="story-head" cx="350" cy="250" r="28" />
            <path className="story-torso" d="M350 280v130" />
            <path className="story-left-arm" d="m350 310-54 58 18 21" />
            <path className="story-right-arm" d="m350 310 54 38 40 2" />
            <circle cx="314" cy="389" r="11" />
            <circle cx="444" cy="350" r="11" />
            <path className="story-left-leg" d="m350 410-42 110" />
            <path className="story-right-leg" d="m350 410 48 110" />
            <path className="story-thumb" d="m452 345 2-28" />
          </g>
          <g className="story-phone">
            <rect className="phone-body" height="430" rx="34" width="250" x="475" y="108" />
            <rect className="phone-button" height="58" rx="4" width="7" x="468" y="196" />
            <rect className="phone-button" height="42" rx="4" width="7" x="725" y="210" />
            <rect className="phone-screen" height="388" rx="25" width="220" x="490" y="128" />
            <g clipPath="url(#phone-screen-clip)">
              <rect className="screen-base" height="388" width="220" x="490" y="128" />
              <g className="search-screen">
                <text className="screen-time" x="510" y="155">10:24</text>
                <text className="screen-status" x="652" y="155">●  Wi-Fi  82%</text>
                <text className="screen-title" x="510" y="192">Find a place</text>
                <rect className="search-field" height="40" rx="11" width="186" x="507" y="207" />
                <g className="typed-text"><text className="search-text" x="520" y="233">Mechatronic Lab</text></g>
                <g className="search-result"><circle cx="527" cy="276" r="12" /><text x="550" y="273">Mechatronics Lab</text><text className="result-sub" x="550" y="290">Engineering faculty</text></g>
                <g className="search-result result-two"><circle cx="527" cy="328" r="12" /><text x="550" y="325">Main Library</text><text className="result-sub" x="550" y="342">Academic services</text></g>
                <g className="search-result result-three"><circle cx="527" cy="380" r="12" /><text x="550" y="377">Science Complex</text><text className="result-sub" x="550" y="394">Faculty building</text></g>
                <circle className="tap-ripple" cx="525" cy="277" r="5" />
              </g>
              <g className="map-screen">
                <text className="screen-time" x="510" y="155">10:24</text>
                <path className="phone-road" d="M480 220h260M510 180v200m70-40 160-80m-240 150 245-35" />
                <path className="phone-trail" d="M535 370c28-55 45-11 70-72s49-10 75-77" />
                <circle className="phone-dot" cx="535" cy="370" r="8" />
                <path className="phone-pin" d="M680 209c-18 0-27 14-27 27 0 21 27 46 27 46s27-25 27-46c0-13-9-27-27-27Z" />
                <text className="distance-label" x="526" y="440">850 m to destination</text>
              </g>
              <g className="notice-screen">
                <rect className="notice-card" height="160" rx="17" width="188" x="506" y="225" />
                <circle className="cat-face" cx="550" cy="275" r="23" />
                <path className="cat-ears" d="m530 263 2-22 18 13 18-13 2 22" />
                <text className="notice-title" x="535" y="320">You made it!</text>
                <text className="notice-copy" x="526" y="343">You have reached your</text>
                <text className="notice-copy" x="546" y="360">final destination.</text>
                <circle className="confetti confetti-one" cx="520" cy="215" r="4" />
                <circle className="confetti confetti-two" cx="683" cy="390" r="4" />
                <circle className="confetti confetti-three" cx="690" cy="220" r="3" />
              </g>
            </g>
            <circle className="phone-camera" cx="600" cy="119" r="4" />
            <rect className="phone-home" height="4" rx="2" width="62" x="569" y="517" />
            <path className="vibration-mark" d="m458 292-13-12m13 36-18-2m13 29-13 12m300-63 13-12m-13 36 18-2m-13 29 13 12" />
          </g>
          <g className="typing-hand">
            <path d="M666 489c-13-13-26-24-35-38-5-8-1-16 6-15 6 1 15 13 20 17l-14-37c-4-11 10-15 15-5l15 25-7-29c-2-11 13-13 16-2l8 28 1-20c0-11 15-11 16 1l2 24 5-11c5-10 18-4 14 7l-8 29c-3 14-16 27-27 38Z" />
            <path className="hand-sleeve" d="m665 488 44 37-25 24-43-43Z" />
          </g>
        </g>
        <g className="story-brand">
          <text className="brand-name" x="790" y="390">Catlas</text>
          <text className="brand-copy" x="795" y="430">Find any place on campus.</text>
          <text className="brand-copy" x="795" y="456">Know what is inside.</text>
        </g>
      </svg>
      <span className="story-caption">YOUR CAMPUS, IN MOTION</span>
    </div>
  );
}
