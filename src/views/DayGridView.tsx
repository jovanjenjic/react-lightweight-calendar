import cn from 'classnames';
import { addDays, format, startOfWeek } from 'date-fns';
import { useMemo, useRef, type MouseEvent } from 'react';
import { DayNumber } from '../components/DayNumber';
import { EventItem } from '../components/EventItem';
import { WeekdayLabel } from '../components/WeekdayLabel';
import { DEFAULT_DAY_MAX_ITEMS } from '../constants';
import { useCalendar } from '../context';
import { createDateInfo, toDateKey, type ViewRange } from '../core/date';
import type { NormalizedItem } from '../core/items';
import { layoutDayRow } from '../core/layout';
import { useAutoRows } from '../hooks/useAutoRows';

interface ViewProps {
  items: NormalizedItem[];
  range: ViewRange;
}

/** MONTH and WEEK: rows of day cells, items in lanes, "+N more" on busy days. */
export function DayGridView({ items, range }: ViewProps) {
  const { view, props } = useCalendar();
  const isMonth = view === 'MONTH';
  const weeks = useMemo(() => {
    const result: Date[][] = [];
    for (let i = 0; i < range.days.length; i += 7) {
      result.push(range.days.slice(i, i + 7));
    }
    return result;
  }, [range]);

  // Only MONTH limits the rows; WEEK shows every item.
  const weeksRef = useRef<HTMLDivElement>(null);
  const setting = isMonth
    ? (props.dayMaxItems ?? DEFAULT_DAY_MAX_ITEMS)
    : Infinity;
  const autoRows = useAutoRows(setting === 'auto', weeksRef, weeks.length);
  const maxRows =
    setting === 'auto'
      ? (autoRows ?? DEFAULT_DAY_MAX_ITEMS)
      : Math.max(1, setting);

  return (
    <div
      className={cn(
        'rlc-daygrid',
        isMonth ? 'rlc-daygrid--month' : 'rlc-daygrid--week',
      )}
      role="grid"
    >
      <div className="rlc-daygrid__weekdays" role="row">
        {weeks[0].map((day, column) => (
          <WeekdayHeader key={column} day={day} column={column} />
        ))}
      </div>
      <div className="rlc-daygrid__weeks" ref={weeksRef}>
        {weeks.map((week) => (
          <WeekRow
            key={toDateKey(week[0])}
            days={week}
            items={items}
            maxRows={maxRows}
          />
        ))}
      </div>
    </div>
  );
}

function WeekdayHeader({ day, column }: { day: Date; column: number }) {
  const { props, currentDate, weekStartsOn } = useCalendar();
  const onClick = (event: MouseEvent<HTMLElement>) => {
    // The weekday in the week of `currentDate`, as in 1.x and 2.x.
    const date = addDays(startOfWeek(currentDate, { weekStartsOn }), column);
    props.onDayStringClick?.(toDateKey(date), event);
  };
  return (
    <div className="rlc-weekday" role="columnheader">
      <button
        type="button"
        className="rlc-btn rlc-weekday__button"
        onClick={onClick}
      >
        <WeekdayLabel day={day} />
      </button>
    </div>
  );
}

function WeekRow({
  days,
  items,
  maxRows,
}: {
  days: Date[];
  items: NormalizedItem[];
  maxRows: number;
}) {
  const ctx = useCalendar();
  const { props, view, labels } = ctx;
  const isMonth = view === 'MONTH';
  const month = ctx.currentDate.getMonth();

  const layout = useMemo(() => {
    const options = { collapsedDays: ctx.collapsedCells };
    const full = layoutDayRow(items, days, { ...options, maxLanes: maxRows });
    if (maxRows === Infinity || !full.hidden.some((h) => h.length)) return full;
    // Something is hidden: free the last row for "+N more".
    return layoutDayRow(items, days, {
      ...options,
      maxLanes: Math.max(maxRows - 1, 0),
    });
  }, [items, days, maxRows, ctx.collapsedCells]);

  const hasMore = layout.hidden.some((h) => h.length);
  const rowCount = layout.laneCount + (hasMore ? 1 : 0);
  const dateInfo = (day: Date) =>
    createDateInfo(day, { today: ctx.now, currentMonth: month });

  const onMoreClick = (column: number) => (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    const day = days[column];
    if (props.onMoreClick) {
      props.onMoreClick(
        day,
        layout.itemsByDay[column].map((n) => n.item),
        event,
      );
    } else {
      ctx.openMore(day, event.currentTarget);
    }
  };

  return (
    <div className="rlc-week" role="row">
      {/* Background cells: clicks, today and collapsed shading, custom content. */}
      <div className="rlc-week__cells">
        {days.map((day, column) => {
          const key = toDateKey(day);
          const isCurrentMonth = !isMonth || day.getMonth() === month;
          return (
            <div
              key={key}
              role="gridcell"
              aria-label={format(day, 'PPPP', { locale: ctx.locale })}
              className={cn(
                'rlc-cell',
                !isCurrentMonth && 'rlc-cell--other-month',
                key === ctx.todayKey && 'rlc-cell--today',
                ctx.collapsedCells.has(key) && 'rlc-cell--collapsed',
              )}
              onClick={(event) => props.onCellClick?.(dateInfo(day), event)}
            >
              {props.renderCellContent && (
                <div className="rlc-cell__content">
                  {props.renderCellContent({
                    date: day,
                    dateInfo: dateInfo(day),
                    items: layout.itemsByDay[column].map((n) => n.item),
                    isToday: key === ctx.todayKey,
                    isCurrentMonth,
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Foreground grid: day numbers, items in lanes, "+N more". */}
      <div
        className="rlc-week__content"
        style={{
          gridTemplateRows: `auto repeat(${rowCount}, var(--_lane-height))`,
        }}
      >
        {days.map((day, column) => {
          const isCurrentMonth = !isMonth || day.getMonth() === month;
          return (
            <div
              key={toDateKey(day)}
              className={cn(
                'rlc-week__head',
                !isCurrentMonth && 'rlc-week__head--other-month',
              )}
              style={{ gridColumn: column + 1, gridRow: 1 }}
            >
              <DayNumber day={day} isCurrentMonth={isCurrentMonth} />
            </div>
          );
        })}
        {layout.segments.map((s) => (
          <EventItem
            key={`${s.n.key}@${s.startCol}`}
            n={s.n}
            variant={s.isBar ? 'bar' : 'dot'}
            isAllDay={s.n.isAllDay}
            continuesBefore={s.continuesBefore}
            continuesAfter={s.continuesAfter}
            style={{
              gridColumn: `${s.startCol + 1} / span ${s.span}`,
              gridRow: s.lane + 2,
            }}
          />
        ))}
        {layout.hidden.map((hidden, column) =>
          hidden.length ? (
            <button
              key={column}
              type="button"
              className="rlc-btn rlc-more"
              style={{ gridColumn: column + 1, gridRow: rowCount + 1 }}
              onClick={onMoreClick(column)}
            >
              {props.renderMoreLink
                ? props.renderMoreLink({
                    count: hidden.length,
                    date: days[column],
                    items: layout.itemsByDay[column].map((n) => n.item),
                  })
                : labels.more(hidden.length)}
            </button>
          ) : null,
        )}
      </div>
    </div>
  );
}
