# React Lightweight Calendar

[![npm version](https://img.shields.io/npm/v/react-lightweight-calendar.svg)](https://www.npmjs.com/package/react-lightweight-calendar)
[![npm downloads](https://img.shields.io/npm/dm/react-lightweight-calendar.svg)](https://www.npmjs.com/package/react-lightweight-calendar)
[![types](https://img.shields.io/npm/types/react-lightweight-calendar.svg)](https://www.npmjs.com/package/react-lightweight-calendar)
[![license](https://img.shields.io/npm/l/react-lightweight-calendar.svg)](./LICENSE)

A lightweight, customizable calendar for React. Give it an array of objects with dates
and it lays them out the way Google Calendar does: a month grid, week and day
timelines, a horizontal day timeline and hour-by-hour views.

**[Documentation](https://calendar-react.com)** ·
**[Examples & playground](https://calendar-react.com/examples)** ·
[npm](https://www.npmjs.com/package/react-lightweight-calendar) ·
[Changelog](./CHANGELOG.md)

- **Seven views** with a built-in toolbar and view switcher.
- **Google Calendar layout**: overlapping items share the width and cascade, multi-day
  items sit in lanes that never overlap, busy days show "+N more".
- **Render any part**: items, toolbar, day headers, day numbers, hour labels, "+N more",
  cell content and the legend. The calendar does the layout, you render the content.
- **Themeable** with CSS variables, plus light, dark and automatic themes.
- **Responsive**: adapts to the width it gets, not the window, down to phones.
- **No side effects on your page**: no global CSS, no outer margin or padding.
- **Accessible**: items and controls work with the keyboard and have labels.
- **TypeScript**, React 18 and 19, ESM and CommonJS, `date-fns` as the only date library.

## Install

```bash
npm install react-lightweight-calendar
```

React 18 or 19 is a peer dependency. The stylesheet is imported with the component;
it is also available as `react-lightweight-calendar/styles.css`. In Jest, map `\.css$`
to a stub with `moduleNameMapper`, as for any package that imports CSS.

## Quick start

```jsx
import { useState } from 'react';
import Calendar from 'react-lightweight-calendar';

const events = [
  {
    id: 1,
    title: 'Design review',
    start: '2025-06-02T09:00:00',
    end: '2025-06-02T10:30:00',
  },
  { id: 2, title: 'Conference', start: '2025-06-03', end: '2025-06-05' },
];

export default function App() {
  const [view, setView] = useState('WEEK_TIME');
  const [date, setDate] = useState('2025-06-02');

  return (
    // The calendar fills its parent: give the parent a height.
    <div style={{ height: 700 }}>
      <Calendar
        data={events}
        activeTimeDateField="start-end"
        currentView={view}
        onViewChange={setView}
        currentDate={date}
        setCurrentDate={setDate}
      />
    </div>
  );
}
```

- `activeTimeDateField` names the fields that hold the dates: `"start-end"` for a range,
  or a single field such as `"start"` for a moment.
- `setCurrentDate` shows the navigation (today, previous, next) and `onViewChange` the
  view switcher. Leave them out for a calendar without a toolbar.
- With a height, the calendar fills it and its timelines scroll; without one, it takes
  the height of its content.

More in the [examples](https://calendar-react.com/examples), each with its source.

## Views

| View            | Shows                                                                         |
| --------------- | ----------------------------------------------------------------------------- |
| `MONTH`         | The month in weeks. Bars for multi-day items, dots for timed ones, "+N more". |
| `WEEK`          | One week of day cells.                                                        |
| `WEEK_TIME`     | One week on an hour timeline with an all-day row.                             |
| `DAY`           | One day on an hour timeline with an all-day row.                              |
| `DAY_REVERSE`   | One day with hours running horizontally, items in lanes.                      |
| `WEEK_IN_PLACE` | One week, a cell per hour listing the items that start in it.                 |
| `DAY_IN_PLACE`  | The same for one day.                                                         |

## Data

Items can be any objects. The calendar reads these fields and passes the original
objects back to your callbacks; the `data` array is never sorted or changed.

| Field                  | Used for                                                                                |
| ---------------------- | --------------------------------------------------------------------------------------- |
| your date fields       | Position. Named by `activeTimeDateField`: `"startTime"` or `"startTime-endTime"`.       |
| `id`                   | Keeping hover and rendering stable. Recommended; missing or duplicate ids still work.   |
| `title`                | Text of the default item.                                                               |
| `bgColor`, `textColor` | Colors of the default item. With only `bgColor`, the text color is picked for contrast. |
| `allDay`               | `true` shows the item as a whole-day bar, whatever the times.                           |

Dates can be ISO 8601 strings, `Date` objects or timestamps.

- Date-only values like `2025-06-02` are whole days in local time and include their end
  day: `start: '2025-06-02', end: '2025-06-05'` covers four days.
- An end with a time is exclusive, so an `allDay` item ending at `2025-06-05T00:00`
  covers three days.
- Items of 24 hours or more and whole-day items go in the all-day row. Shorter items that
  cross midnight are split across their days.

## Props

| Prop                   | Type                                             | Default                                  | Description                                                                          |
| ---------------------- | ------------------------------------------------ | ---------------------------------------- | ------------------------------------------------------------------------------------ |
| `data`                 | `T[]`                                            | `[]`                                     | Items to show.                                                                       |
| `activeTimeDateField`  | `string`                                         | —                                        | Date field, or two fields joined by `-` for a range.                                 |
| `currentView`          | `CalendarView`                                   | `'MONTH'`                                | One of the [views](#views).                                                          |
| `currentDate`          | `string \| Date`                                 | today                                    | A day in the period to show; `yyyy-MM-dd` or a `Date`.                               |
| `setCurrentDate`       | `(date: string) => void`                         | —                                        | Shows the navigation. Receives the new date as `yyyy-MM-dd`.                         |
| `onViewChange`         | `(view: CalendarView) => void`                   | —                                        | Shows the view switcher.                                                             |
| `views`                | `CalendarView[]`                                 | all seven                                | Views offered by the switcher.                                                       |
| `weekStartsOn`         | `0`–`6`                                          | `1`                                      | First day of the week, `0` is Sunday.                                                |
| `locale`               | date-fns `Locale`                                | `enUS`                                   | Month and weekday names, and date formats.                                           |
| `timeDateFormat`       | `{ day?, narrowDay?, hour?, monthYear?, time? }` | `{ day: 'EEE', hour: 'h a', time: 'p' }` | date-fns patterns for weekdays, hour labels, the toolbar title and item times.       |
| `labels`               | `CalendarLabels`                                 | English                                  | `{ today, previous, next, allDay, close, viewSwitcher, more, views }`, all optional. |
| `todayLabel`           | `string`                                         | `'Today'`                                | Shortcut for `labels.today`.                                                         |
| `startHour`, `endHour` | `number`                                         | `0`, `24`                                | Hours shown in the timelines; `endHour` is exclusive.                                |
| `scrollToHour`         | `number \| 'now'`                                | `'now'` on today, otherwise `8`          | Hour the timelines scroll to when the view or period changes.                        |
| `dayMaxItems`          | `number \| 'auto'`                               | `3`                                      | Items per `MONTH` cell before "+N more"; `'auto'` fits the cell height.              |
| `colorDots`            | `ColorDot[]`                                     | —                                        | Colored dots on days: `{ color, text, date }`.                                       |
| `showColorDotsLegend`  | `boolean`                                        | `true`                                   | Lists the dot colors under the calendar.                                             |
| `cellDisplayMode`      | `CellDisplayMode`                                | all expanded                             | Cells that show only their last item, per view. See below.                           |
| `disableHoverEffect`   | `boolean`                                        | `false`                                  | Turns off the hover highlight of items.                                              |
| `theme`                | `'light' \| 'dark' \| 'auto'`                    | `'light'`                                | `'auto'` follows the system setting.                                                 |
| `className`, `style`   |                                                  |                                          | On the root element, for example for [CSS variables](#theming).                      |

`cellDisplayMode` collapses cells: `{ MONTH: { state: 'ALL_COLLAPSED' } }` for a whole
view, or `{ WEEK_IN_PLACE: { state: 'CUSTOM', inactiveCells: ['2025-06-02 09:00:00'] } }`
for single cells (`yyyy-MM-dd`, or `yyyy-MM-dd HH:mm:ss` for hour cells).

### Callbacks

| Prop                | Receives                                                                        |
| ------------------- | ------------------------------------------------------------------------------- |
| `onItemClick`       | `(item, event)`, with your original object                                      |
| `onCellClick`       | `(dateInfo, event)`                                                             |
| `onCellHeaderClick` | `(dateInfo, event)`, from day headers and the all-day row                       |
| `onDayNumberClick`  | `('yyyy-MM-dd', event)`                                                         |
| `onDayStringClick`  | `('yyyy-MM-dd', event)` from weekday names; `currentDate` as given in day views |
| `onHourClick`       | `(hour, event)` in week views, `(dateInfo, event)` in day views                 |
| `onColorDotClick`   | `(dot, event)`                                                                  |
| `onMoreClick`       | `(date, items, event)`; without it, a list of the day opens                     |

`dateInfo` is `{ date, timeDate, timeDateUTC, day, month, year, hour?, isCurrentDay,
isCurrentMonth? }`. `timeDate` is the local key of the cell, `yyyy-MM-dd` or
`yyyy-MM-dd HH:mm:ss` in hour cells, and `timeDateUTC` the start of the cell as an ISO
string.

### Render props

| Prop                             | Renders                                   | Arguments                                                                                                          |
| -------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `renderItem`                     | Every item outside the all-day row        | `(item, isHovered, info)`                                                                                          |
| `renderItemText`                 | The content of the default item           | `(item, info)`                                                                                                     |
| `renderHeaderItem`               | An item in the all-day row                | `(item, { gridColumn, isFromPrevious, isFromNext, ...info })`                                                      |
| `renderHeaderItemText`           | Its content                               | `(item, info)`                                                                                                     |
| `renderNavigation`               | The toolbar                               | `{ title, currentDate, view, range, goToToday, goToPrevious, goToNext, canNavigate, views, onViewChange, labels }` |
| `renderDayHeader`                | Column headers of the hour views          | `{ date, dateInfo, weekdayLabel, dayNumber, isToday, view, colorDot, onWeekdayClick, onDayNumberClick }`           |
| `renderDayNumber`                | Day numbers in `MONTH` and `WEEK`         | `{ date, dateInfo, dayNumber, isToday, isCurrentMonth, colorDot }`                                                 |
| `renderHourLabel`                | Hour labels                               | `{ hour, label, view }`                                                                                            |
| `renderMoreLink`                 | "+N more"                                 | `{ count, date, items }`                                                                                           |
| `renderCellContent`              | Extra content in `MONTH` and `WEEK` cells | `{ date, dateInfo, items, isToday, isCurrentMonth }`                                                               |
| `renderColorDot`, `renderLegend` | Color dots and their legend               | `(dot)`, `(dots)`                                                                                                  |

The calendar still positions and sizes everything; what a render prop returns fills its
place. `info` describes the piece being drawn: `start`, `end`, `view`, `timeLabel`
(`9:00 AM – 10:30 AM`), `startTimeLabel` (`9:00 AM`), `isAllDay`, `isMultiDay`,
`continuesBefore`, `continuesAfter`, `isCompact` and `isHovered`. The time labels are
empty for all-day items.

```jsx
<Calendar
  data={events}
  activeTimeDateField="start-end"
  renderItem={(event, isHovered, info) => (
    <div className={isHovered ? 'event event--hovered' : 'event'}>
      <strong>{event.title}</strong>
      {!info.isCompact && <span>{info.timeLabel}</span>}
    </div>
  )}
/>
```

## Theming

`theme` picks the light or dark palette, or follows the system with `'auto'`. CSS
variables change the rest. Set them with `style` or `className`, or on any element
around the calendar:

| Variable                             | Default        | Used for                              |
| ------------------------------------ | -------------- | ------------------------------------- |
| `--rlc-primary`                      | `#1a73e8`      | Accent: today, active view, focus     |
| `--rlc-bg`                           | `#ffffff`      | Background                            |
| `--rlc-surface`                      | `#f1f3f4`      | Hovered controls                      |
| `--rlc-border`                       | `#dadce0`      | Grid lines                            |
| `--rlc-text`                         | `#1f1f1f`      | Text                                  |
| `--rlc-text-muted`                   | `#5f6368`      | Weekdays, hours, other months         |
| `--rlc-event-bg`                     | `#039be5`      | Items without `bgColor`               |
| `--rlc-event-text`                   | `#ffffff`      | Their text                            |
| `--rlc-today-bg`, `--rlc-today-text` | primary, white | Today's date                          |
| `--rlc-now-color`                    | `#ea4335`      | Current-time line                     |
| `--rlc-radius`                       | `8px`          | Corner radius                         |
| `--rlc-font-family`                  | inherited      | Font                                  |
| `--rlc-font-size`                    | `14px`         | Base size; everything scales with it  |
| `--rlc-hour-height`                  | `48px`         | An hour in the timelines              |
| `--rlc-gutter-width`                 | `56px`         | The hour column                       |
| `--rlc-item-height`                  | `22px`         | Items in month, week and all-day rows |
| `--rlc-month-row-height`             | `7.5em`        | Minimum height of a week in `MONTH`   |
| `--rlc-hour-width`                   | `88px`         | An hour in `DAY_REVERSE`              |

The dark theme has its own defaults; variables you set win in both.

```tsx
import type { CSSProperties } from 'react';

<Calendar
  theme="dark"
  style={
    { '--rlc-primary': '#7c3aed', '--rlc-radius': '16px' } as CSSProperties
  }
/>;
```

Class names start with `rlc-` for anything the variables do not cover.

## Localization

Pass a [date-fns locale](https://date-fns.org/docs/I18n) for month and weekday names,
and `labels` for the calendar's own texts:

```jsx
import { de } from 'date-fns/locale';

<Calendar
  locale={de}
  weekStartsOn={1}
  timeDateFormat={{ hour: 'HH:mm', time: 'HH:mm' }}
  labels={{
    today: 'Heute',
    allDay: 'Ganztägig',
    more: (count) => `+${count} weitere`,
    views: { MONTH: 'Monat', WEEK_TIME: 'Woche', DAY: 'Tag' },
  }}
/>;
```

## TypeScript

Types and enums are exported. Pass your item type to `Calendar` to type the items in
every callback and render prop:

```tsx
import { useState } from 'react';
import Calendar, { type CalendarView } from 'react-lightweight-calendar';

interface Event {
  id: string;
  title: string;
  start: string;
  end: string;
}

export function Schedule({
  events,
  onOpen,
}: {
  events: Event[];
  onOpen: (id: string) => void;
}) {
  const [view, setView] = useState<CalendarView>('WEEK_TIME');
  const [date, setDate] = useState<string | Date>(new Date());

  return (
    <Calendar<Event>
      data={events}
      activeTimeDateField="start-end"
      currentView={view}
      onViewChange={setView}
      currentDate={date}
      setCurrentDate={setDate}
      onItemClick={(event) => onOpen(event.id)} // event: Event
    />
  );
}
```

Among the exported types: `CalendarProps<T>`, `CalendarView`, `CalendarItem`,
`DateInfo`, `ItemRenderInfo`, `ColorDot`, `CalendarLabels`, `TimeFormat`,
`CellDisplayMode`, `CalendarTheme` and the argument types of every render prop.

## Constants and helpers

The defaults are exported, so your own controls can reuse or extend them:

```js
import { CALENDAR_VIEWS, DEFAULT_LABELS } from 'react-lightweight-calendar';

const labels = { ...DEFAULT_LABELS, today: 'Now' };
```

| Constant                                    | Value                                                           |
| ------------------------------------------- | --------------------------------------------------------------- |
| `CALENDAR_VIEWS`, `WEEK_VIEWS`, `DAY_VIEWS` | All views, the one-week views, the one-day views                |
| `DEFAULT_LABELS`                            | English texts of every label                                    |
| `DEFAULT_FORMATS`                           | date-fns patterns for weekdays, hours and item times            |
| `DEFAULT_VIEW`, `DEFAULT_WEEK_STARTS_ON`    | `'MONTH'`, `1` (Monday)                                         |
| `DEFAULT_DAY_MAX_ITEMS`                     | Items per `MONTH` cell before "+N more" (`3`)                   |
| `DEFAULT_SCROLL_HOUR`                       | Hour the timelines scroll to when today is not shown (`8`)      |
| `MIN_ITEM_MINUTES`, `MOMENT_ITEM_MINUTES`   | Shortest drawn timeline item (`20`), item without an end (`30`) |
| `COMPACT_ITEM_MINUTES`                      | Timeline items shorter than this are drawn on one line (`45`)   |

The functions the calendar uses are exported too, for your own controls or views. They
are pure and never modify their arguments. For example, to load only the visible days:

```js
import { getViewRange, toDateKey } from 'react-lightweight-calendar';

const { start, end } = getViewRange('WEEK_TIME', new Date(), 1);
fetch(`/api/events?from=${toDateKey(start)}&to=${toDateKey(end)}`);
```

| Group  | Functions                                                                                                                                                                                                                   |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dates  | `toDate`, `toDateKey`, `toDateTimeKey`, `isDateOnlyString`, `minutesFrom`, `getViewRange`, `shiftDate`, `getTitle`, `createDateInfo`, `normalizeView`, `normalizeWeekStartsOn`, `normalizeHours`, `isWeekView`, `isDayView` |
| Items  | `normalizeItems`, `compareItems`, `parseActiveField`, `firstDayOf`, `lastDayOf`, `isMultiDay`, `belongsToAllDayRow`, `itemsOnDay`                                                                                           |
| Layout | `layoutTimeGrid`, `layoutDayRow`, `layoutHorizontal`, `groupByStartHour`, `getCollapsedCells`                                                                                                                               |
| Format | `formatItemTime`, `readableTextColor`                                                                                                                                                                                       |

## Next.js

The package is marked `'use client'`, so Server Components can render it. The calendar
shows "today" and places items in the visitor's time zone, which the server cannot
know, so render it in the browser only:

```tsx
'use client';

import dynamic from 'next/dynamic';

const Calendar = dynamic(() => import('react-lightweight-calendar'), {
  ssr: false,
});
```

## Browser support

Current versions of Chrome, Edge, Firefox and Safari: Chrome and Edge 111+, Firefox
113+, Safari 16.2+. The layout uses CSS container queries and `color-mix()`.

## Upgrading from 2.x

The props and callbacks are the same. What changed:

- **Styles**: new class names (`rlc-*`) and CSS variables (`--rlc-*`); the old ones are
  gone. The calendar no longer resets margins on the whole page and has no outer margin.
- **Layout**: overlapping items cascade like Google Calendar; month cells show
  "+N more" after `dayMaxItems` (3) items; timed items in the month are dots.
- **Dates**: `yyyy-MM-dd` strings are local dates everywhere (2.x read them as UTC,
  which showed the wrong day west of UTC). `timeDateUTC` of whole-day cells is local
  midnight. An item ending exactly at midnight no longer spills into the next day.
- **Items**: callbacks receive your original objects; `data` is never sorted or changed.
  Custom header items (`renderHeaderItem`) now call `onItemClick` too.
- **Defaults**: hour labels use `h a` (`9 AM`), item times use the locale's short time.
- **Package**: types, enums, constants and helpers are exported; `cellDisplayMode`
  accepts plain strings.

## Development

```bash
nvm use              # Node 24, see .nvmrc
npm install
npm start            # examples app on http://localhost:3000
npm test             # unit tests (Vitest) and component tests (Cypress)
npm run lint
npm run build
npm run storybook
```

Releases are published with `npm run release -- <patch|minor|major>`; see
[RELEASING.md](./RELEASING.md).

## License

[MIT](./LICENSE)
