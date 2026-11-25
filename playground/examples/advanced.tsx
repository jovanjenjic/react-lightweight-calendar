import { addDays, addHours, format, startOfWeek } from 'date-fns';
import { useMemo, useState } from 'react';
import Calendar, {
  shiftDate,
  toDate,
  getTitle,
  getViewRange,
  type CalendarView,
} from '../../src';
import { COLORS, dateKey, manyEvents, weekEvents, type Event } from '../data';
import {
  Controls,
  Field,
  Frame,
  Log,
  useCalendarState,
  type Example,
} from './shared';

/* -------------------------------------------------------------------------- */

function CreateEvents({ theme }: { theme: 'light' | 'dark' | 'auto' }) {
  const { view, setView, date, setDate } = useCalendarState('WEEK_TIME');
  const [events, setEvents] = useState<Event[]>(() => weekEvents());
  const [selected, setSelected] = useState<Event | null>(null);
  const [count, setCount] = useState(1);

  return (
    <>
      <Controls>
        {selected ? (
          <>
            <Field label="Title">
              <input
                value={selected.title}
                onChange={(e) => {
                  const next = { ...selected, title: e.target.value };
                  setSelected(next);
                  setEvents((list) =>
                    list.map((x) => (x.id === next.id ? next : x)),
                  );
                }}
              />
            </Field>
            <Field label="Color">
              <select
                value={selected.bgColor ?? COLORS.blue}
                onChange={(e) => {
                  const next = { ...selected, bgColor: e.target.value };
                  setSelected(next);
                  setEvents((list) =>
                    list.map((x) => (x.id === next.id ? next : x)),
                  );
                }}
              >
                {Object.entries(COLORS).map(([name, value]) => (
                  <option key={name} value={value}>
                    {name}
                  </option>
                ))}
              </select>
            </Field>
            <button
              onClick={() => {
                setEvents((list) => list.filter((x) => x.id !== selected.id));
                setSelected(null);
              }}
            >
              Delete
            </button>
            <button onClick={() => setSelected(null)}>Done</button>
          </>
        ) : (
          <span className="pg-muted">
            Click an empty slot to add a one-hour event, click an event to edit
            it.
          </span>
        )}
      </Controls>
      <Frame>
        <Calendar<Event>
          theme={theme}
          data={events}
          currentView={view}
          onViewChange={setView}
          views={['MONTH', 'WEEK_TIME', 'DAY']}
          currentDate={date}
          setCurrentDate={setDate}
          activeTimeDateField="startTime-endTime"
          onItemClick={(item) => setSelected(item)}
          onCellClick={({ timeDate }) => {
            const start = toDate(
              timeDate.length > 10
                ? timeDate.replace(' ', 'T')
                : `${timeDate}T09:00:00`,
            )!;
            const created: Event = {
              id: `new-${count}`,
              title: `New event ${count}`,
              startTime: start.toISOString(),
              endTime: addHours(start, 1).toISOString(),
              bgColor: COLORS.indigo,
            };
            setCount((n) => n + 1);
            setEvents((list) => [...list, created]);
            setSelected(created);
          }}
        />
      </Frame>
    </>
  );
}

/* -------------------------------------------------------------------------- */

function Callbacks({ theme }: { theme: 'light' | 'dark' | 'auto' }) {
  const { view, setView, date, setDate } = useCalendarState('WEEK_TIME');
  const data = useMemo(() => weekEvents(), []);
  const [log, setLog] = useState<string[]>([]);
  const push = (entry: string) =>
    setLog((prev) => [entry, ...prev].slice(0, 8));
  const dots = useMemo(
    () => [{ color: COLORS.red, text: 'Deadline', date: dateKey(new Date()) }],
    [],
  );
  return (
    <div className="pg-split">
      <Frame height={620}>
        <Calendar
          theme={theme}
          data={data}
          currentView={view}
          onViewChange={(v) => {
            push(`onViewChange("${v}")`);
            setView(v);
          }}
          currentDate={date}
          setCurrentDate={(d) => {
            push(`setCurrentDate("${String(d)}")`);
            setDate(d);
          }}
          activeTimeDateField="startTime-endTime"
          colorDots={dots}
          onItemClick={(item) => push(`onItemClick("${item.title}")`)}
          onCellClick={(info) => push(`onCellClick("${info.timeDate}")`)}
          onCellHeaderClick={(info) =>
            push(`onCellHeaderClick("${info.timeDate}")`)
          }
          onDayNumberClick={(day) => push(`onDayNumberClick("${day}")`)}
          onDayStringClick={(day) => push(`onDayStringClick("${String(day)}")`)}
          onHourClick={(value) =>
            push(
              `onHourClick(${typeof value === 'number' ? value : `"${value.timeDate}"`})`,
            )
          }
          onColorDotClick={(dot) => push(`onColorDotClick("${dot.text}")`)}
          onMoreClick={(day, items) =>
            push(`onMoreClick("${dateKey(day)}", ${items.length} items)`)
          }
          dayMaxItems={2}
        />
      </Frame>
      <Log entries={log} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Performance({ theme }: { theme: 'light' | 'dark' | 'auto' }) {
  const { view, setView, date, setDate } = useCalendarState('MONTH');
  const [count, setCount] = useState(2000);
  const data = useMemo(() => manyEvents(count), [count]);
  return (
    <>
      <Controls>
        <Field label="Items">
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
          >
            <option value={500}>500</option>
            <option value={2000}>2,000</option>
            <option value={5000}>5,000</option>
          </select>
        </Field>
        <span className="pg-muted">
          Only the visible period is laid out; switching views and periods stays
          instant.
        </span>
      </Controls>
      <Frame height={680}>
        <Calendar
          theme={theme}
          data={data}
          currentView={view}
          onViewChange={setView}
          currentDate={date}
          setCurrentDate={setDate}
          activeTimeDateField="startTime-endTime"
          dayMaxItems="auto"
        />
      </Frame>
    </>
  );
}

/* -------------------------------------------------------------------------- */

function ExternalControls({ theme }: { theme: 'light' | 'dark' | 'auto' }) {
  const [view, setView] = useState<CalendarView>('WEEK_TIME');
  const [date, setDate] = useState(new Date());
  const data = useMemo(() => weekEvents(), []);
  const range = getViewRange(view, date, 1);
  return (
    <>
      <div className="pg-external">
        <button onClick={() => setDate((d) => shiftDate(view, d, -1))}>
          ←
        </button>
        <button onClick={() => setDate(new Date())}>Today</button>
        <button onClick={() => setDate((d) => shiftDate(view, d, 1))}>→</button>
        <strong>{getTitle(view, date, range, undefined)}</strong>
        <span className="pg-spacer" />
        <select
          value={view}
          onChange={(e) => setView(e.target.value as CalendarView)}
        >
          <option>MONTH</option>
          <option>WEEK</option>
          <option>WEEK_TIME</option>
          <option>DAY</option>
        </select>
      </div>
      <Frame height={600}>
        <Calendar
          theme={theme}
          data={data}
          currentView={view}
          currentDate={date}
          activeTimeDateField="startTime-endTime"
        />
      </Frame>
      <p className="pg-muted">
        No setCurrentDate, so the built-in toolbar is hidden. The buttons above
        use the exported helpers shiftDate, getViewRange and getTitle.
      </p>
    </>
  );
}

/* -------------------------------------------------------------------------- */

function Responsive({ theme }: { theme: 'light' | 'dark' | 'auto' }) {
  const data = useMemo(() => weekEvents(), []);
  const [view, setView] = useState<CalendarView>('WEEK_TIME');
  return (
    <>
      <Controls>
        <Field label="View">
          <select
            value={view}
            onChange={(e) => setView(e.target.value as CalendarView)}
          >
            <option>MONTH</option>
            <option>WEEK</option>
            <option>WEEK_TIME</option>
            <option>DAY</option>
            <option>DAY_REVERSE</option>
            <option>WEEK_IN_PLACE</option>
          </select>
        </Field>
        <span className="pg-muted">
          The calendar adapts to its own width, not the window: the same
          component in four boxes.
        </span>
      </Controls>
      <div className="pg-widths">
        {[340, 420, 640, 900].map((width) => (
          <div key={width} className="pg-width" style={{ width }}>
            <div className="pg-width__label">{width}px</div>
            <div style={{ height: 520 }}>
              <ResponsiveCalendar theme={theme} view={view} data={data} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function ResponsiveCalendar({
  theme,
  view,
  data,
}: {
  theme: 'light' | 'dark' | 'auto';
  view: CalendarView;
  data: Event[];
}) {
  const [date, setDate] = useState<string | Date>(dateKey(new Date()));
  return (
    <Calendar
      theme={theme}
      data={data}
      currentView={view}
      currentDate={date}
      setCurrentDate={setDate}
      activeTimeDateField="startTime-endTime"
      dayMaxItems="auto"
    />
  );
}

/* -------------------------------------------------------------------------- */

function EdgeCases({ theme }: { theme: 'light' | 'dark' | 'auto' }) {
  const { view, setView, date, setDate } = useCalendarState('WEEK_TIME');
  const data = useMemo(() => {
    const mon = startOfWeek(new Date(), { weekStartsOn: 1 });
    const d = (n: number, h = 0, m = 0) => {
      const x = addDays(mon, n);
      x.setHours(h, m, 0, 0);
      return x;
    };
    const frozen = Object.freeze([
      {
        id: 0,
        title: 'id 0 (hover still works)',
        startTime: d(0, 9).toISOString(),
        endTime: d(0, 10).toISOString(),
      },
      {
        id: 0,
        title: 'duplicate id 0',
        startTime: d(0, 9, 30).toISOString(),
        endTime: d(0, 11).toISOString(),
        bgColor: COLORS.orange,
      },
      {
        title: 'no id at all',
        startTime: d(1, 9).toISOString(),
        endTime: d(1, 10).toISOString(),
        bgColor: COLORS.green,
      },
      {
        id: 'bad',
        title: 'invalid date (skipped)',
        startTime: 'not a date',
        endTime: d(1, 11).toISOString(),
      },
      {
        id: 'rev',
        title: 'end before start (shown as a moment)',
        startTime: d(1, 14).toISOString(),
        endTime: d(1, 12).toISOString(),
        bgColor: COLORS.red,
      },
      {
        id: 'zero',
        title: 'zero length',
        startTime: d(2, 10).toISOString(),
        endTime: d(2, 10).toISOString(),
        bgColor: COLORS.grey,
      },
      {
        id: 'midnight',
        title: 'ends at midnight (one day only)',
        startTime: d(2, 21).toISOString(),
        endTime: d(3, 0).toISOString(),
        bgColor: COLORS.purple,
      },
      {
        id: 'date-only',
        title: 'date-only, all day',
        startTime: dateKey(d(3)),
        endTime: dateKey(d(3)),
        bgColor: COLORS.teal,
      },
      {
        id: 'flag',
        title: 'allDay: true',
        startTime: d(4, 13).toISOString(),
        endTime: d(4, 15).toISOString(),
        allDay: true,
        bgColor: COLORS.indigo,
      },
      {
        id: 'long-title',
        title:
          'A really, really long title that has to be truncated nicely instead of breaking the layout',
        startTime: d(4, 9).toISOString(),
        endTime: d(4, 10, 30).toISOString(),
        bgColor: COLORS.pink,
      },
      {
        id: 'pastel',
        title: 'pastel bgColor gets dark text',
        startTime: d(5, 10).toISOString(),
        endTime: d(5, 12).toISOString(),
        bgColor: '#fde68a',
      },
      {
        id: '24h',
        title: 'exactly 24 hours (all-day row)',
        startTime: d(6, 8).toISOString(),
        endTime: d(7, 8).toISOString(),
        bgColor: COLORS.yellow,
      },
    ]);
    return frozen as unknown as Event[];
  }, []);
  return (
    <>
      <Controls>
        <span className="pg-muted">
          The data array is frozen: the calendar never sorts or changes it.{' '}
          {format(new Date(), 'PPpp')}
        </span>
      </Controls>
      <Frame>
        <Calendar
          theme={theme}
          data={data}
          currentView={view}
          onViewChange={setView}
          views={['MONTH', 'WEEK', 'WEEK_TIME', 'DAY']}
          currentDate={date}
          setCurrentDate={setDate}
          activeTimeDateField="startTime-endTime"
          scrollToHour={8}
        />
      </Frame>
    </>
  );
}

export const advancedExamples: Example[] = [
  {
    id: 'create',
    group: 'Recipes',
    title: 'Create and edit events',
    description:
      'onCellClick creates an event where you click, onItemClick selects it for editing.',
    Component: CreateEvents,
  },
  {
    id: 'callbacks',
    group: 'Recipes',
    title: 'Callbacks',
    description: 'Every callback, logged with what it receives.',
    Component: Callbacks,
  },
  {
    id: 'external',
    group: 'Recipes',
    title: 'Your own controls',
    description:
      'Hide the toolbar and drive the view and date from your own UI.',
    Component: ExternalControls,
  },
  {
    id: 'responsive',
    group: 'Quality',
    title: 'Responsive',
    description:
      'Container queries adapt the calendar to the space it gets, down to phone widths.',
    Component: Responsive,
  },
  {
    id: 'performance',
    group: 'Quality',
    title: 'Thousands of items',
    description: 'Thousands of items over three months.',
    Component: Performance,
  },
  {
    id: 'edge-cases',
    group: 'Quality',
    title: 'Edge cases',
    description:
      'Missing and duplicate ids, invalid dates, reversed ranges, midnight, date-only and 24-hour items.',
    Component: EdgeCases,
  },
];
