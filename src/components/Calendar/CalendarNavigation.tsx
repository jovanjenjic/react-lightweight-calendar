import { add, format, sub } from 'date-fns';
import React from 'react';
import { formatFullDate } from '../../utils/index';
import Button from '../Button/Button';
import { TimeDateFormat } from './Calendar.constants';
import { CalendarHeaderProps, CurrentView } from './Calendar.types';

const CalendarNavigation: React.FC<CalendarHeaderProps> = ({
  setCurrentDate,
  currentDate,
  currentView,
  timeDateFormat,
  locale,
  todayLabel,
}) => {
  const getNextTimeUnit = React.useMemo(() => {
    switch (currentView) {
      case CurrentView.MONTH:
        return 'months';
      case CurrentView.WEEK:
        return 'weeks';
      case CurrentView.WEEK_TIME:
      case CurrentView.WEEK_IN_PLACE:
        return 'weeks';
      case CurrentView.DAY:
      case CurrentView.DAY_REVERSE:
      case CurrentView.DAY_IN_PLACE:
        return 'days';
      default:
        return 'months';
    }
  }, [currentView]);

  const changeMonth = (type: 'add' | 'sub'): void => {
    const duration = { [getNextTimeUnit]: 1 };
    const newDate =
      type === 'add'
        ? formatFullDate(add(new Date(currentDate), duration))
        : formatFullDate(sub(new Date(currentDate), duration));
    setCurrentDate(newDate);
  };

  return (
    <div data-cy="CalendarNavigation" className="calendar__navigation">
      <Button
        dataCy="NavigationNowButton"
        label={todayLabel}
        onClick={() => setCurrentDate(formatFullDate(new Date()))}
        withBorder
      />
      <div className="calendar__navigation-arrow-buttons">
        <Button
          dataCy="NavigationLeftButton"
          arrowSide="left"
          onClick={() => changeMonth('sub')}
        />
        <Button
          dataCy="NavigationRightButton"
          arrowSide="right"
          onClick={() => changeMonth('add')}
        />
      </div>

      <div className="calendar__navigation__month-text">
        <span data-cy="NavigationTimeDateText">
          {format(
            new Date(currentDate),
            timeDateFormat?.monthYear || TimeDateFormat.MONTH_YEAR,
            { locale },
          )}
        </span>
      </div>
    </div>
  );
};

export default CalendarNavigation;
