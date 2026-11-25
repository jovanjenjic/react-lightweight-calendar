import { format } from 'date-fns';
import type { MouseEvent } from 'react';
import { useCalendar } from '../context';
import { createDateInfo, isWeekView } from '../core/date';

/**
 * An hour label of the timeline. `day` is the day the hour belongs to in the day
 * views; week views share one label for all days.
 */
export function HourLabel({ hour, day }: { hour: number; day?: Date }) {
  const ctx = useCalendar();
  const { props, view } = ctx;
  const label = format(new Date(2000, 0, 1, hour), ctx.formats.hour, {
    locale: ctx.locale,
  });

  const onClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    if (!props.onHourClick) return;
    // Week views pass the hour, day views a DateInfo, as 1.x and 2.x did.
    if (isWeekView(view) || !day) props.onHourClick(hour, event);
    else
      props.onHourClick(createDateInfo(day, { hour, today: ctx.now }), event);
  };

  return (
    <span className="rlc-hour" onClick={onClick}>
      {props.renderHourLabel
        ? props.renderHourLabel({ hour, label, view })
        : label}
    </span>
  );
}
