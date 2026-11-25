import cn from 'classnames';
import { useMemo, type CSSProperties, type MouseEvent } from 'react';
import { DayHeader } from '../components/DayHeader';
import { EventItem } from '../components/EventItem';
import { HourLabel } from '../components/HourLabel';
import { COMPACT_ITEM_MINUTES } from '../constants';
import { useCalendar } from '../context';
import { createDateInfo, toDateKey, type ViewRange } from '../core/date';
import { belongsToAllDayRow, type NormalizedItem } from '../core/items';
import { layoutDayRow, layoutTimeGrid } from '../core/layout';
import { useHours } from '../hooks/useHours';
import { useScrollToHour } from '../hooks/useScrollToHour';

/** WEEK_TIME and DAY: an hour timeline with an all-day row on top. */
export function TimeGridView({
  items,
  range,
}: {
  items: NormalizedItem[];
  range: ViewRange;
}) {
  const ctx = useCalendar();
  const { props, labels, startHour, endHour } = ctx;
  const { days } = range;
  const hours = useHours(startHour, endHour);

  const allDay = useMemo(
    () => layoutDayRow(items.filter(belongsToAllDayRow), days),
    [items, days],
  );
  const columns = useMemo(() => {
    const timed = items.filter((n) => !belongsToAllDayRow(n));
    return days.map((day) =>
      layoutTimeGrid(timed, day, { startHour, endHour }),
    );
  }, [items, days, startHour, endHour]);

  const bodyRef = useScrollToHour(range);
  const nowMinutes =
    ctx.now.getHours() * 60 + ctx.now.getMinutes() - startHour * 60;
  const showNow = nowMinutes >= 0 && nowMinutes < (endHour - startHour) * 60;

  const onSlotClick =
    (day: Date, hour: number) => (event: MouseEvent<HTMLElement>) =>
      props.onCellClick?.(createDateInfo(day, { hour, today: ctx.now }), event);

  return (
    <div
      className="rlc-timegrid"
      style={{ '--_days': days.length } as CSSProperties}
    >
      <div className="rlc-timegrid__head">
        <div className="rlc-timegrid__row rlc-timegrid__dayheads">
          <div className="rlc-timegrid__corner" />
          {days.map((day, i) => (
            <DayHeader key={toDateKey(day)} day={day} column={i} />
          ))}
        </div>
        <div
          className="rlc-timegrid__row rlc-timegrid__allday"
          style={{
            gridTemplateRows: `repeat(${Math.max(allDay.laneCount, 1)}, var(--_lane-height))`,
          }}
        >
          <div
            className="rlc-timegrid__allday-label"
            style={{ gridRow: '1 / -1' }}
          >
            {labels.allDay}
          </div>
          {days.map((day, i) => (
            <div
              key={toDateKey(day)}
              className="rlc-timegrid__allday-cell"
              style={{ gridColumn: i + 2, gridRow: '1 / -1' }}
              onClick={(event) =>
                props.onCellHeaderClick?.(
                  createDateInfo(day, { hour: 0, today: ctx.now }),
                  event,
                )
              }
            />
          ))}
          {allDay.segments.map((s) => {
            const gridColumn = `${s.startCol + 2} / span ${s.span}`;
            return (
              <EventItem
                key={`${s.n.key}@${s.startCol}`}
                n={s.n}
                variant="bar"
                isAllDay
                continuesBefore={s.continuesBefore}
                continuesAfter={s.continuesAfter}
                header={{ gridColumn }}
                style={{ gridColumn, gridRow: s.lane + 1 }}
              />
            );
          })}
        </div>
      </div>

      <div className="rlc-timegrid__body" ref={bodyRef}>
        <div
          className="rlc-timegrid__grid"
          style={{ '--_hours': hours.length } as CSSProperties}
        >
          <div className="rlc-timegrid__gutter">
            {hours.map((hour) => (
              <div
                key={hour}
                className="rlc-timegrid__gutter-cell"
                data-rlc-hour={hour}
              >
                <HourLabel
                  hour={hour}
                  day={days.length === 1 ? days[0] : undefined}
                />
              </div>
            ))}
          </div>
          {days.map((day, i) => {
            const isToday = toDateKey(day) === ctx.todayKey;
            return (
              <div
                key={toDateKey(day)}
                className={cn(
                  'rlc-timegrid__col',
                  isToday && 'rlc-timegrid__col--today',
                )}
                style={{ gridColumn: i + 2 }}
              >
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="rlc-slot"
                    onClick={onSlotClick(day, hour)}
                  />
                ))}
                <div className="rlc-timegrid__events">
                  {columns[i].map((s) => (
                    <EventItem
                      key={s.n.key}
                      n={s.n}
                      variant="timed"
                      continuesBefore={s.continuesBefore}
                      continuesAfter={s.continuesAfter}
                      isCompact={s.height < COMPACT_ITEM_MINUTES}
                      style={
                        {
                          '--_top': s.top,
                          '--_height': s.height,
                          '--_left': s.left,
                          '--_width': s.width,
                          zIndex: s.column + 1,
                        } as CSSProperties
                      }
                    />
                  ))}
                </div>
                {isToday && showNow && (
                  <div
                    className="rlc-now"
                    style={{ '--_top': nowMinutes } as CSSProperties}
                    aria-hidden="true"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
