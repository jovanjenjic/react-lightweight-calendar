import { describe, expect, it } from 'vitest';
import { formatItemTime } from './format';
import {
  createDateInfo,
  getTitle,
  normalizeHours,
  getViewRange,
  minutesFrom,
  shiftDate,
  toDate,
  toDateKey,
} from './date';
import {
  belongsToAllDayRow,
  lastDayOf,
  normalizeItems,
  parseActiveField,
} from './items';
import {
  getCollapsedCells,
  groupByStartHour,
  layoutDayRow,
  layoutHorizontal,
  layoutTimeGrid,
} from './layout';

const local = (y: number, m: number, d: number, h = 0, min = 0) =>
  new Date(y, m - 1, d, h, min);
const iso = (y: number, m: number, d: number, h = 0, min = 0) =>
  local(y, m, d, h, min).toISOString();
const keys = (dates: Date[]) => dates.map(toDateKey);

describe('toDate', () => {
  it('reads date-only strings as local midnight, not UTC', () => {
    // Runs in America/New_York (see the test script): new Date('2025-06-02') would be June 1.
    expect(toDateKey(toDate('2025-06-02')!)).toBe('2025-06-02');
    expect(toDate('2025-06-02')!.getHours()).toBe(0);
  });
  it('rejects invalid values', () => {
    expect(toDate('not a date')).toBeNull();
    expect(toDate(undefined)).toBeNull();
    expect(toDate('')).toBeNull();
    expect(toDate(new Date('x'))).toBeNull();
  });
  it('copies Date objects', () => {
    const date = local(2025, 6, 2);
    expect(toDate(date)).not.toBe(date);
    expect(toDate(date)!.getTime()).toBe(date.getTime());
  });
});

describe('getViewRange', () => {
  it('covers whole weeks around the month', () => {
    const range = getViewRange('MONTH', local(2025, 6, 15), 1);
    expect(toDateKey(range.start)).toBe('2025-05-26');
    expect(toDateKey(range.end)).toBe('2025-07-06');
    expect(range.days).toHaveLength(42);
  });
  it('respects weekStartsOn for weeks', () => {
    expect(keys(getViewRange('WEEK_TIME', local(2025, 6, 4), 0).days)[0]).toBe(
      '2025-06-01',
    );
    expect(keys(getViewRange('WEEK', local(2025, 6, 4), 1).days)[0]).toBe(
      '2025-06-02',
    );
    expect(
      getViewRange('WEEK_IN_PLACE', local(2025, 6, 4), 6).days,
    ).toHaveLength(7);
  });
  it('shows one day in day views', () => {
    for (const view of ['DAY', 'DAY_REVERSE', 'DAY_IN_PLACE'] as const) {
      expect(keys(getViewRange(view, local(2025, 6, 4, 15), 1).days)).toEqual([
        '2025-06-04',
      ]);
    }
  });
});

describe('shiftDate and getTitle', () => {
  it('moves by the view period', () => {
    expect(toDateKey(shiftDate('MONTH', local(2025, 1, 31), 1))).toBe(
      '2025-02-28',
    );
    expect(toDateKey(shiftDate('WEEK_TIME', local(2025, 6, 4), -1))).toBe(
      '2025-05-28',
    );
    expect(toDateKey(shiftDate('DAY', local(2025, 6, 4), 1))).toBe(
      '2025-06-05',
    );
  });
  it('formats titles per view', () => {
    const june = local(2025, 6, 4);
    expect(
      getTitle('MONTH', june, getViewRange('MONTH', june, 1), undefined),
    ).toBe('June 2025');
    const edge = local(2025, 7, 1);
    expect(
      getTitle('WEEK', edge, getViewRange('WEEK', edge, 1), undefined),
    ).toBe('Jun 30 – Jul 6, 2025');
    expect(
      getTitle(
        'MONTH',
        june,
        getViewRange('MONTH', june, 1),
        undefined,
        'yyyy',
      ),
    ).toBe('2025');
  });
});

describe('createDateInfo', () => {
  it('uses local keys and local midnight', () => {
    const info = createDateInfo(local(2025, 6, 2), {
      today: local(2025, 6, 2),
      currentMonth: 5,
    });
    expect(info).toMatchObject({
      date: '2025-06-02',
      timeDate: '2025-06-02',
      isCurrentDay: true,
      isCurrentMonth: true,
      day: 2,
      month: 5,
      year: 2025,
    });
    expect(new Date(info.timeDateUTC).getTime()).toBe(
      local(2025, 6, 2).getTime(),
    );
    expect(info).not.toHaveProperty('hour');
  });
  it('adds the hour for hour cells', () => {
    const info = createDateInfo(local(2025, 6, 2), {
      hour: 14,
      today: local(2025, 1, 1),
    });
    expect(info.timeDate).toBe('2025-06-02 14:00:00');
    expect(info.hour).toBe(14);
    expect(info.isCurrentDay).toBe(false);
  });
});

describe('normalizeItems', () => {
  it('never mutates the input and keeps a stable order', () => {
    const data = [
      { id: 'b', start: iso(2025, 6, 3, 9) },
      { id: 'a', start: iso(2025, 6, 2, 9) },
    ];
    const copy = JSON.parse(JSON.stringify(data));
    const items = normalizeItems(Object.freeze(data), 'start');
    expect(data).toEqual(copy);
    expect(items.map((n) => n.item.id)).toEqual(['a', 'b']);
  });
  it('skips invalid items and fixes reversed ranges', () => {
    const items = normalizeItems(
      [
        { id: 1, s: 'nope', e: iso(2025, 6, 2) },
        { id: 2, s: iso(2025, 6, 2, 10), e: iso(2025, 6, 2, 9) },
        { id: 3 },
      ],
      's-e',
    );
    expect(items).toHaveLength(1);
    expect(items[0].end.getTime()).toBe(items[0].start.getTime());
  });
  it('gives unique keys for missing, zero and duplicate ids', () => {
    const items = normalizeItems(
      [
        { id: 0, s: iso(2025, 6, 2) },
        { id: 0, s: iso(2025, 6, 2) },
        { s: iso(2025, 6, 2) },
      ],
      's',
    );
    expect(new Set(items.map((n) => n.key)).size).toBe(3);
  });
  it('treats date-only values and allDay as whole days, end inclusive', () => {
    const [n] = normalizeItems(
      [{ id: 1, s: '2025-06-02', e: '2025-06-04' }],
      's-e',
    );
    expect(n.isAllDay).toBe(true);
    expect(toDateKey(lastDayOf(n))).toBe('2025-06-04');
    expect(belongsToAllDayRow(n)).toBe(true);
    const [flagged] = normalizeItems(
      [{ id: 1, s: iso(2025, 6, 2, 10), allDay: true }],
      's',
    );
    expect(flagged.isAllDay).toBe(true);
  });
  it('does not put an item ending at midnight on the next day', () => {
    const [n] = normalizeItems(
      [{ id: 1, s: iso(2025, 6, 2, 20), e: iso(2025, 6, 3, 0) }],
      's-e',
    );
    expect(toDateKey(lastDayOf(n))).toBe('2025-06-02');
  });
  it('parses the active field', () => {
    expect(parseActiveField('startTime-endTime')).toEqual([
      'startTime',
      'endTime',
    ]);
    expect(parseActiveField(' createdAt ')).toEqual(['createdAt', 'createdAt']);
  });
});

describe('layoutTimeGrid', () => {
  const day = local(2025, 6, 2);
  const at = (id: string, h1: number, m1: number, h2: number, m2: number) => ({
    id,
    s: iso(2025, 6, 2, h1, m1),
    e: iso(2025, 6, 2, h2, m2),
  });
  const layout = (data: Record<string, unknown>[]) =>
    Object.fromEntries(
      layoutTimeGrid(normalizeItems(data, 's-e'), day).map((s) => [
        s.n.item.id,
        s,
      ]),
    );

  it('gives a lone item the full width', () => {
    const { a } = layout([at('a', 9, 0, 10, 0)]);
    expect(a).toMatchObject({
      top: 540,
      height: 60,
      column: 0,
      columns: 1,
      span: 1,
    });
  });
  it('places overlapping items side by side', () => {
    const { a, b } = layout([at('a', 9, 0, 10, 0), at('b', 9, 30, 10, 30)]);
    expect([a.column, b.column, a.columns, b.columns]).toEqual([0, 1, 2, 2]);
    // a reaches under b (Google-style cascade), b ends at the right edge.
    expect(a).toMatchObject({ left: 0, width: 0.85 });
    expect(b).toMatchObject({ left: 0.5, width: 0.5 });
  });
  it('can turn the overlap off', () => {
    const [a] = layoutTimeGrid(
      normalizeItems([at('a', 9, 0, 10, 0), at('b', 9, 30, 10, 30)], 's-e'),
      day,
      { overlap: false },
    );
    expect(a).toMatchObject({ left: 0, width: 0.5 });
  });
  it('widens items into free columns, like Google Calendar', () => {
    // a overlaps b and c, b and c do not overlap: two columns, d is alone later on.
    const { a, b, c, d } = layout([
      at('a', 9, 0, 11, 0),
      at('b', 9, 0, 10, 0),
      at('c', 10, 0, 11, 0),
      at('d', 12, 0, 13, 0),
    ]);
    expect(a.columns).toBe(2);
    expect(b.column).toBe(1);
    expect(c.column).toBe(1);
    expect(d).toMatchObject({ column: 0, columns: 1, span: 1 });
    const { x, y, z } = layout([
      at('x', 9, 0, 12, 0),
      at('y', 9, 0, 10, 0),
      at('z', 9, 0, 10, 0),
    ]);
    expect([x.columns, y.span, z.span]).toEqual([3, 1, 1]);
    const { p, q, r } = layout([
      at('p', 9, 0, 10, 0),
      at('q', 9, 0, 12, 0),
      at('r', 11, 0, 12, 0),
    ]);
    // q is longest so it takes column 0; p sits in column 1; r reuses column 1 later.
    expect([q.column, p.column, r.column, r.span]).toEqual([0, 1, 1, 1]);
  });
  it('splits items crossing midnight between the two days', () => {
    const items = normalizeItems(
      [{ id: 'n', s: iso(2025, 6, 2, 22), e: iso(2025, 6, 3, 2) }],
      's-e',
    );
    const [today] = layoutTimeGrid(items, day);
    const [tomorrow] = layoutTimeGrid(items, local(2025, 6, 3));
    expect(today).toMatchObject({
      top: 22 * 60,
      height: 120,
      continuesAfter: true,
    });
    expect(tomorrow).toMatchObject({
      top: 0,
      height: 120,
      continuesBefore: true,
    });
  });
  it('clips to startHour and endHour and keeps short items readable', () => {
    const items = normalizeItems(
      [
        at('early', 6, 0, 9, 0),
        at('short', 12, 0, 12, 5),
        at('late', 21, 0, 22, 0),
      ],
      's-e',
    );
    const segments = layoutTimeGrid(items, day, { startHour: 8, endHour: 20 });
    const byId = Object.fromEntries(segments.map((s) => [s.n.item.id, s]));
    expect(byId.early).toMatchObject({
      top: 0,
      height: 60,
      continuesBefore: true,
    });
    expect(byId.short.height).toBe(20);
    expect(byId.late).toBeUndefined();
  });
});

describe('layoutDayRow', () => {
  const week = getViewRange('WEEK', local(2025, 6, 4), 1).days; // Mon 2 – Sun 8
  const all = (id: string, from: string, to: string) => ({
    id,
    s: from,
    e: to,
  });

  it('stacks overlapping bars in lanes and puts bars before timed items', () => {
    const items = normalizeItems(
      [
        { id: 'timed', s: iso(2025, 6, 3, 9), e: iso(2025, 6, 3, 10) },
        all('long', '2025-06-02', '2025-06-05'),
        all('short', '2025-06-03', '2025-06-04'),
      ],
      's-e',
    );
    const { segments, laneCount } = layoutDayRow(items, week);
    const byId = Object.fromEntries(segments.map((s) => [s.n.item.id, s]));
    expect(byId.long).toMatchObject({
      startCol: 0,
      span: 4,
      lane: 0,
      isBar: true,
    });
    expect(byId.short).toMatchObject({ startCol: 1, span: 2, lane: 1 });
    expect(byId.timed).toMatchObject({
      startCol: 1,
      span: 1,
      lane: 2,
      isBar: false,
    });
    expect(laneCount).toBe(3);
  });
  it('clips bars to the row and marks continuation', () => {
    const items = normalizeItems([all('x', '2025-05-30', '2025-06-03')], 's-e');
    const [segment] = layoutDayRow(items, week).segments;
    expect(segment).toMatchObject({
      startCol: 0,
      span: 2,
      continuesBefore: true,
      continuesAfter: false,
    });
  });
  it('counts items beyond maxLanes as hidden per day', () => {
    const items = normalizeItems(
      [1, 2, 3, 4].map((i) => ({
        id: i,
        s: iso(2025, 6, 4, 8 + i),
        e: iso(2025, 6, 4, 9 + i),
      })),
      's-e',
    );
    const layout = layoutDayRow(items, week, { maxLanes: 2 });
    expect(layout.segments).toHaveLength(2);
    expect(layout.hidden[2]).toHaveLength(2);
    expect(layout.itemsByDay[2]).toHaveLength(4);
  });
  it('shows only the last item on collapsed days and splits bars around them', () => {
    const items = normalizeItems(
      [
        all('bar', '2025-06-02', '2025-06-05'),
        { id: 'late', s: iso(2025, 6, 3, 18) },
      ],
      's-e',
    );
    const { segments } = layoutDayRow(items, week, {
      collapsedDays: new Set(['2025-06-03']),
    });
    const bars = segments.filter((s) => s.n.item.id === 'bar');
    expect(bars.map((s) => [s.startCol, s.span])).toEqual(
      expect.arrayContaining([
        [0, 1],
        [2, 2],
      ]),
    );
    const onCollapsed = segments.filter((s) => s.startCol === 1);
    expect(onCollapsed).toHaveLength(1);
    expect(onCollapsed[0].n.item.id).toBe('late');
  });
});

describe('layoutHorizontal and groupByStartHour', () => {
  it('puts overlapping items in separate lanes', () => {
    const items = normalizeItems(
      [
        { id: 'a', s: iso(2025, 6, 2, 9), e: iso(2025, 6, 2, 11) },
        { id: 'b', s: iso(2025, 6, 2, 10), e: iso(2025, 6, 2, 12) },
        { id: 'c', s: iso(2025, 6, 2, 11), e: iso(2025, 6, 2, 12) },
      ],
      's-e',
    );
    const { segments, laneCount } = layoutHorizontal(items, local(2025, 6, 2));
    const lane = Object.fromEntries(segments.map((s) => [s.n.item.id, s.lane]));
    expect(lane).toEqual({ a: 0, b: 1, c: 0 });
    expect(laneCount).toBe(2);
  });
  it('groups items by their start hour', () => {
    const items = normalizeItems(
      [
        { id: 1, s: iso(2025, 6, 2, 9, 10) },
        { id: 2, s: iso(2025, 6, 2, 9, 50) },
        { id: 3, s: iso(2025, 6, 2, 10, 0) },
      ],
      's',
    );
    const groups = groupByStartHour(items);
    expect(groups.get('2025-06-02 09:00:00')?.map((n) => n.item.id)).toEqual([
      1, 2,
    ]);
    expect(groups.get('2025-06-02 10:00:00')).toHaveLength(1);
  });
});

describe('minutesFrom', () => {
  it('counts wall-clock minutes, also on later days', () => {
    expect(minutesFrom(local(2025, 6, 2), local(2025, 6, 2, 9, 30))).toBe(570);
    expect(minutesFrom(local(2025, 6, 2), local(2025, 6, 3, 1))).toBe(1500);
  });
  it('keeps hours aligned on a daylight saving day', () => {
    // 2025-03-09 is the spring-forward day in New York.
    expect(minutesFrom(local(2025, 3, 9), local(2025, 3, 9, 10))).toBe(600);
  });
});

describe('fixes from the code review', () => {
  const week = getViewRange('WEEK', local(2025, 6, 4), 1).days; // Mon 2 – Sun 8

  it('keeps an overflowing bar visible on days that have room', () => {
    // Two bars fill both lanes on Mon–Tue; the long bar starts on Tuesday.
    const items = normalizeItems(
      [
        { id: 'x', s: '2025-06-02', e: '2025-06-03' },
        { id: 'y', s: '2025-06-02', e: '2025-06-03' },
        { id: 'long', s: '2025-06-03', e: '2025-06-07' },
      ],
      's-e',
    );
    const { segments, hidden } = layoutDayRow(items, week, { maxLanes: 2 });
    const long = segments.filter((seg) => seg.n.item.id === 'long');
    expect(long).toHaveLength(1);
    expect(long[0]).toMatchObject({
      startCol: 2,
      span: 4,
      lane: 0,
      continuesBefore: true,
      continuesAfter: false,
    });
    expect(hidden[1].map((n) => n.item.id)).toEqual(['long']);
    expect(hidden[2]).toHaveLength(0);
  });

  it('treats a timed midnight end of an all-day item as exclusive', () => {
    const [n] = normalizeItems(
      [{ id: 1, s: iso(2025, 6, 4), e: iso(2025, 6, 5), allDay: true }],
      's-e',
    );
    expect([n.firstKey, n.lastKey]).toEqual(['2025-06-04', '2025-06-04']);
    const [dateOnly] = normalizeItems(
      [{ id: 2, s: '2025-06-04', e: '2025-06-05', allDay: true }],
      's-e',
    );
    expect(dateOnly.lastKey).toBe('2025-06-05');
  });

  it('keeps visible hours within one day', () => {
    expect(normalizeHours(24, undefined)).toEqual({
      startHour: 23,
      endHour: 24,
    });
    expect(normalizeHours(9, 9)).toEqual({ startHour: 9, endHour: 10 });
    expect(normalizeHours(-3, 40)).toEqual({ startHour: 0, endHour: 24 });
    expect(normalizeHours(undefined, undefined)).toEqual({
      startHour: 0,
      endHour: 24,
    });
  });

  it('formats the time range and the start separately', () => {
    const [n] = normalizeItems(
      [{ id: 1, s: iso(2025, 6, 4, 9), e: iso(2025, 6, 4, 10, 30) }],
      's-e',
    );
    expect(formatItemTime(n, 'HH:mm')).toEqual({
      timeLabel: '09:00 – 10:30',
      startTimeLabel: '09:00',
    });
    const [allDay] = normalizeItems([{ id: 2, s: '2025-06-04' }], 's');
    expect(formatItemTime(allDay, 'HH:mm').timeLabel).toBe('');
  });

  it('rejects dates that do not exist instead of rolling them over', () => {
    expect(toDate('2025-02-31')).toBeNull();
    expect(toDate('2025-13-01')).toBeNull();
    expect(toDate('2024-02-29')).toEqual(local(2024, 2, 29));
  });

  it('treats null hours as not set', () => {
    expect(normalizeHours(null, null)).toEqual({ startHour: 0, endHour: 24 });
  });

  it('reads a date-only start with a null end as a whole day', () => {
    const [n] = normalizeItems([{ id: 1, s: '2025-06-04', e: null }], 's-e');
    expect(n.isAllDay).toBe(true);
    expect(keys([n.start, n.end])).toEqual(['2025-06-04', '2025-06-05']);
  });

  it('collapses cells only for known states', () => {
    const days = [local(2025, 6, 4)];
    const collapsed = (state: string) =>
      getCollapsedCells(
        { MONTH: { state: state as 'CUSTOM', inactiveCells: ['2025-06-04'] } },
        'MONTH',
        days,
      );
    expect(collapsed('ALL_COLLAPSED').has('2025-06-04')).toBe(true);
    expect(collapsed('ALL_COLLAPSED').has('2025-06-04 09:00:00')).toBe(true);
    expect([...collapsed('CUSTOM')]).toEqual(['2025-06-04']);
    expect(collapsed('ALL_EXPANDED').size).toBe(0);
    expect(collapsed('typo').size).toBe(0);
    expect(getCollapsedCells(undefined, 'MONTH', days).size).toBe(0);
  });
});
