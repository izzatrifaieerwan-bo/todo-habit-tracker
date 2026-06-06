# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the App

Open `index.html` directly in a browser, or serve it locally:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

No build step, no package manager, no compilation required.

## Architecture

Vanilla JavaScript static app — no frameworks, no bundler. Five JS modules loaded as plain `<script>` tags in `index.html` in this order (order matters for global variable availability):

1. **[js/toast.js](js/toast.js)** — `showToast()`, `successToast()`, `infoToast()`, etc. Must load first since all other modules call these.
2. **[js/tasks.js](js/tasks.js)** — `tasks[]` array (global), all task CRUD, drag-and-drop reordering, search, filtering. Defines `isTaskOverdue()` which `dashboard.js` also calls.
3. **[js/habits.js](js/habits.js)** — `habits[]` array (global), streak tracking logic.
4. **[js/dashboard.js](js/dashboard.js)** — `charts{}` object (global), Chart.js chart lifecycle. Cross-module dependency: calls `tasks` (global) and `isTaskOverdue()` from tasks.js.
5. **[js/app.js](js/app.js)** — `initApp()`, theme toggle, wires up event listeners on `DOMContentLoaded`.

## Key Patterns

**Cross-module calls are guarded with `typeof` checks** — e.g., `tasks.js` calls `updateDashboard()` from `dashboard.js` via `updateDashboardIfOpen()`, which checks `typeof updateDashboard === 'function'` first. Use this same pattern for any new cross-module calls.

**LocalStorage keys:**
- `'tasks'` — serialized `tasks[]` array
- `'habits'` — serialized `habits[]` array
- `'theme'` — `'dark'` or `'light'`
- `'customTaskOrder'` — array of task IDs for drag-reorder persistence

**Habit data model:** `{id, text, streak, lastChecked, completionDates: []}`. `completionDates` is an array of `toDateString()` date strings (e.g. `"Fri Jun 06 2026"`) used for the heatmap. `loadHabits()` migrates older habits that lack this field. The heatmap renders 16 weeks of history below each habit item via `buildHeatmapHTML()` in `habits.js`.

**Task IDs** use `Date.now()` as a timestamp integer.

**Theme** is toggled by adding/removing the `dark-theme` class on `<body>`. Chart colors are hardcoded per theme — when the theme changes, `updateDashboardTheme()` destroys and recreates all Chart.js instances.

**Chart lifecycle** — `dashboard.js` stores Chart.js instances in `charts.completion`, `charts.category`, etc. Always call `.destroy()` on an existing chart before creating a new one in the same canvas.

**Drag mode** — tasks have two sort modes: automatic (priority + overdue first) or manual (custom order stored in `customOrder[]`). Toggling drag mode off clears `customOrder` and removes it from localStorage.
