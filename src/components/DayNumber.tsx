import cn from 'classnames';
import { format } from 'date-fns';
import type { MouseEvent } from 'react';
import { useCalendar } from '../context';
import { createDateInfo, toDateKey } from '../core/date';
import { ColorDot } from './ColorDot';

/** The day number at the top of a MONTH or WEEK cell. */
export function DayNumber({
  day,
  isCurrentMonth,
}: {
  day: Date;
  isCurrentMonth: boolean;
}) {
  const ctx = useCalendar();
  const { props } = ctx;
  const key = toDateKey(day);
  const isToday = key === ctx.todayKey;
  const dot = ctx.colorDotsByDate.get(key);

  const onClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    props.onDayNumberClick?.(key, event);
  };

  if (props.renderDayNumber) {
    return (
      <div
        className="rlc-cell-header rlc-cell-header--custom"
        onClick={onClick}
      >
        {props.renderDayNumber({
          date: day,
          dateInfo: createDateInfo(day, {
            today: ctx.now,
            currentMonth: ctx.currentDate.getMonth(),
          }),
          dayNumber: day.getDate(),
          isToday,
          isCurrentMonth,
          colorDot: dot,
        })}
      </div>
    );
  }

  return (
    <div className="rlc-cell-header">
      <button
        type="button"
        className={cn('rlc-btn', 'rlc-daynum', isToday && 'rlc-daynum--today')}
        aria-label={format(day, 'PPPP', { locale: ctx.locale })}
        aria-current={isToday ? 'date' : undefined}
        onClick={onClick}
      >
        {day.getDate()}
      </button>
      {dot && <ColorDot dot={dot} />}
    </div>
  );
}
