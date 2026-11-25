import {
  addDays,
  addMinutes,
  setHours,
  setMinutes,
  startOfMonth,
  startOfWeek,
} from 'date-fns';

export type Event = {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  bgColor?: string;
  textColor?: string;
  allDay?: boolean;
  location?: string;
  owner?: string;
};

export const COLORS = {
  blue: '#039be5',
  green: '#33b679',
  red: '#d50000',
  orange: '#f4511e',
  yellow: '#f6bf26',
  purple: '#8e24aa',
  teal: '#009688',
  grey: '#616161',
  pink: '#e67c73',
  indigo: '#3f51b5',
};

export const pad = (n: number) => String(n).padStart(2, '0');
export const dateKey = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const at = (day: Date, h: number, m = 0) => setMinutes(setHours(day, h), m);

let counter = 0;
const ev = (
  title: string,
  day: Date,
  [h1, m1]: [number, number],
  [h2, m2]: [number, number],
  extra: Partial<Event> = {},
): Event => ({
  id: `e${++counter}`,
  title,
  startTime: at(day, h1, m1).toISOString(),
  endTime: at(day, h2, m2).toISOString(),
  ...extra,
});

/** A realistic week around `reference`: standups, meetings, overlaps, all-day and multi-day items. */
export function weekEvents(reference = new Date()): Event[] {
  const mon = startOfWeek(reference, { weekStartsOn: 1 });
  const d = (n: number) => addDays(mon, n);
  return [
    ...[0, 1, 2, 3, 4].map((n) =>
      ev('Daily standup', d(n), [9, 0], [9, 15], {
        bgColor: COLORS.green,
        location: 'Zoom',
      }),
    ),
    {
      id: 'conf',
      title: 'React Summit',
      startTime: dateKey(d(0)),
      endTime: dateKey(d(2)),
      bgColor: COLORS.purple,
      location: 'Amsterdam',
    },
    {
      id: 'holiday',
      title: 'Team offsite',
      startTime: dateKey(d(4)),
      endTime: dateKey(d(4)),
      bgColor: COLORS.teal,
    },
    {
      id: 'trip',
      title: 'Trip to Berlin',
      startTime: dateKey(d(5)),
      endTime: dateKey(d(8)),
      bgColor: COLORS.orange,
    },
    ev('Design review', d(0), [10, 0], [11, 30], { location: 'Room Orion' }),
    ev('1:1 with Ana', d(0), [11, 0], [11, 30], { bgColor: COLORS.indigo }),
    ev('Lunch', d(0), [12, 30], [13, 30], { bgColor: COLORS.yellow }),
    ev('Sprint planning', d(1), [10, 0], [12, 0], { bgColor: COLORS.red }),
    ev('Interview: frontend', d(1), [10, 30], [11, 30], {
      bgColor: COLORS.pink,
    }),
    ev('Interview: backend', d(1), [11, 0], [12, 0], { bgColor: COLORS.pink }),
    ev('Coffee chat', d(1), [15, 0], [15, 20]),
    ev('Architecture sync', d(2), [13, 0], [14, 0]),
    ev('Pairing', d(2), [13, 0], [15, 30], { bgColor: COLORS.teal }),
    ev('Review PRs', d(2), [14, 0], [14, 45], { bgColor: COLORS.grey }),
    ev('Customer call', d(2), [16, 0], [17, 0], { bgColor: COLORS.orange }),
    ev('Release 3.0', d(3), [15, 0], [16, 0], { bgColor: COLORS.red }),
    ev('Retro', d(3), [16, 0], [17, 0]),
    ev('Night deploy', d(4), [22, 0], [23, 59], { bgColor: COLORS.indigo }),
    {
      id: 'deploy-2',
      title: 'Deploy monitoring',
      startTime: at(d(4), 23, 0).toISOString(),
      endTime: at(d(5), 2, 0).toISOString(),
      bgColor: COLORS.grey,
    },
    ev('Weekend run', d(5), [8, 0], [9, 30], { bgColor: COLORS.green }),
    ev('Brunch', d(6), [11, 0], [13, 0], { bgColor: COLORS.yellow }),
  ];
}

/** Many items over the month of `reference`, with some very busy days. */
export function monthEvents(reference = new Date()): Event[] {
  const first = startOfMonth(reference);
  const list: Event[] = [...weekEvents(reference)];
  const titles = [
    'Meeting',
    'Call',
    'Workshop',
    'Demo',
    'Focus time',
    'Dentist',
    'Gym',
    'Dinner',
  ];
  const colors = Object.values(COLORS);
  for (let i = 0; i < 34; i++) {
    const day = addDays(first, (i * 7) % 30);
    const hour = 8 + ((i * 5) % 10);
    list.push(
      ev(titles[i % titles.length], day, [hour, 0], [hour + 1, (i % 3) * 15], {
        bgColor: colors[i % colors.length],
      }),
    );
  }
  const busy = addDays(first, 13);
  for (let i = 0; i < 7; i++)
    list.push(ev(`Busy slot ${i + 1}`, busy, [8 + i, 0], [9 + i, 0]));
  list.push({
    id: 'sprint',
    title: 'Sprint 42',
    startTime: dateKey(addDays(first, 9)),
    endTime: dateKey(addDays(first, 22)),
    bgColor: COLORS.indigo,
  });
  return list;
}

/** Overlap patterns that show how the timeline packs items into columns. */
export function overlapEvents(reference = new Date()): Event[] {
  const mon = startOfWeek(reference, { weekStartsOn: 1 });
  const d = (n: number) => addDays(mon, n);
  const c = COLORS;
  return [
    // Monday: two overlapping
    ev('A', d(0), [9, 0], [10, 30], { bgColor: c.blue }),
    ev('B', d(0), [9, 30], [11, 0], { bgColor: c.green }),
    // Tuesday: one long, two short side by side, then the long one widens
    ev('Long', d(1), [9, 0], [13, 0], { bgColor: c.purple }),
    ev('Short 1', d(1), [9, 0], [10, 0], { bgColor: c.orange }),
    ev('Short 2', d(1), [10, 0], [11, 0], { bgColor: c.teal }),
    ev('Later', d(1), [11, 30], [12, 30], { bgColor: c.red }),
    // Wednesday: five at once
    ...[0, 1, 2, 3, 4].map((i) =>
      ev(`Parallel ${i + 1}`, d(2), [10, 0], [11 + (i % 2), 0], {
        bgColor: Object.values(c)[i],
      }),
    ),
    // Thursday: a chain of staggered items
    ...[0, 1, 2, 3, 4, 5].map((i) =>
      ev(
        `Step ${i + 1}`,
        d(3),
        [9 + Math.floor((i * 30) / 60), (i * 30) % 60],
        [10 + Math.floor((i * 30) / 60), (i * 30) % 60],
        {
          bgColor: Object.values(c)[(i + 3) % 10],
        },
      ),
    ),
    // Friday: nested
    ev('Outer', d(4), [9, 0], [15, 0], { bgColor: c.indigo }),
    ev('Middle', d(4), [10, 0], [13, 0], { bgColor: c.pink }),
    ev('Inner', d(4), [11, 0], [12, 0], { bgColor: c.yellow }),
    ev('Free afterwards', d(4), [13, 30], [14, 30], { bgColor: c.green }),
    // Saturday: very short items
    ...[0, 1, 2, 3].map((i) =>
      ev(`5 min #${i + 1}`, d(5), [10, i * 5], [10, i * 5 + 5], {
        bgColor: c.grey,
      }),
    ),
  ];
}

/** `count` random items over three months, for the performance example. */
export function manyEvents(count: number, reference = new Date()): Event[] {
  const start = addDays(startOfMonth(reference), -31);
  const colors = Object.values(COLORS);
  let seed = 42;
  const random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  return Array.from({ length: count }, (_, i) => {
    const s = addMinutes(start, Math.floor(random() * 92 * 24 * 4) * 15);
    return {
      id: `many-${i}`,
      title: `Item ${i + 1}`,
      startTime: s.toISOString(),
      endTime: addMinutes(s, 15 + Math.floor(random() * 8) * 15).toISOString(),
      bgColor: colors[i % colors.length],
    };
  });
}

/** Rooms booked over the day, for DAY_REVERSE. */
export function roomBookings(reference = new Date()): Event[] {
  const day = reference;
  return [
    ev('Orion · Standup', day, [9, 0], [9, 30], { bgColor: COLORS.green }),
    ev('Orion · Planning', day, [10, 0], [12, 0], { bgColor: COLORS.blue }),
    ev('Lyra · Interview', day, [10, 30], [11, 30], { bgColor: COLORS.pink }),
    ev('Vega · Workshop', day, [11, 0], [15, 0], { bgColor: COLORS.purple }),
    ev('Orion · Lunch & learn', day, [12, 30], [13, 30], {
      bgColor: COLORS.yellow,
    }),
    ev('Lyra · Customer demo', day, [14, 0], [15, 0], {
      bgColor: COLORS.orange,
    }),
    ev('Orion · Retro', day, [16, 0], [17, 0], { bgColor: COLORS.teal }),
  ];
}
