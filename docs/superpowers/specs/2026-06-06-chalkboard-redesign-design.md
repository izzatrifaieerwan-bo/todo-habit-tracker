# Design Spec: Dark Chalkboard Redesign

**Date:** 2026-06-06  
**Status:** Approved

---

## Summary

Redesign the todo/habit tracker to make the dark chalkboard mode the default experience, introduce a mixed typography system (Space Grotesk + Caveat), and add expressive chalk-write animations. Light mode becomes a warm parchment paper alternative rather than the primary experience.

---

## What Changes

### 1. Theme & Color

**Dark is default.** The `<body>` starts with `dark-theme` class applied. The eraser in the marker tray toggles to light mode (removes the class), not the other way around. LocalStorage key `'theme'` persists the choice; if no value is stored, dark is assumed.

**Dark chalkboard palette:**
- Board background: `#1a3320` (primary), `#152a1a` (secondary gradient stop) — richer and deeper than current `#2d4a2b`
- Frame/border: aged dark wood — `#3d2b1f` family (replaces current silver aluminum `#4a4a4a`)
- Wall behind board: very dark, near-black with a warm undertone (`#0f1a0f`)
- Chalk-dust SVG noise texture: increase opacity from current `0.08` to `0.14` so the surface reads as textured
- Text: `#e8e8d0` (keep), secondary text: `#a8a898`
- Accent colors (marker ink): blue `#5ba3f5` (brighter than current `#4A90E2`), green `#50C878` (keep), red `#ff6b6b` (keep)

**Light mode palette (warm parchment):**
- Board background: `#f5f0e8` (primary), `#ede8de` (secondary) — warm paper, not white
- Frame/border: oak wood — `#8B6914` family (replaces current silver `#e0e0e0`)
- Wall: warm sienna (`#7a5c3a` family)
- Ruled-line texture: subtle horizontal lines at 28px intervals (`rgba(0,0,0,0.04)`)
- Text: `#2c1f0e` (warm dark brown, not flat `#2c3e50`)
- Accent colors in light: keep blue/green/red but at slightly reduced saturation

**Theme transition:** Keep the existing `0.6s ease` transition on color properties. No new wipe animation needed — the cross-fade is sufficient.

---

### 2. Typography

**New font added:** `Space Grotesk` from Google Fonts (weights 400, 600, 700). Add to `<head>` alongside existing Caveat link.

**Font assignment:**

| Element | Font | Notes |
|---|---|---|
| Section titles (To-Do List, Habits) | Space Grotesk 700 | `clamp(1.6rem, 3vw, 2.2rem)`, letter-spacing `-0.02em` |
| Dashboard header | Space Grotesk 700 | Same scale |
| Stat numbers (0, 7, 3…) | Space Grotesk 700 | Reads cleaner than Caveat for digits |
| Stat labels | Space Grotesk 400 | Uppercase, `0.7em`, `letter-spacing: 0.08em` |
| Add Task / Add Habit buttons | Space Grotesk 600 | Uppercase, `letter-spacing: 0.06em` |
| Filter pill labels | Space Grotesk 600 | Smaller, `0.8em` |
| Dashboard toggle button | Space Grotesk 600 | |
| Task text | Caveat | Keep current size/weight |
| Habit text | Caveat | Keep current |
| Input placeholders | Caveat | Keep current |
| Priority/category badges | Caveat | Keep current |
| Streak counter | Caveat (number) + Space Grotesk (label) | e.g. "🔥 7" in Caveat, "day streak" in Space Grotesk |
| Meta info (due date, category) | Caveat | Keep current |
| Search input | Caveat | Keep current |
| Edit/Delete/Cancel buttons | Space Grotesk 600 | Consistent with other action buttons |

**Section title underline:** Keep the colored underline (`::after` pseudo-element) but make it a full-width line at 3px, opacity `0.6` in dark mode so it's more visible against the dark background.

---

### 3. Motion (Expressive)

All new animations use CSS keyframes. No JS animation libraries.

**New item added (tasks and habits):**
```css
@keyframes chalk-write-in {
  from { transform: translateX(-24px); opacity: 0; }
  to   { transform: translateX(0);     opacity: 1; }
}
/* applied to .item when first rendered */
.item.entering {
  animation: chalk-write-in 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
```
The JS adds `.entering` class when injecting new item HTML, removes it after 350ms.

**Page load cascade (tasks and habits):**
- On `renderTasks()` and `renderHabits()`, each `.item` gets an inline `animation-delay` of `n * 50ms` (where n is the item's index).
- Same `chalk-write-in` keyframe, so load feels like the board is being written.
- Cap at index 10 (500ms max delay) — beyond that items appear immediately.

**Item deleted:**
```css
@keyframes chalk-erase-out {
  from { transform: translateX(0);    opacity: 1; }
  to   { transform: translateX(24px); opacity: 0; }
}
.item.exiting {
  animation: chalk-erase-out 0.25s cubic-bezier(0.55, 0, 1, 0.45) forwards;
}
```
JS adds `.exiting`, waits 260ms, then removes the DOM element.

**Heatmap stagger-reveal:**
- On `buildHeatmapHTML()`, each `.heatmap-cell` gets `animation-delay: n * 8ms`.
- Use a simple `fade-in` keyframe (`opacity: 0 → 1`, 150ms).
- Gives a left-to-right "filling in" effect across the 16-week grid.

**Dashboard panel:**
- Replace current `max-height: 0 → 2000px` hack with the CSS Grid row trick: wrap the panel content in an inner div, set the outer to `display: grid; grid-template-rows: 0fr` (closed) or `1fr` (open), with `transition: grid-template-rows 0.4s ease`. The inner div gets `overflow: hidden; min-height: 0`. This animates correctly to `height: auto` without JS measurement.

**Hover states:**
- Keep `translateX(3px)` on items, `translateY(-2px)` on buttons.
- Reduce easing from `0.3s ease` to `0.15s cubic-bezier(0.22, 1, 0.36, 1)` for snappier feel.

---

## What Stays the Same

- Two-column layout with the vertical marker-line divider
- The marker tray at the bottom (markers + eraser)
- All JS logic, data model, localStorage keys
- Caveat font for all content text (tasks, habits, inputs)
- Heatmap structure and sizing
- Category color system (work/personal/shopping/school/health/other)
- Responsive breakpoints at 968px and 600px
- Toast notification system

---

## Files to Change

- `index.html` — add Space Grotesk font link; add `dark-theme` class to `<body>` as default
- `css/styles.css` — all color/typography/animation changes
- `js/app.js` — flip theme init logic (dark as default); update `toggleTheme()`
- `js/tasks.js` — add `.entering`/`.exiting` classes on add/delete; add stagger delay on render
- `js/habits.js` — same entering/exiting logic; heatmap stagger on build
- `js/dashboard.js` — dashboard panel animation fix

---

## Out of Scope

- No changes to chart colors beyond what's already theme-aware
- No new features (search, filtering, drag-drop all stay as-is)
- No responsive layout changes beyond what already exists
- No new localStorage keys or data model changes
