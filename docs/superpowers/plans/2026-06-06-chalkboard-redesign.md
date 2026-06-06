# Chalkboard Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the todo/habit tracker as a dark-first chalkboard with Space Grotesk UI type, Caveat content type, and expressive chalk-write animations.

**Architecture:** Pure CSS/JS changes — no build step, no new files, no new dependencies beyond adding the Space Grotesk Google Font. All animations use CSS keyframes triggered by JS-applied inline `animation-delay` and class toggles.

**Tech Stack:** Vanilla JS, CSS custom properties, CSS keyframe animations, Google Fonts (Space Grotesk)

---

## Files Modified

- `index.html` — body default class, font link, dashboard inner wrapper div
- `css/styles.css` — color variables, typography assignments, animation keyframes, panel animation
- `js/app.js` — `loadTheme()` dark-as-default logic
- `js/tasks.js` — stagger in `renderTasks()`, exit animation in `deleteTask()`
- `js/habits.js` — `data-id` on habit items, stagger in `renderHabits()`, exit animation in `deleteHabit()`, cell index in `buildHeatmapHTML()`

---

## Task 1: HTML Foundations

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add Space Grotesk font and set dark-theme as default body class**

  Replace the opening `<html>` through the existing Caveat font link in `index.html`:

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Smart To-Do & Habit Tracker</title>
      
      <link rel="stylesheet" href="css/styles.css">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Space+Grotesk:wght@400;600;700&display=swap" rel="stylesheet">

      <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js"></script>
  </head>
  <body class="dark-theme">
  ```

- [ ] **Step 2: Wrap the dashboard panel content in an inner div**

  The current dashboard panel in `index.html`:
  ```html
  <div class="dashboard-panel" id="dashboard-panel">
      <div class="dashboard-header">
  ```

  Replace with:
  ```html
  <div class="dashboard-panel" id="dashboard-panel">
      <div class="dashboard-panel-inner">
      <div class="dashboard-header">
  ```

  And close the inner div before the closing `</div>` of `dashboard-panel`. Find `</div>` that closes the charts grid, then add the closing tag:
  ```html
          </div><!-- end charts-grid -->
      </div><!-- end dashboard-panel-inner -->
  </div><!-- end dashboard-panel -->
  ```

- [ ] **Step 3: Verify**

  Open `index.html` directly in a browser (or `python -m http.server 8000`). The page should load in dark chalkboard mode by default.

- [ ] **Step 4: Commit**

  ```bash
  git add index.html
  git commit -m "feat: set dark chalkboard as default theme, add Space Grotesk font"
  ```

---

## Task 2: CSS — Color Palette

**Files:**
- Modify: `css/styles.css`

- [ ] **Step 1: Replace the `:root` CSS variable block**

  Find the `:root { ... }` block (lines 12–28) and replace entirely:

  ```css
  :root {
      --wall-color-1: #7a5c3a;
      --wall-color-2: #5a3f25;
      --board-color-1: #f5f0e8;
      --board-color-2: #ede8de;
      --frame-color-1: #a07840;
      --frame-color-2: #8B6914;
      --frame-color-3: #7a5a10;
      --tray-color-1: #b89060;
      --tray-color-2: #a07840;
      --text-color: #2c1f0e;
      --text-secondary: #7a5a3a;
      --divider-color: #8B6914;
      --input-border: #8B6914;
      --eraser-color-1: #333;
      --eraser-color-2: #2a2a2a;
  }
  ```

- [ ] **Step 2: Replace the `body.dark-theme` CSS variable block**

  Find the `body.dark-theme { ... }` block (lines 31–47) and replace entirely:

  ```css
  body.dark-theme {
      --wall-color-1: #0f1a0f;
      --wall-color-2: #080f08;
      --board-color-1: #1a3320;
      --board-color-2: #152a1a;
      --frame-color-1: #3d2b1f;
      --frame-color-2: #2d1f14;
      --frame-color-3: #1f160e;
      --tray-color-1: #3d2b1f;
      --tray-color-2: #2d1f14;
      --text-color: #e8e8d0;
      --text-secondary: #a8a898;
      --divider-color: #e8e8d0;
      --input-border: #c8c8b0;
      --eraser-color-1: #f5f5f5;
      --eraser-color-2: #e8e8e8;
  }
  ```

- [ ] **Step 3: Increase dark-mode wall texture opacity**

  Find `body.dark-theme::before` and update both `rgba` opacity values from `0.02` to `0.04`:

  ```css
  body.dark-theme::before {
      background-image: 
          repeating-linear-gradient(
              90deg,
              rgba(255,255,255,0.04) 0px,
              transparent 1px,
              transparent 40px,
              rgba(255,255,255,0.04) 41px
          ),
          repeating-linear-gradient(
              0deg,
              rgba(255,255,255,0.04) 0px,
              transparent 1px,
              transparent 40px,
              rgba(255,255,255,0.04) 41px
          );
  }
  ```

- [ ] **Step 4: Increase chalk-dust texture opacity**

  Find `body.dark-theme .whiteboard-surface::after` and change `opacity: 0.3` to `opacity: 0.5`.

- [ ] **Step 5: Add ruled-line texture to light-mode whiteboard surface**

  Find `.whiteboard-surface` and add a ruled-line pattern to the existing gradient. Replace:

  ```css
  .whiteboard-surface {
      width: 100%;
      height: calc(100% - 44px);
      background: linear-gradient(135deg, var(--board-color-1) 0%, var(--board-color-2) 100%);
  ```

  With:

  ```css
  .whiteboard-surface {
      width: 100%;
      height: calc(100% - 44px);
      background: 
          repeating-linear-gradient(
              180deg,
              transparent 0px,
              transparent 27px,
              rgba(0,0,0,0.04) 27px,
              rgba(0,0,0,0.04) 28px
          ),
          linear-gradient(135deg, var(--board-color-1) 0%, var(--board-color-2) 100%);
  ```

  The dark-theme override's `box-shadow` already applies on top and hides the ruled lines in dark mode — this texture only shows in light (parchment) mode.

- [ ] **Step 6: Verify**

  Reload the browser. Dark mode: should look deeper green with more visible chalk texture. Light mode (click the eraser): warm parchment with faint ruled lines and warm wood frame. Both should feel distinctly different from each other.

- [ ] **Step 7: Commit**

  ```bash
  git add css/styles.css
  git commit -m "feat: update color palette — deeper chalkboard dark, warm parchment light"
  ```

---

## Task 3: CSS — Typography

**Files:**
- Modify: `css/styles.css`

- [ ] **Step 1: Update `.section-title`**

  Find the `.section-title` rule and replace:

  ```css
  .section-title {
      font-size: clamp(1.6rem, 3vw, 2.2rem);
      font-weight: 700;
      color: var(--text-color);
      margin: 0;
      font-family: 'Space Grotesk', sans-serif;
      letter-spacing: -0.02em;
      position: relative;
      display: inline-block;
      transition: color 0.6s ease;
  }
  ```

- [ ] **Step 2: Update `.stat-number` and `.stat-label`**

  Find `.stat-number` and replace:
  ```css
  .stat-number {
      font-size: 1.4em;
      font-weight: 700;
      margin: 0;
      font-family: 'Space Grotesk', sans-serif;
      transition: color 0.6s ease;
  }
  ```

  Find `.stat-label` and replace:
  ```css
  .stat-label {
      font-size: 0.7em;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-family: 'Space Grotesk', sans-serif;
      color: var(--text-secondary);
      transition: color 0.6s ease;
  }
  ```

- [ ] **Step 3: Update `button` font**

  Find the base `button` rule and replace `font-family` and add letter-spacing:
  ```css
  button {
      padding: 10px 20px;
      background: #4A90E2;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 0.9em;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s cubic-bezier(0.22, 1, 0.36, 1);
      font-family: 'Space Grotesk', sans-serif;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      box-shadow: 0 3px 8px rgba(74, 144, 226, 0.3);
  }
  ```

  Also update `button:hover` transition to match:
  ```css
  button:hover {
      background: #357ABD;
      transform: translateY(-2px);
      box-shadow: 0 5px 12px rgba(74, 144, 226, 0.4);
  }
  ```

- [ ] **Step 4: Update `.filter-label` and `.category-filter-btn`**

  Find `.filter-label` and add Space Grotesk:
  ```css
  .filter-label {
      font-size: 0.75em;
      color: var(--text-secondary);
      font-weight: 700;
      font-family: 'Space Grotesk', sans-serif;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-right: 5px;
      transition: color 0.6s ease;
  }
  ```

  Find `.category-filter-btn` and replace:
  ```css
  .category-filter-btn {
      padding: 5px 12px;
      background: rgba(74, 144, 226, 0.1);
      color: #4A90E2;
      border: 2px solid #4A90E2;
      border-radius: 20px;
      font-size: 0.72em;
      font-weight: 700;
      font-family: 'Space Grotesk', sans-serif;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.15s cubic-bezier(0.22, 1, 0.36, 1);
      box-shadow: none;
  }
  ```

- [ ] **Step 5: Update dashboard header and chart container headings**

  Find `.dashboard-header h3` and replace:
  ```css
  .dashboard-header h3 {
      font-size: 1.5em;
      font-weight: 700;
      color: var(--text-color);
      font-family: 'Space Grotesk', sans-serif;
      letter-spacing: -0.02em;
      margin: 0;
  }
  ```

  Find `.chart-container h4` and replace:
  ```css
  .chart-container h4 {
      font-size: 0.85em;
      font-weight: 700;
      font-family: 'Space Grotesk', sans-serif;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--text-color);
      margin: 0 0 15px 0;
      text-align: center;
  }
  ```

- [ ] **Step 6: Update drag-toggle and edit/cancel buttons**

  Find `.drag-toggle-label` and replace `font-family`:
  ```css
  .drag-toggle-label {
      flex: 1;
      font-size: 0.85em;
      font-weight: 700;
      font-family: 'Space Grotesk', sans-serif;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--text-color);
      display: flex;
      align-items: center;
      gap: 8px;
  }
  ```

- [ ] **Step 7: Verify**

  Reload. Section titles should be crisp geometric (Space Grotesk), while task text and habit text stay handwritten (Caveat). Buttons should show uppercase Space Grotesk. Stats numbers should read clean and bold.

- [ ] **Step 8: Commit**

  ```bash
  git add css/styles.css
  git commit -m "feat: typography — Space Grotesk UI chrome, Caveat for content"
  ```

---

## Task 4: CSS — Chalk Animations

**Files:**
- Modify: `css/styles.css`

- [ ] **Step 1: Add keyframe definitions**

  Add this block at the end of `css/styles.css`, before the final responsive media query closing brace (or at the very end of the file):

  ```css
  /* ================================
     CHALK ANIMATIONS
     ================================ */

  @keyframes chalk-write-in {
      from {
          transform: translateX(-20px);
          opacity: 0;
      }
      to {
          transform: translateX(0);
          opacity: 1;
      }
  }

  @keyframes chalk-erase-out {
      from {
          transform: translateX(0);
          opacity: 1;
      }
      to {
          transform: translateX(20px);
          opacity: 0;
      }
  }

  @keyframes heatmap-fade {
      from { opacity: 0; }
      to   { opacity: 1; }
  }
  ```

- [ ] **Step 2: Apply chalk-write-in to all `.item` elements**

  Find the `.item` rule and add the animation:

  ```css
  .item {
      display: flex;
      align-items: center;
      padding: 12px 8px;
      background: transparent;
      border: none;
      border-left: 3px solid #4A90E2;
      padding-left: 15px;
      transition: background 0.15s cubic-bezier(0.22, 1, 0.36, 1),
                  transform 0.15s cubic-bezier(0.22, 1, 0.36, 1);
      box-shadow: none;
      animation: chalk-write-in 0.3s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  ```

  Note: `animation-delay` is set per-item via inline style from JS (Task 7). The `both` fill-mode ensures items start invisible during their delay and stay visible after finishing.

- [ ] **Step 3: Apply chalk-erase-out to `.item.exiting`**

  Add this rule:

  ```css
  .item.exiting {
      animation: chalk-erase-out 0.25s cubic-bezier(0.55, 0, 1, 0.45) both;
      pointer-events: none;
  }
  ```

- [ ] **Step 4: Apply heatmap-fade to `.heatmap-cell`**

  Find `.heatmap-cell` and add:

  ```css
  .heatmap-cell {
      width: 13px;
      height: 13px;
      border-radius: 2px;
      background: rgba(80, 200, 120, 0.15);
      cursor: default;
      transition: transform 0.1s ease, background 0.6s ease;
      animation: heatmap-fade 0.15s ease-out both;
  }
  ```

  The `animation-delay` is set per-cell via inline style from JS (Task 8).

- [ ] **Step 5: Verify**

  Reload. Tasks should cascade in from the left on page load. Add a new task — the whole list re-renders with the cascade. Delete a task — it slides right and fades before disappearing (this part needs the JS changes in Task 7, but the CSS is ready).

- [ ] **Step 6: Commit**

  ```bash
  git add css/styles.css
  git commit -m "feat: add chalk-write-in, chalk-erase-out, and heatmap-fade keyframes"
  ```

---

## Task 5: CSS — Dashboard Panel Animation

**Files:**
- Modify: `css/styles.css`

- [ ] **Step 1: Replace the dashboard panel max-height hack with grid-template-rows**

  Find the `.dashboard-panel` rule and replace:

  ```css
  .dashboard-panel {
      display: grid;
      grid-template-rows: 0fr;
      transition: grid-template-rows 0.4s ease, margin-bottom 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 12px;
      border: 2px solid transparent;
      overflow: hidden;
  }

  body.dark-theme .dashboard-panel {
      background: rgba(232, 232, 208, 0.05);
  }

  .dashboard-panel.open {
      grid-template-rows: 1fr;
      margin-bottom: 25px;
      border-color: #9b59b6;
      box-shadow: 0 8px 25px rgba(155, 89, 182, 0.2);
  }

  body.dark-theme .dashboard-panel.open {
      border-color: var(--text-secondary);
      box-shadow: 0 8px 25px rgba(232, 232, 208, 0.1);
  }
  ```

  Remove the old `.dashboard-panel.open` block with `max-height: 2000px; opacity: 1; padding: 25px;` — it's replaced by the above.

- [ ] **Step 2: Add `.dashboard-panel-inner` styles**

  Add this new rule directly after the `.dashboard-panel` block:

  ```css
  .dashboard-panel-inner {
      min-height: 0;
      overflow: hidden;
      padding: 0;
      transition: padding 0.3s ease 0.05s;
  }

  .dashboard-panel.open .dashboard-panel-inner {
      padding: 25px;
  }
  ```

- [ ] **Step 3: Remove the old opacity transition from `.dashboard-panel`**

  The old `opacity: 0` on `.dashboard-panel` and `opacity: 1` on `.dashboard-panel.open` should be removed since the grid approach handles visibility. Search for any remaining `opacity: 0` inside the `.dashboard-panel` block and delete it.

- [ ] **Step 4: Verify**

  Reload. Click "View Statistics" — the panel should slide open smoothly without the initial pause that the `max-height` hack caused. Close it — should collapse cleanly.

- [ ] **Step 5: Commit**

  ```bash
  git add css/styles.css
  git commit -m "feat: replace dashboard max-height hack with CSS grid-template-rows animation"
  ```

---

## Task 6: JS — Dark as Default

**Files:**
- Modify: `js/app.js`

- [ ] **Step 1: Update `loadTheme()` to treat dark as the default**

  Find the `loadTheme()` function in `js/app.js` and replace it:

  ```js
  function loadTheme() {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'light') {
          document.body.classList.remove('dark-theme');
      }
      // dark-theme class is already on <body> in index.html
      // Only remove it if the user explicitly saved 'light'
  }
  ```

  The `toggleTheme()` function is already correct — no changes needed there.

- [ ] **Step 2: Verify**

  1. Open in a fresh browser (or clear localStorage). Should load in dark chalkboard mode.
  2. Click the eraser. Should switch to light parchment mode.
  3. Reload. Should stay in light mode (localStorage has `'light'`).
  4. Click the eraser again. Should switch back to dark.
  5. Reload. Should stay in dark mode (localStorage has `'dark'`).

- [ ] **Step 3: Commit**

  ```bash
  git add js/app.js
  git commit -m "feat: dark chalkboard is now the default theme"
  ```

---

## Task 7: JS — Task Animations

**Files:**
- Modify: `js/tasks.js`

- [ ] **Step 1: Add stagger delays in `renderTasks()` after setting innerHTML**

  Find the line in `renderTasks()` that sets `tasksList.innerHTML = tasksHTML` (around line 426). Immediately after it, add the stagger loop:

  ```js
  tasksList.innerHTML = tasksHTML;

  // Stagger chalk-write-in animation delays
  tasksList.querySelectorAll('.item').forEach((el, i) => {
      el.style.animationDelay = `${Math.min(i * 50, 500)}ms`;
  });
  ```

- [ ] **Step 2: Add exit animation to `deleteTask()`**

  Find the `deleteTask(id)` function and replace it entirely:

  ```js
  function deleteTask(id) {
      const itemEl = document.querySelector(`.item[data-id="${id}"]`);
      if (itemEl && !itemEl.classList.contains('exiting')) {
          itemEl.classList.add('exiting');
          infoToast('Task deleted');
          setTimeout(() => {
              tasks = tasks.filter(t => t.id !== id);
              saveTasks();
              renderTasks();
              updateDashboardIfOpen();
          }, 270);
      }
  }
  ```

  The 270ms timeout is 20ms longer than the `chalk-erase-out` animation (250ms), giving the animation time to fully complete before the DOM element is removed by `renderTasks()`.

- [ ] **Step 3: Verify**

  Reload. Existing tasks should cascade in from the left. Add a task — list re-renders with cascade. Delete a task — it slides right and fades before the list updates. Toast appears immediately on delete (not after the timeout).

- [ ] **Step 4: Commit**

  ```bash
  git add js/tasks.js
  git commit -m "feat: task chalk-write cascade on render, erase-out on delete"
  ```

---

## Task 8: JS — Habit Animations

**Files:**
- Modify: `js/habits.js`

- [ ] **Step 1: Add `data-id` attribute to habit items in `renderHabits()`**

  Find the habit item HTML template inside `renderHabits()` (the `habits.map(...)` call). Find this line:

  ```js
  <div class="item habit-item ${isCheckedToday ? 'completed' : ''}">
  ```

  Replace with:

  ```js
  <div class="item habit-item ${isCheckedToday ? 'completed' : ''}" data-id="${habit.id}">
  ```

- [ ] **Step 2: Add stagger delays in `renderHabits()` after setting innerHTML**

  Find the line `habitsList.innerHTML = habitsHTML;` and add the stagger loop immediately after:

  ```js
  habitsList.innerHTML = habitsHTML;

  // Stagger chalk-write-in animation delays
  habitsList.querySelectorAll('.item').forEach((el, i) => {
      el.style.animationDelay = `${Math.min(i * 50, 500)}ms`;
  });
  ```

- [ ] **Step 3: Add exit animation to `deleteHabit()`**

  Find the `deleteHabit(id)` function and replace it entirely:

  ```js
  function deleteHabit(id) {
      const itemEl = document.querySelector(`.item[data-id="${id}"]`);
      if (itemEl && !itemEl.classList.contains('exiting')) {
          itemEl.classList.add('exiting');
          infoToast('Habit deleted');
          setTimeout(() => {
              habits = habits.filter(h => h.id !== id);
              saveHabits();
              renderHabits();
          }, 270);
      }
  }
  ```

- [ ] **Step 4: Add stagger delay to heatmap cells in `buildHeatmapHTML()`**

  Find the `buildHeatmapHTML(habit)` function. Add a `cellIndex` counter before the `while` loop, and include the `animation-delay` inline style on each cell:

  Before the `while` loop, add:
  ```js
  let cellIndex = 0;
  ```

  Inside the `while` loop, find the `cellsHTML +=` line and replace it with:
  ```js
  cellsHTML += `<div class="${classes.join(' ')}" title="${tooltipDate}${isCompleted ? ' ✓' : ''}" style="animation-delay:${cellIndex * 8}ms"></div>`;
  cellIndex++;
  ```

  The complete modified section of `buildHeatmapHTML`:
  ```js
  let cellsHTML = '';
  const current = new Date(startDate);
  let completionCount = 0;
  let cellIndex = 0;

  while (current <= today) {
      const dateStr = current.toDateString();
      const isCompleted = completionSet.has(dateStr);
      const isToday = current.getTime() === today.getTime();

      if (isCompleted) completionCount++;

      const classes = ['heatmap-cell'];
      if (isCompleted) classes.push('completed');
      if (isToday) classes.push('today');

      const tooltipDate = current.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      cellsHTML += `<div class="${classes.join(' ')}" title="${tooltipDate}${isCompleted ? ' ✓' : ''}" style="animation-delay:${cellIndex * 8}ms"></div>`;
      cellIndex++;

      current.setDate(current.getDate() + 1);
  }
  ```

- [ ] **Step 5: Verify**

  Reload. Habits should cascade in. Add a habit — list re-renders with cascade. Delete a habit — erase-out animation plays. Open habits with an existing habit — the heatmap cells should fill in left-to-right over ~1 second (16 weeks × 7 days × 8ms = ~896ms total).

- [ ] **Step 6: Commit**

  ```bash
  git add js/habits.js
  git commit -m "feat: habit chalk-write cascade, erase-out on delete, heatmap stagger reveal"
  ```

---

## Final Verification

- [ ] Load fresh (clear localStorage). Confirms dark mode is default.
- [ ] Tasks and habits cascade in on load.
- [ ] Add a task → chalk-write cascade on re-render.
- [ ] Delete a task → erase-right animation, then list updates.
- [ ] Delete a habit → same erase animation.
- [ ] Heatmap cells stagger-fill on load.
- [ ] Dashboard panel opens/closes smoothly with no initial delay stutter.
- [ ] Toggle theme (eraser) → switches between deep chalkboard and warm parchment.
- [ ] Light mode: warm parchment background, wooden frame, faint ruled lines.
- [ ] Dark mode: deep green board, chalk texture, dark wood frame.
- [ ] Section titles in Space Grotesk, task/habit text in Caveat.
- [ ] All responsive breakpoints still work (resize to mobile).
