# Catlas Design Prompts

Prompts for generating the Catlas app designs, the landing page, and the images. Everything is in one place. Use them with any AI design or image tool.

## How to use

1. Image tools often garble small text and forget earlier messages. Generate **one screen at a time**.
2. In a chat tool that remembers the conversation, paste the **style prompt** once, then paste one screen prompt at a time.
3. In a tool that does not remember, use the **ready-to-paste** version of each screen (Part 4). It already includes the style.
4. Treat the results as layout and mood references. Final text, colours and spacing are rebuilt in code from `docs/DESIGN.md`.
5. The reference screens in `docs/DESIGN.md` are layout ideas only. Do not copy their names, logos or photos.
6. Use your own photos for the real buildings. Generated photos are best used for the hero image only.

## Part 1: Style prompt (paste first)

```
You are a senior product designer. Design screens for Catlas (Campus Navigation System), a mobile-first web app that helps students and visitors at Nigerian universities find places on campus, see what is inside each building, and follow a walking route on a 2D map.

COLOURS by share of each screen:
- White #FFFFFF 60%
- Blue #1D4ED8 20% (primary buttons, active states, links, the logo building)
- Ash #333333 10% (secondary buttons, secondary text)
- Black #000000 10% (headings and body text)
Hover blue #2563EB. Utility colours: red #EF4444 (errors, route trail, destination pin), emerald #10B981 (success), border grey #E5E7EB, muted text #6B7280. No purple, no pink, no gradients.

TYPE: headings in Times New Roman (serif). Body and UI in Arial.

COMPONENTS:
- Cards: white, 1px #E5E7EB border, 16px radius, soft shadow underneath.
- Buttons: solid blue, white text, 12px radius, 48px tall.
- Icons: simple line icons, one consistent stroke width, Lucide style. No emojis anywhere.

LAYOUT: mobile first, 390 x 844 px, 8px grid, generous spacing.

CONTENT: realistic sample content for a Nigerian university ("Faculty of Engineering Block A", "Central Library", "Mechatronics Lab", real-looking course codes and times). No lorem ipsum.

TONE: calm, clear, trustworthy, like a well-made maps or banking app that real people use daily.

MAKE IT LOOK LIKE A REAL SHIPPED PRODUCT, NOT AN AI CONCEPT:
- Flat, simple, standard components. No glassmorphism, no glow, no 3D blobs, no neon, no futuristic holograms.
- No perfectly symmetric or over-polished layouts. Use natural spacing and normal text sizes.
- All text must be spelled correctly and readable.
- No stock-style smiling people holding phones.
```

## Part 2: Landing page

```
Design the Catlas landing page. Make a mobile version (390 px wide) and a desktop version (1440 px wide), using the style prompt.

Sections in order:
1. Header: logo and name "Catlas" on the left, a "Join waitlist" button on the right.
2. Hero: a headline and one short sentence saying Catlas helps you find any place on campus and see what is inside. Add a "Join waitlist" button. Behind it, a real-looking photograph of a Nigerian campus path with a white overlay so the text stays readable.
3. Animation section: a flat, minimal map with a blue dot (the user), a red pin (the destination) and a red dashed trail between them. Add a one-line caption. (It will be built as a looping SVG animation.)
4. How it works: three steps with line icons: Search, Navigate, Arrive.
5. About: three cards: who it is for (students and visitors), how it is used, and how it helps.
6. FAQ: six questions in an accordion, one open.
7. Newsletter: an email field and a Subscribe button.
8. Footer: logo, name and a one-line description, social icons (Instagram, Threads, LinkedIn, GitHub, X), links to Privacy Policy, Terms of Service and Feedback. Bottom bar: "Copyright 2026 and all rights reserved", "Fadero Joshua (phadecoh)", and links to GitHub and Portfolio.

Also show the waitlist form as a modal with fields: name, school, faculty, department, level, email.
```

## Part 3: App screens (one prompt each, after the style prompt)

### Splash

```
SPLASH: the logo centred on a plain white screen with the name "Catlas" in Times New Roman and a small line "Find your way around campus".
```

### Login

```
LOGIN: a school dropdown, a field for JAMB Reg. No or matric number, a password field, a blue "Log in" button, "Forgot password?", a "Create account" link, and a secondary ash outline button "Continue as guest". Under the form, a small consent line linking to the Privacy Policy and Terms.
```

### Home

```
HOME: shared Catlas header with the user's surname after the time-of-day greeting, a wide campus photo with a rounded search bar labelled "Explore", then recent searches, a "Next class" card, Events, Announcements, a "Legend" row of faculty tiles, and a "Category" row of building type cards. Nearby buildings are found through the Near me shortcut, which searches by the user's current location. Bottom navigation: Home, Search, Classroom, Settings, Catline.
```

### Search

```
SEARCH: a search bar, filter chips (Most bookmarked, Mini mart, Library, Labs, Hostels), and a results list with a photo thumbnail, building name and bookmark icon. Also show a "Did you mean..." state and a "Not found" state with a calm sitting cat illustration and one line of text.
```

### Building detail

```
BUILDING DETAIL: back button, a large rounded photo with a soft shadow, the building name, a bookmark icon, three outlined pills ("5 floors", "42 rooms", "3 labs"), an "About the building" card, an "Inside this building" list of offices and classes with floor labels, a "Report a problem" text link, and a blue "Take me there" button.
```

### Map view

```
MAP VIEW (draw three states):
1. Normal: a clean 2D map, blue dot for the user, red pin for the destination, a red trail, a compass button and zoom buttons on the right, and a bottom sheet with the building name, "850 m, 11 min walk", a "Go to Details" button and a "Stop" button.
2. Off the trail: the same screen with a banner "Readjusting and redirecting trail".
3. Arrival: a happy cat illustration and the text "Congratulations, you have reached your final destination."
```

### Classroom

```
CLASSROOM: two tabs, Classes and Assignments. Class cards show course code, title, time and venue. Show one card with a red "Cancelled" badge and one with a blue "Moved" badge that shows the old time. Assignment cards show the deadline and "Submit at: [location]".
```

### Settings and account

```
SETTINGS AND ACCOUNT: a settings list (Account, Feedback, Low data mode toggle, Privacy Policy, Terms of Service, Log out). Then the Account page: profile photo with an upload button, surname, first name, school and department, and a red "Delete account" button. Do not include a username field; Catlas does not use usernames. Also show the confirmation dialog: "Type delete account to confirm", a password field, and a warning that this cannot be undone.
```

### Error, success, 404 and empty states

```
STATES: a 404 page with a crying cat and the text "Page not found", an error message in red with a small crying cat, a success message with a happy cat ("Account created"), and an empty state with a calm cat ("No classes posted yet").
```

## Part 4: Ready to paste (style plus screen)

Each block below already contains the style prompt, so it works in a tool that does not remember earlier messages.

### Landing page

<details>
<summary>Show prompt</summary>

```
You are a senior product designer. Design screens for Catlas (Campus Navigation System), a mobile-first web app that helps students and visitors at Nigerian universities find places on campus, see what is inside each building, and follow a walking route on a 2D map.

COLOURS by share of each screen:
- White #FFFFFF 60%
- Blue #1D4ED8 20% (primary buttons, active states, links, the logo building)
- Ash #333333 10% (secondary buttons, secondary text)
- Black #000000 10% (headings and body text)
Hover blue #2563EB. Utility colours: red #EF4444 (errors, route trail, destination pin), emerald #10B981 (success), border grey #E5E7EB, muted text #6B7280. No purple, no pink, no gradients.

TYPE: headings in Times New Roman (serif). Body and UI in Arial.

COMPONENTS:
- Cards: white, 1px #E5E7EB border, 16px radius, soft shadow underneath.
- Buttons: solid blue, white text, 12px radius, 48px tall.
- Icons: simple line icons, one consistent stroke width, Lucide style. No emojis anywhere.

LAYOUT: mobile first, 390 x 844 px, 8px grid, generous spacing.

CONTENT: realistic sample content for a Nigerian university ("Faculty of Engineering Block A", "Central Library", "Mechatronics Lab", real-looking course codes and times). No lorem ipsum.

TONE: calm, clear, trustworthy, like a well-made maps or banking app that real people use daily.

MAKE IT LOOK LIKE A REAL SHIPPED PRODUCT, NOT AN AI CONCEPT:
- Flat, simple, standard components. No glassmorphism, no glow, no 3D blobs, no neon, no futuristic holograms.
- No perfectly symmetric or over-polished layouts. Use natural spacing and normal text sizes.
- All text must be spelled correctly and readable.
- No stock-style smiling people holding phones.

Design the Catlas landing page. Make a mobile version (390 px wide) and a desktop version (1440 px wide), using the style prompt.

Sections in order:
1. Header: logo and name "Catlas" on the left, a "Join waitlist" button on the right.
2. Hero: a headline and one short sentence saying Catlas helps you find any place on campus and see what is inside. Add a "Join waitlist" button. Behind it, a real-looking photograph of a Nigerian campus path with a white overlay so the text stays readable.
3. Animation section: a flat, minimal map with a blue dot (the user), a red pin (the destination) and a red dashed trail between them. Add a one-line caption. (It will be built as a looping SVG animation.)
4. How it works: three steps with line icons: Search, Navigate, Arrive.
5. About: three cards: who it is for (students and visitors), how it is used, and how it helps.
6. FAQ: six questions in an accordion, one open.
7. Newsletter: an email field and a Subscribe button.
8. Footer: logo, name and a one-line description, social icons (Instagram, Threads, LinkedIn, GitHub, X), links to Privacy Policy, Terms of Service and Feedback. Bottom bar: "Copyright 2026 and all rights reserved", "Fadero Joshua (phadecoh)", and links to GitHub and Portfolio.

Also show the waitlist form as a modal with fields: name, school, faculty, department, level, email.
```

</details>

### Splash

<details>
<summary>Show prompt</summary>

```
You are a senior product designer. Design screens for Catlas (Campus Navigation System), a mobile-first web app that helps students and visitors at Nigerian universities find places on campus, see what is inside each building, and follow a walking route on a 2D map.

COLOURS by share of each screen:
- White #FFFFFF 60%
- Blue #1D4ED8 20% (primary buttons, active states, links, the logo building)
- Ash #333333 10% (secondary buttons, secondary text)
- Black #000000 10% (headings and body text)
Hover blue #2563EB. Utility colours: red #EF4444 (errors, route trail, destination pin), emerald #10B981 (success), border grey #E5E7EB, muted text #6B7280. No purple, no pink, no gradients.

TYPE: headings in Times New Roman (serif). Body and UI in Arial.

COMPONENTS:
- Cards: white, 1px #E5E7EB border, 16px radius, soft shadow underneath.
- Buttons: solid blue, white text, 12px radius, 48px tall.
- Icons: simple line icons, one consistent stroke width, Lucide style. No emojis anywhere.

LAYOUT: mobile first, 390 x 844 px, 8px grid, generous spacing.

CONTENT: realistic sample content for a Nigerian university ("Faculty of Engineering Block A", "Central Library", "Mechatronics Lab", real-looking course codes and times). No lorem ipsum.

TONE: calm, clear, trustworthy, like a well-made maps or banking app that real people use daily.

MAKE IT LOOK LIKE A REAL SHIPPED PRODUCT, NOT AN AI CONCEPT:
- Flat, simple, standard components. No glassmorphism, no glow, no 3D blobs, no neon, no futuristic holograms.
- No perfectly symmetric or over-polished layouts. Use natural spacing and normal text sizes.
- All text must be spelled correctly and readable.
- No stock-style smiling people holding phones.

SPLASH: the logo centred on a plain white screen with the name "Catlas" in Times New Roman and a small line "Find your way around campus".
```

</details>

### Login

<details>
<summary>Show prompt</summary>

```
You are a senior product designer. Design screens for Catlas (Campus Navigation System), a mobile-first web app that helps students and visitors at Nigerian universities find places on campus, see what is inside each building, and follow a walking route on a 2D map.

COLOURS by share of each screen:
- White #FFFFFF 60%
- Blue #1D4ED8 20% (primary buttons, active states, links, the logo building)
- Ash #333333 10% (secondary buttons, secondary text)
- Black #000000 10% (headings and body text)
Hover blue #2563EB. Utility colours: red #EF4444 (errors, route trail, destination pin), emerald #10B981 (success), border grey #E5E7EB, muted text #6B7280. No purple, no pink, no gradients.

TYPE: headings in Times New Roman (serif). Body and UI in Arial.

COMPONENTS:
- Cards: white, 1px #E5E7EB border, 16px radius, soft shadow underneath.
- Buttons: solid blue, white text, 12px radius, 48px tall.
- Icons: simple line icons, one consistent stroke width, Lucide style. No emojis anywhere.

LAYOUT: mobile first, 390 x 844 px, 8px grid, generous spacing.

CONTENT: realistic sample content for a Nigerian university ("Faculty of Engineering Block A", "Central Library", "Mechatronics Lab", real-looking course codes and times). No lorem ipsum.

TONE: calm, clear, trustworthy, like a well-made maps or banking app that real people use daily.

MAKE IT LOOK LIKE A REAL SHIPPED PRODUCT, NOT AN AI CONCEPT:
- Flat, simple, standard components. No glassmorphism, no glow, no 3D blobs, no neon, no futuristic holograms.
- No perfectly symmetric or over-polished layouts. Use natural spacing and normal text sizes.
- All text must be spelled correctly and readable.
- No stock-style smiling people holding phones.

LOGIN: a school dropdown, a field for JAMB Reg. No or matric number, a password field, a blue "Log in" button, "Forgot password?", a "Create account" link, and a secondary ash outline button "Continue as guest". Under the form, a small consent line linking to the Privacy Policy and Terms.
```

</details>

### Home

<details>
<summary>Show prompt</summary>

```
You are a senior product designer. Design screens for Catlas (Campus Navigation System), a mobile-first web app that helps students and visitors at Nigerian universities find places on campus, see what is inside each building, and follow a walking route on a 2D map.

COLOURS by share of each screen:
- White #FFFFFF 60%
- Blue #1D4ED8 20% (primary buttons, active states, links, the logo building)
- Ash #333333 10% (secondary buttons, secondary text)
- Black #000000 10% (headings and body text)
Hover blue #2563EB. Utility colours: red #EF4444 (errors, route trail, destination pin), emerald #10B981 (success), border grey #E5E7EB, muted text #6B7280. No purple, no pink, no gradients.

TYPE: headings in Times New Roman (serif). Body and UI in Arial.

COMPONENTS:
- Cards: white, 1px #E5E7EB border, 16px radius, soft shadow underneath.
- Buttons: solid blue, white text, 12px radius, 48px tall.
- Icons: simple line icons, one consistent stroke width, Lucide style. No emojis anywhere.

LAYOUT: mobile first, 390 x 844 px, 8px grid, generous spacing.

CONTENT: realistic sample content for a Nigerian university ("Faculty of Engineering Block A", "Central Library", "Mechatronics Lab", real-looking course codes and times). No lorem ipsum.

TONE: calm, clear, trustworthy, like a well-made maps or banking app that real people use daily.

MAKE IT LOOK LIKE A REAL SHIPPED PRODUCT, NOT AN AI CONCEPT:
- Flat, simple, standard components. No glassmorphism, no glow, no 3D blobs, no neon, no futuristic holograms.
- No perfectly symmetric or over-polished layouts. Use natural spacing and normal text sizes.
- All text must be spelled correctly and readable.
- No stock-style smiling people holding phones.

HOME: shared Catlas header with the user's surname after the time-of-day greeting, a wide campus photo with a rounded search bar labelled "Explore", then recent searches, a "Next class" card, Events, Announcements, a "Legend" row of faculty tiles, and a "Category" row of building type cards. Nearby buildings are found through the Near me shortcut, which searches by the user's current location. Bottom navigation: Home, Search, Classroom, Settings, Catline.
```

</details>

### Search

<details>
<summary>Show prompt</summary>

```
You are a senior product designer. Design screens for Catlas (Campus Navigation System), a mobile-first web app that helps students and visitors at Nigerian universities find places on campus, see what is inside each building, and follow a walking route on a 2D map.

COLOURS by share of each screen:
- White #FFFFFF 60%
- Blue #1D4ED8 20% (primary buttons, active states, links, the logo building)
- Ash #333333 10% (secondary buttons, secondary text)
- Black #000000 10% (headings and body text)
Hover blue #2563EB. Utility colours: red #EF4444 (errors, route trail, destination pin), emerald #10B981 (success), border grey #E5E7EB, muted text #6B7280. No purple, no pink, no gradients.

TYPE: headings in Times New Roman (serif). Body and UI in Arial.

COMPONENTS:
- Cards: white, 1px #E5E7EB border, 16px radius, soft shadow underneath.
- Buttons: solid blue, white text, 12px radius, 48px tall.
- Icons: simple line icons, one consistent stroke width, Lucide style. No emojis anywhere.

LAYOUT: mobile first, 390 x 844 px, 8px grid, generous spacing.

CONTENT: realistic sample content for a Nigerian university ("Faculty of Engineering Block A", "Central Library", "Mechatronics Lab", real-looking course codes and times). No lorem ipsum.

TONE: calm, clear, trustworthy, like a well-made maps or banking app that real people use daily.

MAKE IT LOOK LIKE A REAL SHIPPED PRODUCT, NOT AN AI CONCEPT:
- Flat, simple, standard components. No glassmorphism, no glow, no 3D blobs, no neon, no futuristic holograms.
- No perfectly symmetric or over-polished layouts. Use natural spacing and normal text sizes.
- All text must be spelled correctly and readable.
- No stock-style smiling people holding phones.

SEARCH: a search bar, filter chips (Most bookmarked, Mini mart, Library, Labs, Hostels), and a results list with a photo thumbnail, building name and bookmark icon. Also show a "Did you mean..." state and a "Not found" state with a calm sitting cat illustration and one line of text.
```

</details>

### Building detail

<details>
<summary>Show prompt</summary>

```
You are a senior product designer. Design screens for Catlas (Campus Navigation System), a mobile-first web app that helps students and visitors at Nigerian universities find places on campus, see what is inside each building, and follow a walking route on a 2D map.

COLOURS by share of each screen:
- White #FFFFFF 60%
- Blue #1D4ED8 20% (primary buttons, active states, links, the logo building)
- Ash #333333 10% (secondary buttons, secondary text)
- Black #000000 10% (headings and body text)
Hover blue #2563EB. Utility colours: red #EF4444 (errors, route trail, destination pin), emerald #10B981 (success), border grey #E5E7EB, muted text #6B7280. No purple, no pink, no gradients.

TYPE: headings in Times New Roman (serif). Body and UI in Arial.

COMPONENTS:
- Cards: white, 1px #E5E7EB border, 16px radius, soft shadow underneath.
- Buttons: solid blue, white text, 12px radius, 48px tall.
- Icons: simple line icons, one consistent stroke width, Lucide style. No emojis anywhere.

LAYOUT: mobile first, 390 x 844 px, 8px grid, generous spacing.

CONTENT: realistic sample content for a Nigerian university ("Faculty of Engineering Block A", "Central Library", "Mechatronics Lab", real-looking course codes and times). No lorem ipsum.

TONE: calm, clear, trustworthy, like a well-made maps or banking app that real people use daily.

MAKE IT LOOK LIKE A REAL SHIPPED PRODUCT, NOT AN AI CONCEPT:
- Flat, simple, standard components. No glassmorphism, no glow, no 3D blobs, no neon, no futuristic holograms.
- No perfectly symmetric or over-polished layouts. Use natural spacing and normal text sizes.
- All text must be spelled correctly and readable.
- No stock-style smiling people holding phones.

BUILDING DETAIL: back button, a large rounded photo with a soft shadow, the building name, a bookmark icon, three outlined pills ("5 floors", "42 rooms", "3 labs"), an "About the building" card, an "Inside this building" list of offices and classes with floor labels, a "Report a problem" text link, and a blue "Take me there" button.
```

</details>

### Map view

<details>
<summary>Show prompt</summary>

```
You are a senior product designer. Design screens for Catlas (Campus Navigation System), a mobile-first web app that helps students and visitors at Nigerian universities find places on campus, see what is inside each building, and follow a walking route on a 2D map.

COLOURS by share of each screen:
- White #FFFFFF 60%
- Blue #1D4ED8 20% (primary buttons, active states, links, the logo building)
- Ash #333333 10% (secondary buttons, secondary text)
- Black #000000 10% (headings and body text)
Hover blue #2563EB. Utility colours: red #EF4444 (errors, route trail, destination pin), emerald #10B981 (success), border grey #E5E7EB, muted text #6B7280. No purple, no pink, no gradients.

TYPE: headings in Times New Roman (serif). Body and UI in Arial.

COMPONENTS:
- Cards: white, 1px #E5E7EB border, 16px radius, soft shadow underneath.
- Buttons: solid blue, white text, 12px radius, 48px tall.
- Icons: simple line icons, one consistent stroke width, Lucide style. No emojis anywhere.

LAYOUT: mobile first, 390 x 844 px, 8px grid, generous spacing.

CONTENT: realistic sample content for a Nigerian university ("Faculty of Engineering Block A", "Central Library", "Mechatronics Lab", real-looking course codes and times). No lorem ipsum.

TONE: calm, clear, trustworthy, like a well-made maps or banking app that real people use daily.

MAKE IT LOOK LIKE A REAL SHIPPED PRODUCT, NOT AN AI CONCEPT:
- Flat, simple, standard components. No glassmorphism, no glow, no 3D blobs, no neon, no futuristic holograms.
- No perfectly symmetric or over-polished layouts. Use natural spacing and normal text sizes.
- All text must be spelled correctly and readable.
- No stock-style smiling people holding phones.

MAP VIEW (draw three states):
1. Normal: a clean 2D map, blue dot for the user, red pin for the destination, a red trail, a compass button and zoom buttons on the right, and a bottom sheet with the building name, "850 m, 11 min walk", a "Go to Details" button and a "Stop" button.
2. Off the trail: the same screen with a banner "Readjusting and redirecting trail".
3. Arrival: a happy cat illustration and the text "Congratulations, you have reached your final destination."
```

</details>

### Classroom

<details>
<summary>Show prompt</summary>

```
You are a senior product designer. Design screens for Catlas (Campus Navigation System), a mobile-first web app that helps students and visitors at Nigerian universities find places on campus, see what is inside each building, and follow a walking route on a 2D map.

COLOURS by share of each screen:
- White #FFFFFF 60%
- Blue #1D4ED8 20% (primary buttons, active states, links, the logo building)
- Ash #333333 10% (secondary buttons, secondary text)
- Black #000000 10% (headings and body text)
Hover blue #2563EB. Utility colours: red #EF4444 (errors, route trail, destination pin), emerald #10B981 (success), border grey #E5E7EB, muted text #6B7280. No purple, no pink, no gradients.

TYPE: headings in Times New Roman (serif). Body and UI in Arial.

COMPONENTS:
- Cards: white, 1px #E5E7EB border, 16px radius, soft shadow underneath.
- Buttons: solid blue, white text, 12px radius, 48px tall.
- Icons: simple line icons, one consistent stroke width, Lucide style. No emojis anywhere.

LAYOUT: mobile first, 390 x 844 px, 8px grid, generous spacing.

CONTENT: realistic sample content for a Nigerian university ("Faculty of Engineering Block A", "Central Library", "Mechatronics Lab", real-looking course codes and times). No lorem ipsum.

TONE: calm, clear, trustworthy, like a well-made maps or banking app that real people use daily.

MAKE IT LOOK LIKE A REAL SHIPPED PRODUCT, NOT AN AI CONCEPT:
- Flat, simple, standard components. No glassmorphism, no glow, no 3D blobs, no neon, no futuristic holograms.
- No perfectly symmetric or over-polished layouts. Use natural spacing and normal text sizes.
- All text must be spelled correctly and readable.
- No stock-style smiling people holding phones.

CLASSROOM: two tabs, Classes and Assignments. Class cards show course code, title, time and venue. Show one card with a red "Cancelled" badge and one with a blue "Moved" badge that shows the old time. Assignment cards show the deadline and "Submit at: [location]".
```

</details>

### Settings and account

<details>
<summary>Show prompt</summary>

```
You are a senior product designer. Design screens for Catlas (Campus Navigation System), a mobile-first web app that helps students and visitors at Nigerian universities find places on campus, see what is inside each building, and follow a walking route on a 2D map.

COLOURS by share of each screen:
- White #FFFFFF 60%
- Blue #1D4ED8 20% (primary buttons, active states, links, the logo building)
- Ash #333333 10% (secondary buttons, secondary text)
- Black #000000 10% (headings and body text)
Hover blue #2563EB. Utility colours: red #EF4444 (errors, route trail, destination pin), emerald #10B981 (success), border grey #E5E7EB, muted text #6B7280. No purple, no pink, no gradients.

TYPE: headings in Times New Roman (serif). Body and UI in Arial.

COMPONENTS:
- Cards: white, 1px #E5E7EB border, 16px radius, soft shadow underneath.
- Buttons: solid blue, white text, 12px radius, 48px tall.
- Icons: simple line icons, one consistent stroke width, Lucide style. No emojis anywhere.

LAYOUT: mobile first, 390 x 844 px, 8px grid, generous spacing.

CONTENT: realistic sample content for a Nigerian university ("Faculty of Engineering Block A", "Central Library", "Mechatronics Lab", real-looking course codes and times). No lorem ipsum.

TONE: calm, clear, trustworthy, like a well-made maps or banking app that real people use daily.

MAKE IT LOOK LIKE A REAL SHIPPED PRODUCT, NOT AN AI CONCEPT:
- Flat, simple, standard components. No glassmorphism, no glow, no 3D blobs, no neon, no futuristic holograms.
- No perfectly symmetric or over-polished layouts. Use natural spacing and normal text sizes.
- All text must be spelled correctly and readable.
- No stock-style smiling people holding phones.

SETTINGS AND ACCOUNT: a settings list (Account, Feedback, Low data mode toggle, Privacy Policy, Terms of Service, Log out). Then the Account page: profile photo with an upload button, surname, first name, school and department, and a red "Delete account" button. Do not include a username field; Catlas does not use usernames. Also show the confirmation dialog: "Type delete account to confirm", a password field, and a warning that this cannot be undone.
```

</details>

### Error, success, 404 and empty states

<details>
<summary>Show prompt</summary>

```
You are a senior product designer. Design screens for Catlas (Campus Navigation System), a mobile-first web app that helps students and visitors at Nigerian universities find places on campus, see what is inside each building, and follow a walking route on a 2D map.

COLOURS by share of each screen:
- White #FFFFFF 60%
- Blue #1D4ED8 20% (primary buttons, active states, links, the logo building)
- Ash #333333 10% (secondary buttons, secondary text)
- Black #000000 10% (headings and body text)
Hover blue #2563EB. Utility colours: red #EF4444 (errors, route trail, destination pin), emerald #10B981 (success), border grey #E5E7EB, muted text #6B7280. No purple, no pink, no gradients.

TYPE: headings in Times New Roman (serif). Body and UI in Arial.

COMPONENTS:
- Cards: white, 1px #E5E7EB border, 16px radius, soft shadow underneath.
- Buttons: solid blue, white text, 12px radius, 48px tall.
- Icons: simple line icons, one consistent stroke width, Lucide style. No emojis anywhere.

LAYOUT: mobile first, 390 x 844 px, 8px grid, generous spacing.

CONTENT: realistic sample content for a Nigerian university ("Faculty of Engineering Block A", "Central Library", "Mechatronics Lab", real-looking course codes and times). No lorem ipsum.

TONE: calm, clear, trustworthy, like a well-made maps or banking app that real people use daily.

MAKE IT LOOK LIKE A REAL SHIPPED PRODUCT, NOT AN AI CONCEPT:
- Flat, simple, standard components. No glassmorphism, no glow, no 3D blobs, no neon, no futuristic holograms.
- No perfectly symmetric or over-polished layouts. Use natural spacing and normal text sizes.
- All text must be spelled correctly and readable.
- No stock-style smiling people holding phones.

STATES: a 404 page with a crying cat and the text "Page not found", an error message in red with a small crying cat, a success message with a happy cat ("Account created"), and an empty state with a calm cat ("No classes posted yet").
```

</details>

## Part 5: Images that do not look AI-made

Add this line to every photo request:

```
Documentary-style photograph, shot on a normal phone camera, natural daylight, slight grain, slightly imperfect framing, real-world details (cracked paint, parked bikes, signage). No HDR glow, no lens flare, no teal-and-orange grading, no perfect symmetry, no readable text, no recognisable faces.
```

### Hero background

```
A paved walkway on a Nigerian university campus, low-rise concrete buildings, palm trees, a few students walking in the distance, soft morning light. Wide landscape, empty space on the left for text. Documentary-style photograph, shot on a normal phone camera, natural daylight, slight grain, slightly imperfect framing, real-world details (cracked paint, parked bikes, signage). No HDR glow, no lens flare, no teal-and-orange grading, no perfect symmetry, no readable text, no recognisable faces.
```

### Logo

The logo is supplied and final. Do not prompt for or generate another one.

- Source file: `Four columns.png` at the repository root.
- Website copy: `apps/web/public/logo.png`.
- Favicon and app icons: `apps/web/public/favicon.ico`, `icon-192.png` and `apple-touch-icon.png`, made from the same file.
- It is a flat blue campus-style building with a map location pin cut into it, on a dark `#17181c` square. No gradients, no shadows, no text. It stays clear at 16 px.

For reference only, the supplied logo in words:

```
A flat vector logo: a simple campus-style building in solid blue #1D4ED8, with a map location pin cut into the building in the dark background colour #17181C. Square canvas, dark #17181C background. No gradients, no shadows, no text. It must stay clear at 16 px.
```

### Cats (ask for each one separately: crying, happy, calm)

```
A simple flat vector cat illustration, hand-drawn feel, limited palette (ash #333333, white, blue #1D4ED8, red #EF4444 for tears). Pose: [crying / happy / calm and sitting]. Clean SVG with the eyes, tears, tail and paws as separate named groups so they can be animated later. Plain white background, no text.
```

## Checklist before you accept a result

- Text is spelled correctly and readable
- Only the Catlas colours are used: white, blue, ash, black, plus red and emerald for status
- Headings are serif (Times New Roman look) and body text is sans-serif (Arial look)
- No emojis, no purple or pink, no glow or 3D effects
- Cards, buttons and icons look the same on every screen
- Photos show no readable text, no recognisable faces and no odd hands or distorted signs
- The logo is still clear when shrunk to 16 px
