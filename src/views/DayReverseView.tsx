import { useMemo, type CSSProperties, type MouseEvent } from 'react';
import { DayHeader } from '../components/DayHeader';
import { EventItem } from '../components/EventItem';
import { HourLabel } from '../components/HourLabel';
import { useCalendar } from '../context';
import { createDateInfo, toDateKey, type ViewRange } from '../core/date';
import type { NormalizedItem } from '../core/items';
import { layoutHorizontal } from '../core/layout';
import { useHours } from '../hooks/useHours';
import { useScrollToHour } from '../hooks/useScrollToHour';

/** DAY_REVERSE: one day on a horizontal hour axis, items in lanes. */
export function DayReverseView({
  items,
  range,
}: {
  items: NormalizedItem[];
  range: ViewRange;
}) {
  const ctx = useCalendar();
  const { props, startHour, endHour } = ctx;
  const day = range.days[0];
  const hours = useHours(startHour, endHour);
  const total = hours.length * 60;
  const { segments, laneCount } = useMemo(
    () => layoutHorizontal(items, day, { startHour, endHour }),
    [items, day, startHour, endHour],
  );
  const scrollRef = useScrollToHour(range, 'x');
  const isToday = toDateKey(day) === ctx.todayKey;
  const nowMinutes =
    ctx.now.getHours() * 60 + ctx.now.getMinutes() - startHour * 60;

  const onSlotClick = (hour: number) => (event: MouseEvent<HTMLElement>) =>
    props.onCellClick?.(createDateInfo(day, { hour, today: ctx.now }), event);

  return (
    <div className="rlc-dayrev">
      <DayHeader day={day} column={0} />
      <div className="rlc-dayrev__scroll" ref={scrollRef}>
        <div
          className="rlc-dayrev__inner"
          style={
            {
              '--_hours': hours.length,
              '--_lanes': Math.max(laneCount, 1),
            } as CSSProperties
          }
        >
          <div className="rlc-dayrev__hours">
            {hours.map((hour) => (
              <div key={hour} className="rlc-dayrev__hour" data-rlc-hour={hour}>
                <HourLabel hour={hour} day={day} />
              </div>
            ))}
          </div>
          <div className="rlc-dayrev__track">
            {hours.map((hour) => (
              <div
                key={hour}
                className="rlc-dayrev__slot"
                onClick={onSlotClick(hour)}
              />
            ))}
            {segments.map((s) => (
              <EventItem
                key={s.n.key}
                n={s.n}
                variant="timed"
                isCompact
                continuesBefore={s.continuesBefore}
                continuesAfter={s.continuesAfter}
                style={
                  {
                    '--_left': s.left / total,
                    '--_width': s.width / total,
                    '--_lane': s.lane,
                  } as CSSProperties
                }
              />
            ))}
            {isToday && nowMinutes >= 0 && nowMinutes < total && (
              <div
                className="rlc-now rlc-now--vertical"
                style={{ '--_left': nowMinutes / total } as CSSProperties}
                aria-hidden="true"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
