# Changelog

## 3.0.0

A rewrite of the rendering, with the same props and callbacks.

### New

- Google Calendar style layout: overlapping timeline items share the width and cascade;
  multi-day items sit in lanes; month cells show "+N more" with a list of the day.
- Built-in view switcher (`onViewChange`, `views`) and toolbar titles per view.
- Render props for every part: `renderNavigation`, `renderDayHeader`, `renderDayNumber`,
  `renderHourLabel`, `renderMoreLink`, `renderCellContent`, `renderColorDot`,
  `renderLegend`. Item renderers get an `info` argument with times and positions.
- `theme` (`light`, `dark`, `auto`), CSS variables (`--rlc-*`), `className`, `style`.
- Responsive layout through container queries, down to phone widths.
- `startHour`, `endHour`, `scrollToHour`, `dayMaxItems`, `labels`, `onMoreClick`,
  `showColorDotsLegend`, `timeDateFormat.time`, `allDay` on items.
- A current-time line that updates every minute.
- Keyboard support for items, accessible labels for controls.
- Exported types, enums, defaults (`CALENDAR_VIEWS`, `DEFAULT_LABELS`, `DEFAULT_FORMATS`,
  ...) and the pure date, item, layout and format helpers. `Calendar<T>` types your items.
- `info.startTimeLabel`, `labels.viewSwitcher`, `timeDateFormat.narrowDay`, and
  `onWeekdayClick` / `onDayNumberClick` in `renderDayHeader`.
- `cellDisplayMode` is typed per view, and `inactiveCells` is only needed with `CUSTOM`.
- `'use client'` for the Next.js App Router.

### Fixed

- Date-only strings (`2025-06-02`) were read as UTC and showed the previous day west of
  UTC.
- The stylesheet reset margins and paddings of every element on the page.
- `data` was sorted in place.
- Hover broke for items with `id: 0` or duplicate ids.
- Items ending exactly at midnight spilled into the next day.
- The current-time line did not move.
- `cellDisplayMode.state` did not accept plain strings in TypeScript.
- The month view crashed without `IntersectionObserver` (jsdom tests).
- `startHour` / `endHour` outside 0–24 broke the timelines; they are now clamped.
- Date-only values that do not exist (`2025-02-31`) rolled over to the next month; such
  items are now left out.

### Changed

- New class names (`rlc-*`) and CSS variables; the old ones are removed.
- No outer margin, padding or fixed font: the calendar inherits your font.
- Timed items in the month are dots; `dayMaxItems` defaults to 3.
- Hour labels default to `h a`; item times to the locale's short time.
- `timeDateUTC` of whole-day cells is local midnight.
- One bundle per format: `dist/index.mjs`, `dist/index.cjs`, `dist/styles.css`.
