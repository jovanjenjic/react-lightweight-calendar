import { useMemo, useState } from 'react';
import Calendar, { type CalendarView, type CellDisplayState } from '../../src';
import { monthEvents, overlapEvents, roomBookings, weekEvents } from '../data';
import {
  Controls,
  Field,
  Frame,
  useCalendarState,
  type Example,
} from './shared';

function Overview({ theme }: { theme: 'light' | 'dark' | 'auto' }) {
  const { view, setView, date, setDate } = useCalendarState('WEEK_TIME');
  const data = useMemo(() => monthEvents(), []);
  const [weekStartsOn, setWeekStartsOn] = useState(1);
  const [field, setField] = useState('startTime-endTime');
  const [hours, setHours] = useState('0-24');
  const [startHour, endHour] = hours.split('-').map(Number);
  const [clicked, setClicked] = useState('');

  return (
    <>
      <Controls>
        <Field label="weekStartsOn">
          <select
            value={weekStartsOn}
            onChange={(e) => setWeekStartsOn(Number(e.target.value))}
          >
            <option value={1}>Monday</option>
            <option value={0}>Sunday</option>
            <option value={6}>Saturday</option>
          </select>
        </Field>
        <Field label="activeTimeDateField">
          <select value={field} onChange={(e) => setField(e.target.value)}>
            <option>startTime-endTime</option>
            <option>startTime</option>
            <option>endTime</option>
          </select>
        </Field>
        <Field label="startHour – endHour">
          <select value={hours} onChange={(e) => setHours(e.target.value)}>
            <option value="0-24">0 – 24</option>
            <option value="7-20">7 – 20</option>
            <option value="9-17">9 – 17</option>
          </select>
        </Field>
        <span className="pg-muted">{clicked && `onItemClick: ${clicked}`}</span>
      </Controls>
      <Frame height={680}>
        <Calendar
          theme={theme}
          data={data}
          currentView={view}
          onViewChange={setView}
          currentDate={date}
          setCurrentDate={setDate}
          activeTimeDateField={field}
          weekStartsOn={weekStartsOn}
          startHour={startHour}
          endHour={endHour}
          dayMaxItems="auto"
          onItemClick={(item) => setClicked(item.title)}
          onDayNumberClick={(day) => {
            setDate(day);
            setView('DAY');
          }}
        />
      </Frame>
    </>
  );
}

function SingleView({
  theme,
  view,
  makeData,
  height = 640,
  extra,
}: {
  theme: 'light' | 'dark' | 'auto';
  view: CalendarView;
  makeData: () => ReturnType<typeof weekEvents>;
  height?: number;
  extra?: Partial<React.ComponentProps<typeof Calendar>>;
}) {
  const { date, setDate } = useCalendarState(view);
  const data = useMemo(makeData, [makeData]);
  return (
    <Frame height={height}>
      <Calendar
        theme={theme}
        data={data}
        currentView={view}
        currentDate={date}
        setCurrentDate={setDate}
        activeTimeDateField="startTime-endTime"
        {...extra}
      />
    </Frame>
  );
}

function MonthExample({ theme }: { theme: 'light' | 'dark' | 'auto' }) {
  const [mode, setMode] = useState<'3' | 'auto' | '6'>('auto');
  return (
    <>
      <Controls>
        <Field label="dayMaxItems">
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as typeof mode)}
          >
            <option value="auto">auto (fits the cell height)</option>
            <option value="3">3</option>
            <option value="6">6</option>
          </select>
        </Field>
        <span className="pg-muted">
          Click “+N more” for the full day. Multi-day bars stay in their own
          lanes.
        </span>
      </Controls>
      <SingleView
        theme={theme}
        view="MONTH"
        makeData={monthEvents}
        height={720}
        extra={{ dayMaxItems: mode === 'auto' ? 'auto' : Number(mode) }}
      />
    </>
  );
}

function InPlaceExample({ theme }: { theme: 'light' | 'dark' | 'auto' }) {
  const data = useMemo(() => weekEvents(), []);
  const { date, setDate } = useCalendarState();
  const [view, setView] = useState<CalendarView>('WEEK_IN_PLACE');
  const [state, setState] = useState<CellDisplayState>('CUSTOM');
  const [inactive, setInactive] = useState<string[]>([]);
  return (
    <>
      <Controls>
        <Field label="View">
          <select
            value={view}
            onChange={(e) => setView(e.target.value as CalendarView)}
          >
            <option>WEEK_IN_PLACE</option>
            <option>DAY_IN_PLACE</option>
            <option>MONTH</option>
            <option>WEEK</option>
          </select>
        </Field>
        <Field label="cellDisplayMode.state">
          <select
            value={state}
            onChange={(e) => setState(e.target.value as CellDisplayState)}
          >
            <option>ALL_EXPANDED</option>
            <option>ALL_COLLAPSED</option>
            <option>CUSTOM</option>
          </select>
        </Field>
        <span className="pg-muted">
          {state === 'CUSTOM'
            ? 'Click a cell to collapse it to its last item.'
            : ''}
        </span>
      </Controls>
      <Frame height={640}>
        <Calendar
          theme={theme}
          data={data}
          currentView={view}
          currentDate={date}
          setCurrentDate={setDate}
          activeTimeDateField="startTime-endTime"
          startHour={7}
          endHour={23}
          cellDisplayMode={{ [view]: { state, inactiveCells: inactive } }}
          onCellClick={({ timeDate }) =>
            setInactive((cells) =>
              cells.includes(timeDate)
                ? cells.filter((c) => c !== timeDate)
                : [...cells, timeDate],
            )
          }
        />
      </Frame>
    </>
  );
}

export const viewExamples: Example[] = [
  {
    id: 'overview',
    group: 'Views',
    title: 'Overview',
    description:
      'Every view with the built-in toolbar and view switcher. Switch views, the first day of the week, the date field and the visible hours.',
    Component: Overview,
  },
  {
    id: 'month',
    group: 'Views',
    title: 'Month',
    description:
      'Multi-day and all-day items are bars in lanes that never overlap; timed items are dots with their time. Busy days show “+N more”.',
    Component: MonthExample,
  },
  {
    id: 'week-time',
    group: 'Views',
    title: 'Week schedule',
    description:
      'An hour timeline like Google Calendar: overlapping items share the width and widen into free space, all-day and multi-day items sit on top, and the red line marks the current time.',
    Component: ({ theme }) => (
      <SingleView theme={theme} view="WEEK_TIME" makeData={weekEvents} />
    ),
  },
  {
    id: 'overlaps',
    group: 'Views',
    title: 'Overlapping items',
    description:
      'Two at once, a long item next to short ones, five in parallel, a staggered chain, nested items and very short ones.',
    Component: ({ theme }) => (
      <SingleView
        theme={theme}
        view="WEEK_TIME"
        makeData={overlapEvents}
        extra={{ scrollToHour: 8 }}
      />
    ),
  },
  {
    id: 'week',
    group: 'Views',
    title: 'Week',
    description: 'One week of day cells, like a row of the month.',
    Component: ({ theme }) => (
      <SingleView
        theme={theme}
        view="WEEK"
        makeData={weekEvents}
        height={420}
      />
    ),
  },
  {
    id: 'day',
    group: 'Views',
    title: 'Day, working hours',
    description:
      'The DAY view limited to 7:00–20:00 with startHour and endHour.',
    Component: ({ theme }) => (
      <SingleView
        theme={theme}
        view="DAY"
        makeData={weekEvents}
        extra={{ startHour: 7, endHour: 20 }}
      />
    ),
  },
  {
    id: 'day-reverse',
    group: 'Views',
    title: 'Day timeline',
    description:
      'DAY_REVERSE: hours run horizontally and overlapping items stack in lanes, good for rooms or resources.',
    Component: ({ theme }) => (
      <SingleView
        theme={theme}
        view="DAY_REVERSE"
        makeData={roomBookings}
        height={300}
        extra={{ startHour: 7, endHour: 20 }}
      />
    ),
  },
  {
    id: 'in-place',
    group: 'Views',
    title: 'In-place views and collapsing',
    description:
      'Items grouped by the hour they start in, and cellDisplayMode to collapse busy cells.',
    Component: InPlaceExample,
  },
];
