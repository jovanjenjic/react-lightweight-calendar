# React Lightweight Calendar

A lightweight, customizable calendar for React. Give it an array of objects with dates
and it lays them out the way Google Calendar does: a month grid, week and day
timelines, a horizontal day timeline and hour-by-hour views.

[Documentation](https://www.calendar-react.com) ·
[npm](https://www.npmjs.com/package/react-lightweight-calendar) ·
[JavaScript example](https://github.com/jovanjenjic/react-lightweight-calendar-example-js) ·
[TypeScript example](https://github.com/jovanjenjic/react-lightweight-calendar-example-ts)

- **Seven views** with a built-in toolbar and view switcher.
- **Google Calendar layout**: overlapping items share the width and cascade, multi-day
  items sit in lanes that never overlap, busy days show "+N more".
- **Render any part**: items, toolbar, day headers, day numbers, hour labels, "+N more",
  cell content and the legend. The calendar does the layout, you render the content.
- **Themeable** with a dozen CSS variables, plus light, dark and automatic themes.
- **Responsive**: adapts to the width it gets, down to phones.
- **No side effects on your page**: no global CSS, no outer margin or padding.
- **TypeScript**, React 18 and 19, ESM and CommonJS, `date-fns` as the only date library.

## Install

```bash
npm install react-lightweight-calendar
```

The stylesheet is imported with the component. It is also available as
`react-lightweight-calendar/styles.css`. In Jest, map `\.css$` to a stub with
`moduleNameMapper`, as for any package that imports CSS.

## Quick start

```jsx
import { useState } from 'react';
import Calendar from 'react-lightweight-calendar';

const events = [
  {
    id: 1,
    title: 'Design review',
    startTime: '2025-06-02T09:00:00Z',
    endTime: '2025-06-02T10:30:00Z',
  },
  {
    id: 2,
    title: 'Conference',
    startTime: '2025-06-03',
    endTime: '2025-06-05',
  },
];

export default function App() {
  const [view, setView] = useState('WEEK_TIME');
  const [date, setDate] = useState('2025-06-02');

  return (
    <div style={{ height: 700 }}>
      <Calendar
        data={events}
        activeTimeDateField="startTime-endTime"
        currentView={view}
        onViewChange={setView}
        currentDate={date}
        setCurrentDate={setDate}
      />
    </div>
  );
}
```

Give the calendar a height, as above, to make it fill the space and let its timeline
scroll. Without one, it takes the height of its content.

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

Each item needs a unique `id` and the date fields named by `activeTimeDateField`. Every
other field is kept and passed back to you.

| Field                  | Used for                                                                                |
| ---------------------- | --------------------------------------------------------------------------------------- |
| `id`                   | Telling items apart. Missing or duplicate ids still work.                               |
| `title`                | Text of the default item.                                                               |
| `bgColor`, `textColor` | Colors of the default item. With only `bgColor`, the text color is picked for contrast. |
| `allDay`               | `true` shows the item as a whole-day bar.                                               |
| your date fields       | Positioning: `activeTimeDateField="startTime"` or `"startTime-endTime"`.                |

Dates are read as ISO 8601. Date-only values like `2025-06-02` are whole days in local
time and include their end day (`start: '2025-06-02', end: '2025-06-05'` covers four
days). An end with a time is exclusive, so an `allDay` item ending at `2025-06-05T00:00`
covers three. Items of 24 hours or more and whole-day items go in the all-day row; shorter
items that cross midnight are split across their days. The `data` array is never modified.

## Props

| Prop                   | Type                                                                                              | Default                                  |
| ---------------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| `data`                 | `T[]`                                                                                             | `[]`                                     |
| `activeTimeDateField`  | `string`                                                                                          | —                                        |
| `currentView`          | `'MONTH' \| 'WEEK' \| 'WEEK_TIME' \| 'DAY' \| 'DAY_REVERSE' \| 'WEEK_IN_PLACE' \| 'DAY_IN_PLACE'` | `'MONTH'`                                |
| `currentDate`          | `string \| Date`                                                                                  | today                                    |
| `setCurrentDate`       | `(date: string) => void`                                                                          | — (shows the toolbar's navigation)       |
| `onViewChange`         | `(view) => void`                                                                                  | — (shows the view switcher)              |
| `views`                | `CalendarView[]`                                                                                  | all seven                                |
| `weekStartsOn`         | `0`–`6`                                                                                           | `1` (Monday)                             |
| `locale`               | date-fns `Locale`                                                                                 | `enUS`                                   |
| `timeDateFormat`       | `{ day?, narrowDay?, hour?, monthYear?, time? }`                                                  | `{ day: 'EEE', hour: 'h a', time: 'p' }` |
| `labels`               | `{ today?, previous?, next?, allDay?, close?, viewSwitcher?, more?, views? }`                     | English                                  |
| `todayLabel`           | `string`                                                                                          | `'Today'`                                |
| `startHour`, `endHour` | `number`                                                                                          | `0`, `24`                                |
| `scrollToHour`         | `number \| 'now'`                                                                                 | now on today's period, otherwise 8       |
| `dayMaxItems`          | `number \| 'auto'`                                                                                | `3`                                      |
| `colorDots`            | `{ color, text, date }[]`                                                                         | —                                        |
| `showColorDotsLegend`  | `boolean`                                                                                         | `true`                                   |
| `cellDisplayMode`      | `{ [view]: { state, inactiveCells? } }`                                                           | all expanded                             |
| `disableHoverEffect`   | `boolean`                                                                                         | `false`                                  |
| `theme`                | `'light' \| 'dark' \| 'auto'`                                                                     | `'light'`                                |
| `className`, `style`   |                                                                                                   |                                          |

### Callbacks

| Prop                | Receives                                                        |
| ------------------- | --------------------------------------------------------------- |
| `onItemClick`       | `(item, event)`                                                 |
| `onCellClick`       | `(dateInfo, event)`                                             |
| `onCellHeaderClick` | `(dateInfo, event)`                                             |
| `onDayNumberClick`  | `('yyyy-MM-dd', event)`                                         |
| `onDayStringClick`  | `('yyyy-MM-dd' \| currentDate, event)`                          |
| `onHourClick`       | `(hour, event)` in week views, `(dateInfo, event)` in day views |
| `onColorDotClick`   | `(dot, event)`                                                  |
| `onMoreClick`       | `(date, items, event)`; without it, a list of the day opens     |

`dateInfo` is `{ date, timeDate, timeDateUTC, day, month, year, hour?, isCurrentDay, isCurrentMonth? }`.
`timeDate` is the local key of the cell: `yyyy-MM-dd`, or `yyyy-MM-dd HH:mm:ss` in hour cells.

### Render props

| Prop                             | Renders                               | Arguments                                                                                |
| -------------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------- |
| `renderItem`                     | A whole item                          | `(item, isHovered, info)`                                                                |
| `renderItemText`                 | The content of the default item       | `(item, info)`                                                                           |
| `renderHeaderItem`               | An item in the all-day row            | `(item, { gridColumn, isFromPrevious, isFromNext, ...info })`                            |
| `renderHeaderItemText`           | Its content                           | `(item, info)`                                                                           |
| `renderNavigation`               | The toolbar                           | `{ title, goToToday, goToPrevious, goToNext, view, views, onViewChange, range, labels }` |
| `renderDayHeader`                | Column headers of the hour views      | `{ date, weekdayLabel, dayNumber, isToday, colorDot, onWeekdayClick, onDayNumberClick }` |
| `renderDayNumber`                | Day numbers in MONTH and WEEK         | `{ date, dayNumber, isToday, isCurrentMonth, colorDot }`                                 |
| `renderHourLabel`                | Hour labels                           | `{ hour, label }`                                                                        |
| `renderMoreLink`                 | "+N more"                             | `{ count, date, items }`                                                                 |
| `renderCellContent`              | Extra content in MONTH and WEEK cells | `{ date, items, isToday, isCurrentMonth }`                                               |
| `renderColorDot`, `renderLegend` | Color dots and their legend           | `(dot)`, `(dots)`                                                                        |

`info` describes the piece being drawn: `start`, `end`, `timeLabel` (`9:00 AM – 10:30 AM`),
`startTimeLabel` (`9:00 AM`), `isAllDay`, `isMultiDay`, `continuesBefore`,
`continuesAfter`, `isCompact`, `isHovered`. Both time labels are empty for all-day items.

## Theming

Set any of these on the calendar (`className` or `style`) or on an element around it:

| Variable                             | Default        |                                       |
| ------------------------------------ | -------------- | ------------------------------------- |
| `--rlc-primary`                      | `#1a73e8`      | Accent: today, active view, focus     |
| `--rlc-bg`                           | `#ffffff`      | Background                            |
| `--rlc-surface`                      | `#f1f3f4`      | Hovered controls                      |
| `--rlc-border`                       | `#dadce0`      | Grid lines                            |
| `--rlc-text`                         | `#1f1f1f`      | Text                                  |
| `--rlc-text-muted`                   | `#5f6368`      | Weekdays, hours, other months         |
| `--rlc-event-bg`                     | `#039be5`      | Default item color                    |
| `--rlc-event-text`                   | `#ffffff`      | Default item text                     |
| `--rlc-today-bg`, `--rlc-today-text` | primary, white | Today's date                          |
| `--rlc-now-color`                    | `#ea4335`      | Current-time line                     |
| `--rlc-radius`                       | `8px`          | Corner radius                         |
| `--rlc-font-family`                  | inherited      | Font                                  |
| `--rlc-font-size`                    | `14px`         | Base size; everything scales with it  |
| `--rlc-hour-height`                  | `48px`         | An hour in the timelines              |
| `--rlc-gutter-width`                 | `56px`         | The hour column                       |
| `--rlc-item-height`                  | `22px`         | Items in month, week and all-day rows |
| `--rlc-hour-width`                   | `88px`         | An hour in `DAY_REVERSE`              |

```jsx
<Calendar
  theme="dark"
  style={{ '--rlc-primary': '#7c3aed', '--rlc-radius': '16px' }}
/>
```

Class names start with `rlc-` for anything the variables do not cover.

## TypeScript

Types, enums and helpers are exported. Pass your item type to get typed callbacks:

```tsx
import Calendar, { type CalendarProps } from 'react-lightweight-calendar';

type Event = { id: string; title: string; start: string; end: string };

<Calendar<Event>
  data={events}
  activeTimeDateField="start-end"
  onItemClick={(event) => open(event.id)}
  cellDisplayMode={{ MONTH: { state: 'CUSTOM', inactiveCells: [] } }}
/>;
```

## Constants and helpers

The defaults are exported, so your own controls can reuse or extend them:

```tsx
import { CALENDAR_VIEWS, DEFAULT_LABELS } from 'react-lightweight-calendar';

const labels = {
  ...DEFAULT_LABELS,
  today: 'Danas',
  more: (n: number) => `još ${n}`,
};
```

| Constant                                    | Value                                                           |
| ------------------------------------------- | --------------------------------------------------------------- |
| `CALENDAR_VIEWS`, `WEEK_VIEWS`, `DAY_VIEWS` | All views, the one-week views, the one-day views                |
| `DEFAULT_LABELS`                            | English texts of every label                                    |
| `DEFAULT_FORMATS`                           | date-fns patterns for weekdays, hours and item times            |
| `DEFAULT_VIEW`, `DEFAULT_WEEK_STARTS_ON`    | `'MONTH'`, `1` (Monday)                                         |
| `DEFAULT_DAY_MAX_ITEMS`                     | Items per MONTH cell before "+N more" (`3`)                     |
| `DEFAULT_SCROLL_HOUR`                       | Hour the timelines scroll to when today is not shown (`8`)      |
| `MIN_ITEM_MINUTES`, `MOMENT_ITEM_MINUTES`   | Shortest drawn timeline item (`20`), item without an end (`30`) |
| `COMPACT_ITEM_MINUTES`                      | Timeline items shorter than this are drawn on one line (`45`)   |

The functions the calendar uses are exported too, for building your own views or
controls. All of them are pure and never modify their arguments.

| Group  | Functions                                                                                                                                                                                                                   |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dates  | `toDate`, `toDateKey`, `toDateTimeKey`, `isDateOnlyString`, `minutesFrom`, `getViewRange`, `shiftDate`, `getTitle`, `createDateInfo`, `normalizeView`, `normalizeWeekStartsOn`, `normalizeHours`, `isWeekView`, `isDayView` |
| Items  | `normalizeItems`, `compareItems`, `parseActiveField`, `firstDayOf`, `lastDayOf`, `isMultiDay`, `belongsToAllDayRow`, `itemsOnDay`                                                                                           |
| Layout | `layoutTimeGrid`, `layoutDayRow`, `layoutHorizontal`, `groupByStartHour`, `getCollapsedCells`                                                                                                                               |
| Format | `formatItemTime`, `readableTextColor`                                                                                                                                                                                       |

## Next.js

The package is marked `'use client'`, so it can be rendered from Server Components.
The calendar shows "today" and places items in the visitor's time zone, which the server
cannot know; load it with `next/dynamic` and `{ ssr: false }` to avoid hydration
differences.

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
- **Package**: types and enums are exported; `cellDisplayMode` accepts plain strings.

## Development

```bash
nvm use
npm install
npm start            # examples app on http://localhost:3000
npm test             # unit tests (Vitest) and component tests (Cypress)
npm run lint
npm run build
npm run release -- <patch|minor|major>   # see RELEASING.md
```

## License

MIT
