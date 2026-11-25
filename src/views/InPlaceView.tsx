import cn from 'classnames';
import { Fragment, useMemo, type CSSProperties } from 'react';
import { DayHeader } from '../components/DayHeader';
import { EventItem } from '../components/EventItem';
import { HourLabel } from '../components/HourLabel';
import { useCalendar } from '../context';
import {
  createDateInfo,
  toDateKey,
  toDateTimeKey,
  type ViewRange,
} from '../core/date';
import type { NormalizedItem } from '../core/items';
import { groupByStartHour } from '../core/layout';
import { useHours } from '../hooks/useHours';
import { useScrollToHour } from '../hooks/useScrollToHour';

/** WEEK_IN_PLACE and DAY_IN_PLACE: a cell per hour listing the items that start in it. */
export function InPlaceView({
  items,
  range,
}: {
  items: NormalizedItem[];
  range: ViewRange;
}) {
  const ctx = useCalendar();
  const { props, startHour, endHour } = ctx;
  const { days } = range;
  const hours = useHours(startHour, endHour);
  const groups = useMemo(() => groupByStartHour(items), [items]);
  const bodyRef = useScrollToHour(range);

  return (
    <div
      className="rlc-timegrid rlc-inplace"
      style={{ '--_days': days.length } as CSSProperties}
    >
      <div className="rlc-timegrid__head">
        <div className="rlc-timegrid__row rlc-timegrid__dayheads">
          <div className="rlc-timegrid__corner" />
          {days.map((day, i) => (
            <DayHeader key={toDateKey(day)} day={day} column={i} />
          ))}
        </div>
      </div>
      <div className="rlc-timegrid__body" ref={bodyRef}>
        <div className="rlc-inplace__grid">
          {hours.map((hour) => (
            <Fragment key={hour}>
              <div className="rlc-inplace__hour" data-rlc-hour={hour}>
                <HourLabel
                  hour={hour}
                  day={days.length === 1 ? days[0] : undefined}
                />
              </div>
              {days.map((day, i) => {
                const start = new Date(
                  day.getFullYear(),
                  day.getMonth(),
                  day.getDate(),
                  hour,
                );
                const key = toDateTimeKey(start);
                const list = groups.get(key) ?? [];
                const collapsed = ctx.collapsedCells.has(key);
                const shown = collapsed ? list.slice(-1) : list;
                return (
                  <div
                    key={key}
                    className={cn(
                      'rlc-inplace__cell',
                      toDateKey(day) === ctx.todayKey &&
                        'rlc-inplace__cell--today',
                      collapsed && 'rlc-inplace__cell--collapsed',
                    )}
                    style={{ gridColumn: i + 2 }}
                    onClick={(event) =>
                      props.onCellClick?.(
                        createDateInfo(day, { hour, today: ctx.now }),
                        event,
                      )
                    }
                  >
                    {shown.map((n) => (
                      <EventItem
                        key={n.key}
                        n={n}
                        variant="chip"
                        isAllDay={n.isAllDay}
                      />
                    ))}
                  </div>
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
