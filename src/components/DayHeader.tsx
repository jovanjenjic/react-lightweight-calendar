import cn from 'classnames';
import { format } from 'date-fns';
import type { MouseEvent } from 'react';
import { useCalendar } from '../context';
import { createDateInfo, isDayView, toDateKey } from '../core/date';
import { ColorDot } from './ColorDot';
import { WeekdayLabel } from './WeekdayLabel';

/** Column header with weekday and day number, used by the hour-based views. */
export function DayHeader({
  day,
  column,
}: {
  day: Date;
  /** Column in the grid, from 0; the hour gutter is before it. */
  column: number;
}) {
  const ctx = useCalendar();
  const { props, view } = ctx;
  const key = toDateKey(day);
  const isToday = key === ctx.todayKey;
  const dot = ctx.colorDotsByDate.get(key);

  const onHeaderClick = (event: MouseEvent<HTMLElement>) =>
    props.onCellHeaderClick?.(
      createDateInfo(day, { hour: 0, today: ctx.now }),
      event,
    );
  const onWeekdayClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    // Day views pass `currentDate` back as given, like 1.x and 2.x did.
    props.onDayStringClick?.(
      isDayView(view) ? (props.currentDate ?? key) : key,
      event,
    );
  };
  const onDayNumberClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    props.onDayNumberClick?.(key, event);
  };

  return (
    <div
      className={cn('rlc-dayhead', isToday && 'rlc-dayhead--today')}
      style={{ gridColumn: column + 2 }}
      onClick={onHeaderClick}
    >
      {props.renderDayHeader ? (
        props.renderDayHeader({
          date: day,
          dateInfo: createDateInfo(day, { today: ctx.now }),
          weekdayLabel: format(day, ctx.formats.day, { locale: ctx.locale }),
          dayNumber: day.getDate(),
          isToday,
          view,
          colorDot: dot,
          onWeekdayClick,
          onDayNumberClick,
        })
      ) : (
        <>
          <button
            type="button"
            className="rlc-btn rlc-dayhead__weekday"
            onClick={onWeekdayClick}
          >
            <WeekdayLabel day={day} />
          </button>
          <span className="rlc-dayhead__number-row">
            <button
              type="button"
              className={cn(
                'rlc-btn',
                'rlc-daynum',
                'rlc-daynum--large',
                isToday && 'rlc-daynum--today',
              )}
              aria-label={format(day, 'PPPP', { locale: ctx.locale })}
              aria-current={isToday ? 'date' : undefined}
              onClick={onDayNumberClick}
            >
              {day.getDate()}
            </button>
            {dot && <ColorDot dot={dot} />}
          </span>
        </>
      )}
    </div>
  );
}
