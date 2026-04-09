# Design System: Industrial Mission-Critical Operations

## 1. Overview & Creative North Star: "The Tactical Monolith"

This design system is engineered for the high-stakes, high-velocity environment of Indian Railways heavy operations. Our Creative North Star is **The Tactical Monolith**. We are moving away from decorative UI toward a "Functional Brutalist" aesthetic—an interface that feels less like a website and more like a physical cockpit carved from light and glass.

To break the "template" look, we employ **Intentional Asymmetry**. Key telemetry data should not be trapped in uniform boxes; instead, use the 12-column grid to create rhythmic shifts—large, dominant data clusters offset by narrow, vertical status ribbons. The goal is "Cognitive Authority": a UI so precise that the operator feels an immediate sense of control and zero ambiguity.

---

## 2. Colors: The High-Contrast Command Palette

Our palette is optimized for low-light environments (locomotive cabins/control rooms) to reduce eye fatigue while maintaining "glanceable" urgency.

### Surface Hierarchy & Nesting
We reject the "flat" look. We use **Tonal Nesting** to define importance:
*   **Base Layer:** `surface` (#041329) - The infinite void of the background.
*   **Secondary Panels:** `surface_container_low` (#0D1C32) - Large logic blocks.
*   **Active Focus:** `surface_container_high` (#1C2A41) - Interaction zones and active data feeds.
*   **The "No-Line" Rule:** Do not use 1px solid borders to separate sections. Use the transition from `surface_container` to `surface_container_low` to define boundaries. Structural definition comes from depth, not lines.

### Signature Textures & Gradients
To provide "visual soul," use a subtle **linear gradient** on primary action surfaces:
*   `primary` (#B1C5FF) to `primary_container` (#0B3D91) at a 135-degree angle. This creates a "machined metal" sheen that feels industrial and premium.

### Glassmorphism
For floating diagnostic overlays, use `surface_bright` at 60% opacity with a `20px` backdrop-blur. This keeps the "mission-critical" data in the background visible but recessed.

---

## 3. Typography: The Authority of Information

We use a dual-personality typographic approach to balance human readability with machine precision.

*   **Display & Headlines (Space Grotesk):** These are your "shout" layers. Use **bold uppercase** for all system headers. The wide apertures of Space Grotesk ensure legibility at high speeds.
*   **Data Values (Monospace/Inter):** All telemetry, timestamps, and coordinates must use `Inter` with tabular lining or a monospace fallback. This ensures that changing numbers don't "jump" visually, maintaining a rock-steady read.
*   **Hierarchy as Brand:** Use `display-lg` sparingly for critical status (e.g., SPEED, BRAKE PRESSURE). Use `label-sm` for technical metadata, always in 70% opacity `on_surface_variant` to keep the "noise" floor low.

---

## 4. Elevation & Depth: Tonal Layering

Traditional drop shadows are forbidden. We simulate depth through physical light logic.

*   **The Layering Principle:** Place `surface_container_highest` components on top of `surface_dim` backgrounds to create a "lifted" effect. The eye perceives the lighter tone as being closer to the user.
*   **Ambient Glow:** Instead of shadows, use an "Inner Glow" for active states. A 1px inside stroke using `primary` at 20% opacity makes a panel appear "powered on."
*   **The Ghost Border Fallback:** If high-contrast separation is required (e.g., in extreme glare conditions), use a "Ghost Border": `outline_variant` (#434652) at 15% opacity. It should be felt, not seen.
*   **Corner Radii:** As per technical specs, all corners are **0px (Sharp)**. This reinforces the industrial, rugged nature of the hardware-software integration.

---

## 5. Components: Engineered for Precision

### Buttons (Tactical Triggers)
*   **Primary:** High-contrast `primary_container` background. No rounded corners. 1.75rem height (Spacing 8) for touch-target reliability.
*   **Status Indicators:** Not just dots—use "glow states." A `tertiary` (Safe) button should have a soft outer glow of the same color to indicate a "Go" condition.

### Input Fields (Telemetry Entry)
*   **State:** Use `surface_container_highest` for the field background. 
*   **Focus:** Instead of a border change, the background should shift to `primary` at 10% opacity, and the `label-sm` should animate to a `primary` color.

### Tactical Cards & Lists
*   **No Dividers:** Lists are separated by `0.4rem` (Spacing 2) of vertical whitespace. 
*   **Hover/Active:** Use a background shift to `surface_bright`. 

### Specialized Railway Components
*   **The Chrono-Track:** A vertical or horizontal timeline using `outline` tokens to show train progress. Use `tertiary_fixed` for the "Current Position" to cut through the dark UI.
*   **Alert Strips:** Full-width banners using `error_container` for "Danger" states. These must bypass the 12-column grid and bleed to the edges of the screen to command absolute attention.

---

## 6. Do’s and Don’ts

### Do:
*   **Use Intentional Space:** Use the Spacing Scale (especially `16` and `20`) to group related controls. White space in a dark UI is "breathing room" for the operator's brain.
*   **Prioritize High Contrast:** Ensure `on_primary` and `on_surface` text always meets a 7:1 contrast ratio against their containers.
*   **Maintain Rigid Alignment:** Stick to the 8px grid religiously. In a "Tactical Monolith," a 1px misalignment is a failure of system integrity.

### Don’t:
*   **No Softness:** Never use rounded corners (`0px` is the law). Softness implies consumer-grade; sharpness implies professional-grade.
*   **No Decorative Animation:** Every transition must be fast (150ms-200ms) and linear. Avoid "bouncy" or "elastic" easing.
*   **No Standard Borders:** Avoid the "Excel-look." If you find yourself drawing a grid of 1px lines, stop. Use background tonal shifts instead.