# Catlas Design System

Colours, fonts, animation, cats, logo and design references. The owner's provided designs always win over anything written here.

- **Colour split:** white `#ffffff` 60%, blue 20%, ash `#333333` 10%, black `#000000` 10%.
- **Buttons:** solid blue. On hover the button background becomes lighter. Secondary buttons use ash with white text. Destructive actions use red.
- **Minor colours** (the owner left these to the agent): red `#ef4444` for errors, the route trail and the destination pin; emerald `#10b981` for success and arrival; light grey `#e5e7eb` for borders; mid grey `#6b7280` for muted text. These utility colours are not part of the percentage split.
- **Typography:** Arial for body and UI, Times New Roman for headings. Most Android phones do not ship these two fonts, so self-host the look-alikes **Arimo** (for Arial) and **Tinos** (for Times New Roman) from `apps/web/public/fonts/` as fallbacks (decided). They have the same letter widths, so layouts do not shift. Load only the regular and bold weights as `.woff2` files, with `font-display: swap`, declared in `apps/web/src/styles/fonts.css`. Keep their licence text in `fonts-licence.txt`.
- **Icons:** always from the icon package. Never emojis, never hand-pasted SVGs when an icon exists. Every icon has a light animation (for example, the location icon bobs up and down like a map pin).
- **Cards** (bordered containers) lift upward on hover and show a shadow underneath to show they were lifted.
- **Animation:** use Motion for page transitions, cards, icons, modals and messages. Keep it short and light for slow phones. Turn animation off for `prefers-reduced-motion` and in low data mode.
- **Error messages:** red, with an animation of a crying cat. Always include clear text too.
- **Success and congratulation messages:** an animation of a happy cat. It appears on arrival at the destination, when an account is created, and when an email is verified.
- **404 and empty screens:** show a cat animation with a short line of text (the crying cat for 404; a calm waiting cat for empty screens such as no results, no bookmarks or no classes). The cat animations are inline components in `apps/web/src/components/cats/`, not SVG files to be supplied. On the 404 page the crying cat holds a magnifying glass and looks around for what was not found. The calm waiting cat is still a stub.
- **Logo (supplied):** the product logo is the owner's file `Four columns.png` at the repository root. It is copied to `apps/web/public/logo.png` and it is what the header, footer and join page brand marks show. It is also the favicon source (`apps/web/public/favicon.ico`, `icon-192.png` and `apple-touch-icon.png`). It is a blue campus-style building with a location pin cut into it, on a dark `#17181c` square. Do not redraw, recolour or crop it differently.
- **Provided designs:** the owner provides the designs for the website. Copy the layout exactly. Do not redesign, rearrange or "improve" it, and do not change anything the owner has specified.
- **Themes:** Dark, Sepia, AMOLED and Midnight are available. Sepia uses the owner's coconut and softened cream palette. AMOLED uses a true black background; Midnight uses deep navy surfaces. The theme choice is saved on the device and revealed with the theme transition.
- Mobile-first.

Never hardcode colours or fonts in components. Use the tokens in `apps/web/src/styles/tokens.css`. The blue is `#1d4ed8` and the lighter hover blue is `#2563eb` (the owner may change them).

Theme colors are defined in `apps/web/src/styles/tokens.css`. Keep those
tokens in sync with this theme list when adding or changing a theme.

## Contrast rules (decided)

Text must reach a contrast ratio of 4.5:1 against its background (3:1 for large text and icons). Approximate checked values: white on blue `#1d4ed8` 6.7:1; white on hover blue `#2563eb` 5.2:1; muted grey `#6b7280` on white 4.8:1; red text `#dc2626` on white 4.8:1; emerald text `#047857` on white 5.5:1.

The lighter hover blue from the first plan (`#3b82f6`) was too light for white text (about 3.7:1), so hover uses `#2563eb`. Red `#ef4444` and emerald `#10b981` are used only for graphics, icons, the pin and the trail, not for small text.

## Design references

The owner will provide the final website designs, modified from the reference screens below (screenshots of Figma community files). Use the references for layout ideas only.

- Use the Catlas colours (white, blue, ash, black). Do not use the purple and pink of the references.
- Do not reuse the TUP Navigate name, logo or photos. They belong to another university. The Catlas logo (`Four columns.png`, copied to `apps/web/public/logo.png`) and the demo photos come from the owner.

Reference screens:

1. **Splash screen:** the logo and the name centred on a soft gradient.
2. **Home:** a wide photo at the top, the app name, a rounded search bar labelled "Explore", a "Legend" row of small tiles (an icon and a short code, with a "See all" link), and a "Category" grid of photo cards, each with a title and a floor count.
3. **Building detail:** a back button, a large rounded photo with a shadow, the building name, three outlined pills ("5 floors", "42 rooms", "labs"), and an "About the building" card with a heading and a short description.
4. **Map view:** a top bar with a back button, the title "MAP VIEW" and a profile icon; a compass button and zoom in and zoom out buttons on the map; a bottom sheet with a pin icon, the building name and timings, and a **Go to Details** button.

How Catlas adapts them:

- The building pills (floors, rooms, labs) are counted from the building's indoor places: floors are the number of different floors, rooms are the number of rooms, and labs are the places typed as lab. The owner can override the numbers.
- The map view's **Go to Details** button opens the location card.
- A splash screen shows the logo and name for a moment when the app first loads.
- **Home screen (decided):** top to bottom: the photo and the Explore search bar, recent searches as chips, the Next class card, Events, Announcements, a Legend row of faculty tiles (each opens that faculty's buildings), then Category cards (building types such as Laboratory and Library, with floor counts). Nearby places are not listed on Home; the Near me shortcut searches for and displays nearby buildings using the user's location.
- **Opening hours (decided):** each building can have optional opening hours. If set, they show on the map sheet and the location card. If empty, nothing is shown.

