import './DayInPlaceView.scss';
import React, { useMemo, FC } from 'react';
import { getDate, getMonth, getYear, isToday, format } from 'date-fns';
import cn from 'classnames';
import { getKeyFromDateInfo, getTimeUnitString } from '../Calendar.helper';
import { TimeDateFormat } from '../Calendar.constants';
import { DateInfo } from '../Calendar.types';
import { DayInPlaceViewProps } from './DayInPlaceView.types';

const getDateInfo = (date: Date, currentMonth: number): DateInfo => {
  return {
    day: getDate(date),
    month: getMonth(date),
    year: getYear(date),
    isCurrentMonth: getMonth(date) === currentMonth,
    isCurrentDay: isToday(date),
    date: format(date, TimeDateFormat.FULL_DATE),
  };
};

const DayInPlaceView: FC<DayInPlaceViewProps> = ({
  renderItems,
  currentDate,
  onDayNumberClick,
  onDayStringClick,
  onHourClick,
  onColorDotClick,
  onCellClick,
  timeDateFormat,
  preparedColorDots,
}) => {
  // Current day info
  const parsedCurrentDay = useMemo(() => {
    return getDateInfo(new Date(currentDate), getMonth(new Date(currentDate)));
  }, [currentDate]);

  return (
    <>
      <div data-cy="StringDay" className="days-component">
        <div
          onClick={() => onDayStringClick(currentDate)}
          className="days-component__day"
        >
          {format(
            new Date(currentDate),
            timeDateFormat.day || TimeDateFormat.SHORT_WEEKDAY,
          )}
        </div>
      </div>
      <div data-cy="DayInPlaceViewInside" className="day-view-inside">
        <div className="day-in-place-cell-header">
          <p
            data-cy="DayNumber"
            className={cn(
              'day-in-place-cell-header__number',
              !parsedCurrentDay.isCurrentMonth &&
                'day-in-place-cell-header__number--disabled',
              parsedCurrentDay.isCurrentDay &&
                'day-in-place-cell-header__number--current-day',
            )}
            onClick={() => onDayNumberClick(parsedCurrentDay.date)}
          >
            {parsedCurrentDay.day}
          </p>
          {preparedColorDots.dateKeys?.[parsedCurrentDay.date] && (
            <p
              data-cy="ColorDot"
              data-date={parsedCurrentDay.date}
              style={{
                backgroundColor:
                  preparedColorDots.dateKeys[parsedCurrentDay.date]?.color,
              }}
              className="day-in-place-cell-header__color-dot"
              onClick={() =>
                onColorDotClick(
                  preparedColorDots.dateKeys[parsedCurrentDay.date],
                )
              }
            />
          )}
        </div>
        <div
          data-cy="Cells"
          key={parsedCurrentDay.date}
          className="day-in-place-hour-row"
        >
          {Array.from(Array(24)).map((_, hour) => (
            <div
              className="day-in-place-hour-row__hour-cell"
              key={`${parsedCurrentDay.date}-${hour}`}
              onClick={() =>
                onCellClick({
                  ...parsedCurrentDay,
                  hour,
                  cellKey: getKeyFromDateInfo(parsedCurrentDay, hour),
                })
              }
            >
              <div
                data-cy="Hours"
                className="day-in-place-hour-row__hour-cell-hour-number"
                onClick={(e) => {
                  e.stopPropagation();
                  onHourClick({
                    ...parsedCurrentDay,
                    hour,
                  });
                }}
              >
                {getTimeUnitString(hour - 1, timeDateFormat)}
              </div>
              {renderItems({ dateInfo: parsedCurrentDay, hour, idx: 0 })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default DayInPlaceView;
