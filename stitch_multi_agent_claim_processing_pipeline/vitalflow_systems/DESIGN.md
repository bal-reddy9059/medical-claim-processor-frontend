# Design System Strategy: The Clinical Precisionist

## 1. Overview & Creative North Star
This design system is anchored by the Creative North Star: **"The Clinical Precisionist."** 

In the high-stakes world of medical-tech claim processing, the UI must move beyond "efficient" to become "authoritative." We reject the cluttered, boxy aesthetic of legacy insurance software. Instead, this system utilizes an editorial approach characterized by **The Breath of Logic**—using expansive white space, intentional asymmetry, and tonal depth to guide the eye toward critical decision-making data. We treat data not as a chore to be managed, but as a narrative to be curated.

By prioritizing typographic hierarchy and layered surfaces over rigid lines, we create an environment that feels as sterile and trustworthy as a modern surgical suite, yet as intuitive as a premium consumer application.

---

## 2. Colors & Surface Architecture
The palette is a sophisticated range of medical blues and neutral grays, designed to reduce cognitive fatigue during long sessions.

### The "No-Line" Rule
To achieve a high-end, bespoke feel, **1px solid borders are strictly prohibited for sectioning.** Boundaries must be defined through background color shifts. 
- Use `surface` (#f7f9fb) for the primary application background.
- Use `surface-container-low` (#f2f4f6) for secondary sidebars.
- Use `surface-container-highest` (#e0e3e5) to highlight active work zones.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of "clinical sheets." 
- **Base Layer:** `surface`.
- **Intermediate Layer:** `surface-container-low`.
- **Action Layer:** `surface-container-lowest` (#ffffff) for primary cards and data entry areas.
This nesting creates a natural "lift" that directs the user's focus without the visual noise of traditional grids.

### The "Glass & Gradient" Rule
For floating elements, such as "Quick Action" menus or "Claim Summary" overlays, utilize **Glassmorphism**. Apply a semi-transparent `surface-container-lowest` with a `backdrop-filter: blur(12px)`. 

### Signature Textures
Main Call-to-Actions (CTAs) should not be flat. Use a subtle linear gradient from `primary` (#00488d) to `primary_container` (#005fb8) at a 135-degree angle. This adds a "jewel-toned" depth that feels premium and intentional.

---

## 3. Typography: The Editorial Logic
We use **Inter** as our sole typeface, relying on its geometric clarity.

- **Display & Headlines:** Use `display-md` and `headline-lg` for dashboard summaries. These should be set with a slight negative letter-spacing (-0.02em) to feel "tight" and authoritative.
- **Data Points:** Use `title-md` for numerical claim IDs and dollar amounts.
- **Labels:** Technical metadata (e.g., "ICD-10 Code") must use `label-sm` in `on_surface_variant` (#424752) with all-caps styling and +0.05em tracking for maximum legibility at small sizes.
- **Body:** `body-md` is the workhorse for claim descriptions, providing a comfortable reading rhythm.

---

## 4. Elevation & Depth
Depth is achieved through **Tonal Layering** rather than structural scaffolding.

- **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` background. This creates a soft, natural edge that is easier on the eye than a high-contrast border.
- **Ambient Shadows:** When an element must "float" (e.g., a modal or a file upload preview), use an extra-diffused shadow: `box-shadow: 0 12px 32px -4px rgba(25, 28, 30, 0.06)`. Note the use of `on_surface` (#191c1e) at a very low opacity to mimic natural light.
- **The "Ghost Border" Fallback:** If an edge is absolutely required for accessibility, use the `outline_variant` (#c2c6d4) at 20% opacity. Never use a 100% opaque border.

---

## 5. Components

### Detailed Data Tables
*Forbid the use of vertical and horizontal divider lines.* 
- **Header:** Use `surface-container-high` background for the header row.
- **Rows:** Use `surface-container-lowest` for the row body. 
- **Interaction:** On hover, shift the row background to `secondary_container` (#cbe7f5) to provide a soft focus indicator.
- **Spacing:** Use generous vertical padding (1.5rem) to allow the data to breathe.

### Progress Trackers (The "Flow" Component)
Instead of standard dots and lines, use a **Tonal Bar**:
- Completed steps: `primary` (#00488d).
- Active step: `primary_fixed_dim` (#a8c8ff) with a high-contrast `on_primary_fixed` (#001b3d) label.
- Future steps: `surface-container-highest`.
- The transition between steps should be a seamless color bleed, not a broken line.

### File Uploads
Avoid the "dashed box" cliché.
- Use a `surface-container-low` zone with a `xl` (0.75rem) corner radius.
- Center an icon using `surface_tint` (#005db5).
- Upon hover, the zone should transition to a subtle gradient of `primary_fixed` to `surface_container`.

### Buttons
- **Primary:** Gradient fill (`primary` to `primary_container`), `lg` (0.5rem) roundedness, and `label-md` uppercase text.
- **Secondary:** Transparent background with a "Ghost Border."
- **Tertiary/Ghost:** No background, `on_primary_fixed_variant` text, used for low-priority actions like "Cancel."

### Input Fields
- Use `surface-container-highest` as the input background to contrast against `surface-container-lowest` cards.
- Bottom-only active indicator: Instead of a full-focus ring, use a 2px `primary` underline that animates from the center outward upon focus.

---

## 6. Do's and Don'ts

### Do:
- **Do** use `tertiary` (#7b3200) for "Flagged" or "Urgent" claim statuses. Its warm, earthy tone stands out against the medical blues without feeling as aggressive as a pure error red.
- **Do** utilize the `xl` (0.75rem) roundedness for large containers to soften the "tech" feel.
- **Do** use `surface-dim` for "read-only" or archived data states.

### Don't:
- **Don't** use pure black (#000000) for text. Always use `on_surface` (#191c1e) to maintain a premium, ink-on-paper look.
- **Don't** use standard "Drop Shadows." Only use the Ambient Shadow specification provided in Section 4.
- **Don't** crowd the interface. If a screen feels full, increase the spacing rather than shrinking the typography. In this system, whitespace is a functional tool, not a luxury.