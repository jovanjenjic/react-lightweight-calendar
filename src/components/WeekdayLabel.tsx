import { format } from 'date-fns';
import { useCalendar } from '../context';

/** A weekday name in a long and a narrow form; CSS shows the one that fits. */
export function WeekdayLabel({ day }: { day: Date }) {
  const { formats, locale } = useCalendar();
  return (
    <>
      <span className="rlc-label-long">
        {format(day, formats.day, { locale })}
      </span>
      <span className="rlc-label-narrow" aria-hidden="true">
        {format(day, formats.narrowDay, { locale })}
      </span>
    </>
  );
}
