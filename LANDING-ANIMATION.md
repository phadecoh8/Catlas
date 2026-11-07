# Landing Hero Animation (Catlas)

A looping SVG story for the landing page, about 19 seconds. A thick stick figure searches for a place on a phone, follows the trail, walks to the building, feels the phone vibrate on arrival, and sees the happy cat congratulate them. Then the figure steps to the side and gives a thumbs up while the Catlas name and description pop up. Then it loops. The app was called CNS before; the animation uses the name Catlas.

## Library choice

| Option | Good for | Cost | Verdict |
|---|---|---|---|
| Anime.js v4 | Timelines, SVG attributes, keyframes, a JS-driven progress value | Modular. A timeline-only import is about 11 KB gzipped; the full bundle is about 24.5 KB | Recommended for this one section, lazy-loaded |
| GSAP | The most mature timelines, great docs, huge amount of example code | Larger (about 25 KB or more) | The safe runner-up. Pick it if you want the most tooling and reliability |
| Motion (already approved) | UI transitions, cards, icons, modals, React state | Already in the project | Zero new dependency, but long camera-style sequences need more manual timing |
| Rive or Lottie | Animations made in a separate design tool | Larger runtime and an extra tool | Not worth it for a stick figure |

Rules of thumb:
- One long, hand-timed SVG scene with camera moves: Anime.js or GSAP.
- Small interface motion (hover, cards, modals): Motion.
- Zero new libraries: do everything in Motion.

Load the animation library with a dynamic import only when the hero scrolls into view, so it adds nothing to the first page load.

**Warning for AI coding agents:** Anime.js changed its API in v4. Agents often write the old v3 syntax (`anime({ targets: ... })`). Tell your agent to use Anime.js v4 (`createTimeline`, `animate`, `createScope`) and to read the v4 docs on animejs.com first.

Adding a library is a new dependency, so this is a recommendation until the owner confirms. After that, add it to the approved stack in `AGENTS.md` and change the landing animation note in `docs/PRODUCT.md` from Motion to the chosen library.

## Visual spec

- **Frame:** one SVG, `viewBox="0 0 1200 675"` (16:9). It scales down for mobile with a fixed aspect ratio, so the page does not jump.
- **Stick figure:** thick. Stroke width 16 for the limbs and body, round caps and joins, and a head of radius 26 with an 8 px stroke. Two-segment arms and legs (upper arm and forearm, thigh and shin), so elbows and knees bend. Hands are small circles (radius 11). A short thick line is the thumb, hidden until the thumbs-up scene.
- **Figure colour by theme:** blue in dark mode, black in light mode. Use a CSS variable on the SVG: `--hero-figure: #2E8FFF` in dark mode (brand/primary) and `--hero-figure: #17181C` in light mode (text/primary). Every figure stroke uses `stroke: var(--hero-figure)`. The head fill uses the page background variable.
- **Phone, like a real phone:**
  - rounded body with a thin edge, power and volume buttons on the side
  - a punch-hole front camera at the top centre
  - a status bar: the time on the left (for example "10:24"), signal bars, a Wi-Fi icon and a battery icon with the percentage ("82%") on the right
  - a home indicator bar at the bottom
  - the screen switches on at the start (a quick brighten from black)
  - the map screen also shows a small location icon in the status bar
- **Screens inside the phone:** search screen (search field and three result rows), map screen (grey roads, blue dot, red pin, red dashed trail, distance text), notification screen (a card with the happy cat). They reuse the Figma look.
- **Colours:** blue `brand/primary` (#2E8FFF) for the user dot, red `map/trail-and-pin` (#EF4444) for the pin and trail, tile colours for small details, background `bg/page` (#17181C) or white in light mode.
- **World:** a flat ground line, a few lamp posts and trees for parallax, and a campus building at the far right (pediment, columns, door, steps).
- **Cat:** the happy cat from the cat sheet (ears wiggle, tail waves, a few confetti dots).
- **Style:** flat, no gradients, a soft shadow only under the figure, no emojis.

## Storyboard (about 19 seconds, then loop)

| # | Time (ms) | What happens | Elements and motion |
|---|---|---|---|
| 0 | 0 to 800 | The hand and phone rise into view, and the screen switches on showing the time | `#phone-group` moves up with an ease-out. The screen brightens from black. |
| 1 | 800 to 3400 | Search. "Mechatronics Lab" is typed, three results slide in, a tap ripple lands on the first one | Typewriter driven by a counter (about 1,100 ms), results staggered, ripple circle scales and fades |
| 2 | 3400 to 6000 | The map screen pops in. The blue dot moves along the trail and the trail behind it disappears, like Google Maps. The distance counts down from "850 m" | One progress value drives the dot, the trail dash offset and the distance text |
| 3 | 6000 to 6800 | Zoom out from the phone to the whole scene. The figure holds the phone and the building is small in the distance | `#camera` scale goes from 2.6 to 1 |
| 4 | 6800 to 9800 | The figure walks for 3 seconds. The building grows in perspective and the ground and posts slide past | Alternating leg and arm swings, a small body bob, ground and posts translate, `#building` scale goes from 0.3 to 1 with an ease-in |
| 5 | 9800 to 10300 | The figure stops in front of the building | Limbs return to rest |
| 6 | 10300 to 11300 | The phone vibrates. Vibration marks appear on both sides | Quick left-right shake with keyframes, marks pulse with a stagger, the head tilts down slightly |
| 7 | 11300 to 12100 | Zoom into the phone | `#camera` scale goes from 1 to 2.6 toward the phone |
| 8 | 12100 to 14300 | A notification pops up with the happy cat and "Congratulations, you have reached your final destination." | Card scales and fades in with a slight overshoot, the cat's ears and tail move, confetti dots |
| 9 | 14300 to 15100 | Zoom out. The figure puts the phone in a pocket | `#camera` scale back to 1, the phone shrinks and fades out at the hip |
| 10 | 15100 to 16100 | The figure slides to the left side of the frame | `#figure` moves to the left third. The building and world pan slightly to make room. |
| 11 | 16100 to 17000 | Thumbs up | The right forearm rotates up, the thumb line appears and scales in, the head nods once |
| 12 | 16400 to 18400 | The name and description pop up on the right | "Catlas" scales in with a slight overshoot, then the line "Catlas helps you find any place on campus and know what is inside." fades up |
| 13 | 18400 to 19000 | Everything fades out and the loop restarts | Opacity to 0, then reset to the first frame |

On mobile, stack the final scene: the figure on top and the name and description below it.

## SVG layer map (use these ids)

```
svg#hero-animation
  g#camera
    g#world
      g#ground (line and ticks)
      g#posts (lamp posts and trees)
      g#building (pediment, columns, door, steps)
    g#figure
      circle#head
      line#body
      g#arm-left > line#upper-arm-left, g#forearm-left > line#forearm-left-line, circle#hand-left
      g#arm-right > line#upper-arm-right, g#forearm-right > line#forearm-right-line, circle#hand-right, line#thumb-right
      g#leg-left > line#thigh-left, g#shin-left > line#shin-left-line
      g#leg-right > line#thigh-right, g#shin-right > line#shin-right-line
    g#phone-group
      rect#phone-body, g#phone-buttons, rect#phone-screen, circle#front-camera, rect#home-indicator
      g#status-bar (text#status-time, g#status-signal, g#status-wifi, g#status-location, g#status-battery, text#status-battery-text)
      g#screen-search (field, rows, text#typed-text, circle#tap-ripple)
      g#screen-map (roads, path#trail, circle#user-dot, g#pin, text#distance)
      g#screen-notification (card, g#happy-cat, text#congrats)
      g#vibration-marks
  g#brand (text#wordmark, text#description)
```

Set each joint's pivot in the SVG's own coordinates, for example `style="transform-origin: 600px 380px"` on `#leg-left`, so rotations swing from the hip, knee and shoulder.

## Implementation rules

1. Build one timeline with `loop: true` and place every scene at an absolute millisecond time from the storyboard, so changing one scene does not shift the others. Keep the times in one `SCENE` constants object.
2. For every animated property give both values (`[from, to]`). A property with only a `to` value starts from the last value after the loop restarts and causes a glitch.
3. Drive the map scene with one progress object (`{ value: 0 }` animated to 1, with `onUpdate`). In `onUpdate`, move the dot with `getPointAtLength`, and erase the trail from the start by setting `strokeDasharray` to `"length length"` and `strokeDashoffset` to `-progress * length`.
4. Build the walk cycle from keyframes (a helper that returns alternating left and right swings), so it fits exactly 3000 ms.
5. Zoom with the `#camera` group, not by resizing the phone. Set its `transform-origin` to the phone's position.
6. Animate only `transform` and `opacity`, plus the trail dash offset. Do not animate layout.
7. Take figure colours from CSS variables, so switching light and dark mode needs no code change.
8. Keep the whole thing inside a client component and clean up when it unmounts.

## Code skeleton

Function names come from the Anime.js v4 docs (`createTimeline`, `createScope`, keyframes, `onUpdate`). Check the docs for exact options when you wire it up.

```tsx
'use client';

import { useEffect, useRef } from 'react';

const SCENE = {
  phoneRise: 0,
  search: 800,
  map: 3400,
  zoomOut: 6000,
  walk: 6800,
  stop: 9800,
  vibrate: 10300,
  zoomIn: 11300,
  notification: 12100,
  pocket: 14300,
  slide: 15100,
  thumbsUp: 16100,
  brand: 16400,
  fade: 18400,
};

const WALK_MS = 3000;
const HALF_STEP_MS = 230;

function swing(amplitude: number) {
  const halfSteps = Math.floor(WALK_MS / HALF_STEP_MS);
  const keyframes = [];

  for (let index = 0; index < halfSteps; index += 1) {
    const direction = index % 2 === 0 ? 1 : -1;
    keyframes.push({
      to: amplitude * direction,
      duration: HALF_STEP_MS,
    });
  }

  return keyframes;
}

export function HeroAnimation() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (reduceMotion) {
      root.dataset.static = 'true';
      return;
    }

    let cleanup = () => {};

    async function start() {
      const { createScope, createTimeline } = await import('animejs');

      const scope = createScope({ root }).add(() => {
        const timeline = createTimeline({
          loop: true,
          defaults: { ease: 'inOutQuad' },
        });

        // Scene 0: hand and phone rise, screen switches on
        timeline.add(
          '#phone-group',
          { y: [260, 0], duration: 800 },
          SCENE.phoneRise,
        );

        // Scene 2: map progress drives dot, trail and distance
        const trail = root.querySelector<SVGPathElement>('#trail');
        const dot = root.querySelector<SVGCircleElement>('#user-dot');

        if (trail && dot) {
          const length = trail.getTotalLength();
          const progress = { value: 0 };

          trail.style.strokeDasharray = `${length} ${length}`;

          timeline.add(
            progress,
            {
              value: [0, 1],
              duration: 2600,
              ease: 'linear',
              onUpdate: () => {
                const point = trail.getPointAtLength(
                  progress.value * length,
                );

                dot.setAttribute('cx', String(point.x));
                dot.setAttribute('cy', String(point.y));
                trail.style.strokeDashoffset = String(
                  -progress.value * length,
                );
              },
            },
            SCENE.map,
          );
        }

        // Scene 4: walk for 3 seconds
        timeline.add('#leg-left', { rotate: swing(26) }, SCENE.walk);
        timeline.add('#leg-right', { rotate: swing(-26) }, SCENE.walk);
        timeline.add(
          '#building',
          { scale: [0.3, 1], duration: WALK_MS, ease: 'inQuad' },
          SCENE.walk,
        );

        // Scenes 1, 3, 5 to 13 follow the storyboard times in SCENE
      });

      cleanup = () => scope.revert();
    }

    start();

    return () => cleanup();
  }, []);

  return <div ref={rootRef}>{/* the SVG goes here */}</div>;
}
```

## Accessibility and performance

- `prefers-reduced-motion` and low data mode show one still frame: the final scene (the figure giving a thumbs up, with the Catlas name and description).
- Pause the timeline when the section is off screen (an `IntersectionObserver` that calls `pause()` and `play()`).
- Give the SVG `role="img"` and an `aria-label` such as "A person searches for a building on a phone, follows the route, arrives, and gives a thumbs up."
- Keep the file small: simple shapes only, no embedded images, a fixed aspect ratio.
- The loop must not flash. Fade between scenes, never cut hard.

## Assets to prepare in Figma

Draw the stick figure parts (including hands and the thumb), the phone with its status bar and camera, the three phone screens, the building, the posts, the happy cat and the vibration marks as separate named layers, with the ids from the layer map. Draw the figure once and test both colours. Export as one SVG, then clean it up by hand.

## Figma prompt for the key stills (optional)

```
Use the existing variables. Create nine frames at 1200 x 675 on the current page, dark mode, flat, no gradients, no emojis. A thick stick figure in the brand blue: round head, thick rounded limbs (16 px stroke), round hands. The phone looks like a real phone: rounded body, a punch-hole front camera at the top, a status bar with the time "10:24", signal bars, Wi-Fi and a battery icon with "82%", a home indicator, and side buttons.
Frames: "Anim 1 - phone enters" (a hand holding the phone, screen just switched on, rising from the bottom); "Anim 2 - search" (the phone fills the frame, a search field with "Mechatronics Lab" and three result rows); "Anim 3 - map" (the phone shows a map with a blue dot, a red pin and a shortened red dashed trail, "850 m"); "Anim 4 - zoom out" (the figure holding the phone on flat ground, a small campus building far away on the right); "Anim 5 - walking" (the figure mid-step, the building larger); "Anim 6 - vibrate" (the figure in front of a big building, the phone with three vibration marks on each side); "Anim 7 - notification" (the phone close up with a card: a cat placeholder and "Congratulations, you have reached your final destination."); "Anim 8 - thumbs up" (the figure on the left third giving a thumbs up, the building behind); "Anim 9 - brand" (the same, with the name "Catlas" in Tinos bold on the right and the line "Catlas helps you find any place on campus and know what is inside.").
Photos are grey rectangles and the cat is a plain circle labelled "cat". Also make a light-mode copy of Anim 9 with the figure in black.
```

## Open question for the owner

Confirm the library: Anime.js (recommended), GSAP, or Motion.
