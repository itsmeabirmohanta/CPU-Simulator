

## Fix: Tour Guides Not Working Properly

### Root Causes Identified

1. **TourOverlay silently breaks when element not found**: If `document.querySelector` returns null (element not rendered or selector mismatch), `highlightRect` stays null and the tooltip never shows -- the tour appears frozen with just a dark overlay and no way forward.

2. **Tooltip positioning overflows viewport**: The `getTooltipStyle` function doesn't clamp positions. `position: "top"` can place the tooltip above the viewport (negative `bottom`). `position: "right"` on wide elements pushes it off-screen.

3. **`scrollIntoView` on sticky toolbar elements causes layout jumps**: The `sim-mode-toggle` and `sim-controls` are inside a `sticky top-14` toolbar. Calling `scrollIntoView` on them causes unnecessary page scrolling and incorrect `getBoundingClientRect()` values.

4. **Learn page tour step order is wrong**: Steps go progress (below hero) → stats (in hero) → module-0 (below) → learning-path (far below) → open-sim (back up in hero). This causes jarring back-and-forth scrolling. Should follow top-to-bottom visual flow.

5. **No skip/recovery for missing elements**: If a `data-tour` element is conditionally rendered or off-screen, the tour breaks permanently on that step.

---

### Changes

**File: `src/components/tour/TourOverlay.tsx`**
- **Auto-skip missing elements**: If `querySelector` returns null, automatically advance to the next step (or dismiss if last step). Add a small delay to avoid instant skip chains.
- **Smart scroll**: Only call `scrollIntoView` if the element is NOT already visible in the viewport. Check with `getBoundingClientRect` -- if `top >= 0` and `bottom <= window.innerHeight`, skip scrolling.
- **Clamp tooltip positions**: In `getTooltipStyle`, ensure `top` never goes negative, `bottom` never goes negative, and `left`/`right` stay within viewport bounds. For `position: "top"`, fall back to "bottom" if there's not enough space above.
- **Recalculate on scroll**: Add a scroll listener alongside the existing resize listener to update `highlightRect` when the page scrolls (fixes sticky element tracking).

**File: `src/components/learn/GuidedWalkthrough.tsx`**
- Reorder steps to follow top-to-bottom visual flow: stats (hero) → open-sim (hero) → progress (below hero) → module-0 (grid) → learning-path (bottom).

**File: `src/components/simulator/SimulatorTour.tsx`**
- Beginner steps: Change `sim-controls` position from `"bottom"` to `"bottom"` (keep, but the overflow fix handles it). Change `sim-visual` from `"top"` to `"left"` since it's a large area and "top" places tooltip off-screen.
- Advanced steps: Change `sim-memory` position from `"top"` to `"bottom"` since it's near the bottom of the page and "top" tooltip would overlap with content above.

