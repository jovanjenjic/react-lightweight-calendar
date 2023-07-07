import './DayView.scss';
import React, { useMemo, FC } from 'react';
import cn from 'classnames';
import {
  getDate,
  getMonth,
  getYear,
  isToday,
  format,
  getMinutes,
  getHours,
} from 'date-fns';
import { getTimeUnitString } from '../Calendar.helper';
import { TimeDateFormat } from '../Calendar.constants';
import { DayTimeViewProps } from './DayView.types';
import { DateInfo } from '../Calendar.types';

const getDateInfo = (date: Date): DateInfo => {
  return {
    day: getDate(date),
    month: getMonth(date),
    year: getYear(date),
    isCurrentDay: isToday(date),
    date: format(date, TimeDateFormat.FULL_DATE),
  };
};

const DayView: FC<DayTimeViewProps> = ({
  renderItems,
  renderHeaderItems,
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
    return getDateInfo(new Date(currentDate));
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
      <div data-cy="DayViewInside" className="day-view-inside">
        <div className="day-header">
          <div className="day-header__number-color-dot">
            <p
              data-cy="DayNumber"
              className={cn(
                'day-header__number',
                parsedCurrentDay.isCurrentDay &&
                  'day-header__number--current-day',
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
                className="day-header__color-dot"
                onClick={() =>
                  onColorDotClick(
                    preparedColorDots.dateKeys[parsedCurrentDay.date],
                  )
                }
              />
            )}
          </div>
          {renderHeaderItems(parsedCurrentDay?.date)}
        </div>
        <div className="day-hour-rows">
          <>
            <div data-cy="HourRows" className="day-hour-rows__border-bottom">
              {Array.from(Array(24)).map((_, hour) => (
                <div
                  key={hour}
                  data-cy="Hours"
                  className="day-hour-rows__border-bottom-line"
                  onClick={() => onCellClick({ ...parsedCurrentDay, hour })}
                >
                  <p
                    onClick={(e) => {
                      e.stopPropagation();
                      onHourClick({ ...parsedCurrentDay, hour });
                    }}
                    className="day-hour-rows__border-bottom-hour-unit"
                  >
                    {getTimeUnitString(hour - 1, timeDateFormat)}
                  </p>
                </div>
              ))}
            </div>
            <div className="day-hour-rows__items">
              {renderItems({ dateInfo: parsedCurrentDay, idx: 0 })}
              {parsedCurrentDay.isCurrentDay && (
                <div
                  data-cy="CurrentMinutLine"
                  className="current-minute-line"
                  style={{
                    gridColumn: '1/3',
                    gridRow: getHours(new Date()) * 60 + getMinutes(new Date()),
                  }}
                />
              )}
            </div>
          </>
        </div>
      </div>
    </>
  );
};

export default DayView;
