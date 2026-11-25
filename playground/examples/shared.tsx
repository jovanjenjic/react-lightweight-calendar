import { useState, type ReactNode } from 'react';
import type { CalendarTheme, CalendarView } from '../../src';
import { dateKey } from '../data';

export interface ExampleProps {
  theme: CalendarTheme;
}

export interface Example {
  id: string;
  group: string;
  title: string;
  description: ReactNode;
  Component: (props: ExampleProps) => ReactNode;
}

/** View and date state, as an app would keep it. */
export function useCalendarState(
  initialView: CalendarView = 'WEEK_TIME',
  initialDate = new Date(),
) {
  const [view, setView] = useState<CalendarView>(initialView);
  const [date, setDate] = useState<string | Date>(dateKey(initialDate));
  return { view, setView, date, setDate };
}

/** A fixed-height box, so the calendar fills it and its timeline scrolls. */
export function Frame({
  height = 640,
  children,
}: {
  height?: number | string;
  children: ReactNode;
}) {
  return (
    <div className="pg-frame" style={{ height }}>
      {children}
    </div>
  );
}

export function Controls({ children }: { children: ReactNode }) {
  return <div className="pg-controls">{children}</div>;
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="pg-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

export function Log({ entries }: { entries: string[] }) {
  return (
    <ol className="pg-log">
      {entries.length ? (
        entries.map((entry, i) => <li key={`${i}-${entry}`}>{entry}</li>)
      ) : (
        <li className="pg-muted">
          Interact with the calendar to see callbacks here.
        </li>
      )}
    </ol>
  );
}
