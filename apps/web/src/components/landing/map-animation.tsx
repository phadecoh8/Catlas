"use client";

import {
  ArrowUpRight,
  Bell,
  Check,
  Clock3,
  MapPin,
  Navigation,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// The CSS loop (progress bar and phone) runs for 8 seconds, so the
// numbers and the route line are driven from JavaScript against the
// same cycle.
const ROUTE_SECONDS = 8;

// Real walking route traced from OpenStreetMap road geometry around
// Federal University Oye-Ekiti, Ikole Campus: along the campus
// approach road to the point the owner pinned at
// 7.806024834425393, 5.4949744688978335.
const TRIP_METRES = 809;
const BASE_VELOCITY = 1.4;
const VELOCITY_SWING = 0.22;
const VELOCITY_WOBBLE = 0.08;

// Roads and buildings below are the mapped geometry for that area,
// projected onto the 800x440 viewBox of the demo map.
const ROAD_A_PATH =
  "M340.6 394 L435.7 303.4 L474 265.5 L481.4 260.8 L492.3 256.9 "
  + "L512.1 252.2 L526.6 246.9 L538.2 239.8 L547.6 238.9 L563.7 238.8 "
  + "L570.1 238.1 L579.3 235.6 L594.6 228.8 L696.3 164 L732.5 142.1 "
  + "L749.4 131.5 L754 125 L751.1 113.3 L742.2 98.8 L737.2 86.1 "
  + "L724 75.1 L712.6 67.7 L693.7 60.5 L677.3 48.7";
const ROAD_B_PATH =
  "M538.2 239.8 L528.4 235.4 L459.7 218.4 L405 206.3 L369.7 191.5 "
  + "L361.4 189.1 L347 185.9 L278.2 175.7 L267 172.9 L259.2 169.5 "
  + "L251.6 165.5 L237.6 157.1 L192 127.8 L157 102.4 L146.4 89.3 "
  + "L144.8 83.6 L147.3 75.4 L157.6 67.9 L165.9 62.2 L170.7 57.3 "
  + "L169.3 53.3 L165.2 50.5 L159.2 48.6 L141.8 46 L46 47";
const ROUTE_POINTS: Array<[number, number]> = [
  [340.6, 394],
  [435.7, 303.4],
  [474, 265.5],
  [481.4, 260.8],
  [492.3, 256.9],
  [512.1, 252.2],
  [526.6, 246.9],
  [538.2, 239.8],
  [528.4, 235.4],
  [459.7, 218.4],
  [405, 206.3],
  [369.7, 191.5],
  [361.4, 189.1],
  [347, 185.9],
  [278.2, 175.7],
  [267, 172.9],
  [259.2, 169.5],
  [251.6, 165.5],
  [245.3, 137.2],
];
const REAL_BUILDINGS: Array<{ path: string }> = [
  { path: "M268.1 39.3 L254.8 39.4 L255.2 46.9 L276.5 46.7 L276.4 45.1 L268.4 45.2 L268.1 39.3 Z" },
  { path: "M231.1 42.3 L232.3 56.9 L279.6 56.2 L278.9 48.2 L246.2 48.7 L245.6 42.1 L231.1 42.3 Z" },
  { path: "M277.8 39.7 L282.3 55.6 L297.1 54.9 L292.6 39 L277.8 39.7 Z" },
  { path: "M307.7 50.6 L320.6 50.5 L320.9 54.1 L307.9 54.3 Z" },
  { path: "M306.8 47.3 L315 47.1 L315.2 48.9 L307 49.1 Z" },
  { path: "M485.1 140.8 L510.4 145.6 L514.4 142.1 L489.2 137.3 Z" },
  { path: "M513.9 181.9 L494.7 185.6 L497.5 188 L500.5 188.2 L511.5 197.6 L544.5 191.1 L548.6 180.5 L547.5 179.5 L549.2 179.1 L550.6 175.7 L525.3 174.1 L524 172.9 L517.5 172.5 Z" },
  { path: "M519.8 239.6 L510.2 237.7 L500.9 245.6 L483.5 242.3 L493.9 233.4 L483.5 231.4 L467.1 245.5 L479.4 247.9 L477.9 249.2 L502.8 254.1 Z" },
  { path: "M576.8 201.9 L587.5 205.2 L597.6 199.7 L604.3 201.7 L607 200.3 L602 198.8 L614.3 192 L601.8 188.2 Z" },
  { path: "M619.2 194.2 L596.6 207.8 L606.9 210.7 L629.5 197 Z" },
  { path: "M443.9 225.9 L436.3 223.5 L419.2 232.7 L426.8 235.1 Z" },
  { path: "M371.2 224.5 L379.3 218.5 L370.6 216.5 L362.5 222.5 Z" },
  { path: "M367.8 225 L354.1 235.1 L363 237.1 L376.6 227.2 L381.5 228.3 L393.5 219.5 L388.7 218.4 L401.5 209.1 L392.9 207.1 L378.6 217.5 L381.5 218.2 L371.1 225.8 Z" },
  { path: "M386.2 206.2 L390.9 207.1 L387 210.5 L382.3 209.6 Z" },
  { path: "M406.9 199.8 L425.6 205.3 L430.1 202.7 L411.4 197.2 Z" },
  { path: "M446.7 205.8 L450.3 202.4 L435.7 199.8 L432.1 203.2 Z" },
  { path: "M494.9 206.8 L505.3 209 L507.7 210.7 L497.3 208.6 Z" },
  { path: "M552.5 223.5 L560.4 226.5 L556.4 228.3 L548.5 225.3 Z" },
  { path: "M278 207.7 L293.5 208.5 L298.5 193.9 L283 193 Z" },
  { path: "M325.6 190.8 L327.5 188.7 L323.7 188.1 L321.8 190.2 Z" },
  { path: "M346.7 199.1 L353.7 200.8 L350 203.5 L343 201.8 Z" },
  { path: "M348.2 199.1 L354.6 200.2 L358.3 196.5 L351.9 195.4 Z" },
  { path: "M356.4 193 L350.3 191.8 L348.8 193 L354.8 194.3 Z" },
];
const ROUTE_PATH = ROUTE_POINTS
  .map((point, index) => `${index === 0 ? "M" : "L"}${point[0]} ${point[1]}`)
  .join(" ");

// Cumulative length at each route point, used to place the moving pin.
const SEGMENT_LENGTHS = ROUTE_POINTS
  .slice(0, -1)
  .map((point, index) => Math.hypot(
    ROUTE_POINTS[index + 1][0] - point[0],
    ROUTE_POINTS[index + 1][1] - point[1],
  ));
const ROUTE_UNITS = SEGMENT_LENGTHS.reduce((sum, length) => sum + length, 0);

type WalkingState = {
  metresLeft: number;
  velocity: number;
  secondsLeft: number;
};

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

// Mirrors the progress-route keyframes in globals.css so the distance
// follows the moving bar: 8 percent until second 0.4, rising to 100
// percent at second 6.08, a short hold, then a reset for the next loop.
function remainingFractionAt(seconds: number): number {
  const pct = (seconds / ROUTE_SECONDS) * 100;
  let width = 0.08;

  if (pct < 5) {
    width = 0.08;
  } else if (pct < 76) {
    width = 0.08 + ((pct - 5) / 71) * 0.92;
  } else if (pct < 90) {
    width = 1;
  }

  return 1 - clamp01((width - 0.08) / 0.92);
}

// Walking speed drifts around 1.4 m/s (about 5 km/h) so the time left
// is recalculated continuously instead of staying flat.
function velocityAt(seconds: number): number {
  return (
    BASE_VELOCITY
    + VELOCITY_SWING * Math.sin(seconds * 0.9)
    + VELOCITY_WOBBLE * Math.sin(seconds * 2.7 + 1.3)
  );
}

function formatTimeLeft(seconds: number): string {
  if (seconds <= 1) {
    return "Now";
  }

  if (seconds < 60) {
    return `${Math.ceil(seconds)} s`;
  }

  const minutes = Math.floor(seconds / 60);
  const rest = Math.round(seconds % 60);
  return rest === 0
    ? `${minutes} min`
    : `${minutes} min ${rest} s`;
}

// Position on the route polyline at the given travelled length.
function pointAtLength(travelled: number): [number, number] {
  let covered = 0;

  for (let index = 0; index < SEGMENT_LENGTHS.length; index += 1) {
    const segment = SEGMENT_LENGTHS[index];

    if (covered + segment >= travelled) {
      const into = segment === 0 ? 0 : (travelled - covered) / segment;
      const from = ROUTE_POINTS[index];
      const to = ROUTE_POINTS[index + 1];

      return [
        from[0] + (to[0] - from[0]) * into,
        from[1] + (to[1] - from[1]) * into,
      ];
    }

    covered += segment;
  }

  return ROUTE_POINTS[ROUTE_POINTS.length - 1];
}

export function MapAnimation() {
  const routeRef = useRef<SVGPathElement | null>(null);
  const routeShadowRef = useRef<SVGPathElement | null>(null);
  const markerRef = useRef<SVGGElement | null>(null);
  const markerCard = useRef<HTMLDivElement | null>(null);
  const [
    walking,
    setWalking,
  ] = useState<WalkingState>({
    metresLeft: TRIP_METRES,
    velocity: BASE_VELOCITY,
    secondsLeft: TRIP_METRES / BASE_VELOCITY,
  });

  useEffect(() => {
    let frame = 0;
    let lastUpdate = 0;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const connection = (navigator as { connection?: { saveData?: boolean } })
      .connection;
    const lowData = connection?.saveData === true;
    const demo = markerCard.current?.parentElement;

    if (demo && lowData) {
      demo.dataset.lowData = "true";
    }

    function placeRoute(route: SVGPathElement, remaining: number, consumed: number) {
      const dasharray = `${remaining} ${ROUTE_UNITS + 10}`;
      const dashoffset = `${-consumed + 0.5}`;

      route.setAttribute("stroke-dasharray", dasharray);
      route.setAttribute("stroke-dashoffset", dashoffset);

      const shadow = routeShadowRef.current;

      if (shadow) {
        shadow.setAttribute("stroke-dasharray", dasharray);
        shadow.setAttribute("stroke-dashoffset", dashoffset);
      }
    }

    function placeMarker(travelled: number) {
      const point = pointAtLength(travelled);
      const marker = markerRef.current;
      const label = markerCard.current;

      if (marker) {
        marker.setAttribute("transform", `translate(${point[0]} ${point[1]})`);
      }

      if (label) {
        label.style.left = `${(point[0] / 800) * 100}%`;
        label.style.top = `${(point[1] / 440) * 100}%`;
      }
    }

    function restState() {
      const route = routeRef.current;

      if (route) {
        placeRoute(route, ROUTE_UNITS, 0);
      }

      placeMarker(0);
    }

    if (prefersReducedMotion || lowData) {
      restState();
      return;
    }

    function step(now: number) {
      const seconds = (now / 1000) % ROUTE_SECONDS;
      const remaining = remainingFractionAt(seconds) * ROUTE_UNITS;
      const consumed = ROUTE_UNITS - remaining;
      const route = routeRef.current;

      if (route) {
        placeRoute(route, remaining, consumed);
      }

      placeMarker(consumed);

      // Refresh the numbers about eight times a second.
      if (now - lastUpdate > 120) {
        const metresLeft = Math.max(
          0,
          Math.round(TRIP_METRES * (remaining / ROUTE_UNITS)),
        );
        const velocity = velocityAt(now / 1000);

        setWalking({
          metresLeft,
          velocity,
          secondsLeft: metresLeft / velocity,
        });
        lastUpdate = now;
      }

      frame = requestAnimationFrame(step);
    }

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="navigation-demo" aria-label="Animated campus route demo">
      <div className="demo-map">
        <div className="demo-map-label map-label-one">FUOYE IKOLE CAMPUS</div>
        <svg
          className="route-svg"
          viewBox="0 0 800 440"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {REAL_BUILDINGS.map((building) => (
            <path
              className="map-building-outline"
              d={building.path}
              key={building.path}
            />
          ))}
          <path className="road road-wide" d={ROAD_A_PATH} />
          <path className="road road-line" d={ROAD_A_PATH} />
          <path className="road road-wide" d={ROAD_B_PATH} />
          <path className="road road-line" d={ROAD_B_PATH} />
          <path
            className="route-shadow"
            d={ROUTE_PATH}
            ref={routeShadowRef}
          />
          <path className="route-line" d={ROUTE_PATH} ref={routeRef} />
          <g className="route-marker" ref={markerRef}>
            <circle className="route-marker-ring" r="13" />
            <circle className="route-marker-dot" r="5.5" />
          </g>
        </svg>
        <div className="current-location moving-location" ref={markerCard}>
          <span /><span className="location-pulse" /><small>YOU</small>
        </div>
        <div
          className="destination-pin"
          style={{ left: "30.7%", top: "31.2%" }}
        >
          <MapPin size={31} fill="currentColor" /><span />
        </div>
        <div className="map-compass"><Navigation size={15} fill="currentColor" /></div>
        <div className="map-zoom">+<span>−</span></div>
        <div className="map-scale">50 m</div>
      </div>
      <div className="route-info-card">
        <div className="route-info-top"><span className="route-status"><span /> WALKING ROUTE</span><span className="route-badge"><Clock3 size={13} /> {formatTimeLeft(walking.secondsLeft)}</span></div>
        <div className="route-destination"><span className="route-destination-icon"><MapPin size={19} /></span><div><small>YOUR DESTINATION</small><strong>FUOYE Ikole Campus</strong></div><ArrowUpRight className="destination-arrow" size={17} /></div>
        <div className="route-progress"><span /></div>
        <div className="route-meta"><span>{walking.metresLeft} m away</span><span>{walking.velocity.toFixed(1)} m/s</span></div>
      </div>
      <div className="arrival-phone" aria-hidden="true">
        <div className="phone-frame">
          <div className="phone-island" />
          <div className="phone-status"><span>9:41</span><span>●●● ◖ ▰</span></div>
          <div className="phone-app-header"><span className="phone-back">‹</span><span>YOUR ROUTE</span><span className="phone-menu">•••</span></div>
          <div className="phone-map">
            <span className="phone-road phone-road-a" /><span className="phone-road phone-road-b" />
            <span className="phone-route" /><span className="phone-start"><i /></span>
            <span className="phone-destination"><MapPin size={21} fill="currentColor" /></span>
          </div>
          <div className="phone-arrival-toast"><span className="arrival-check"><Check size={17} /></span><span><strong>You’ve arrived!</strong><small>FUOYE Ikole Campus is here.</small></span><Bell size={13} /></div>
          <div className="phone-bottom"><span className="phone-bottom-pin"><MapPin size={16} /></span><span><small>DESTINATION</small><strong>Ikole Campus</strong></span><span className="phone-minutes">Now</span></div>
          <div className="phone-home-indicator" />
        </div>
        <span className="phone-label">ARRIVAL NOTIFICATION</span>
      </div>
      <span className="demo-map-attribution">Illustrative campus map</span>
    </div>
  );
}
