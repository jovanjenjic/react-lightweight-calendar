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
import { getKeyFromDateInfo, getTimeUnitString } from '../Calendar.helper';
import { TimeDateFormat } from '../Calendar.constants';
import { DayReverseTimeViewProps } from './DayReverseView.types';
import { DateInfo } from '../Calendar.types';

const getDateInfo = (date: Date): DateInfo => {
  return {
    day: getDate(date),
    month: getMonth(date),
    year: getYear(date),
    isCurrentDay: isToday(date),
    date: format(date, TimeDateFormat.FULL_DATE),
    timeDate: '',
    timeDateUTC: '',
  };
};

const DayReverseView: FC<DayReverseTimeViewProps> = ({
  renderItems,
  currentDate,
  onDayNumberClick,
  onDayStringClick,
  onHourClick,
  onColorDotClick,
  onCellClick,
  timeDateFormat,
  preparedColorDots,
  locale,
}) => {
  // Current day info
  const parsedCurrentDay = useMemo(() => {
    return getDateInfo(new Date(currentDate));
  }, [currentDate]);

  return (
    <>
      <div className="day-reverse-day">
        <div
          onClick={(e) => onDayStringClick(currentDate, e)}
          className="day-reverse-day__day"
          data-cy="StringDay"
        >
          {format(
            new Date(currentDate),
            timeDateFormat.day || TimeDateFormat.SHORT_WEEKDAY,
            { locale },
          )}
        </div>
        <p
          data-cy="DayNumber"
          className={cn(
            'day-reverse-day__number',
            parsedCurrentDay.isCurrentDay &&
              'day-reverse-day__number--current-day',
          )}
          onClick={(e) => {
            e.stopPropagation();
            onDayNumberClick(parsedCurrentDay.date, e);
          }}
        >
          {parsedCurrentDay.day}
        </p>
        {parsedCurrentDay.isCurrentDay && (
          <div className="day-reverse-day__current-background" />
        )}
        {preparedColorDots.dateKeys?.[parsedCurrentDay.date] && (
          <p
            data-cy="ColorDot"
            data-date={parsedCurrentDay.date}
            style={{
              backgroundColor:
                preparedColorDots.dateKeys[parsedCurrentDay.date]?.color,
            }}
            className="day-reverse-day__color-dot"
            onClick={(e) => {
              e.stopPropagation();
              onColorDotClick(
                preparedColorDots.dateKeys[parsedCurrentDay.date],
                e,
              );
            }}
          />
        )}
      </div>
      <div data-cy="DayViewInside" className="day-reverse-view-inside">
        <div className="day-reverse-columns">
          {Array.from(Array(24)).map((_, hour) => (
            <div
              key={hour}
              data-cy="HourColumns"
              className="day-reverse-columns__border"
              onClick={(e) => {
                const timeDate = getKeyFromDateInfo(parsedCurrentDay, hour);
                e.stopPropagation();
                onCellClick(
                  {
                    ...parsedCurrentDay,
                    hour,
                    timeDate,
                    timeDateUTC: new Date(timeDate).toISOString(),
                  },
                  e,
                );
              }}
            >
              <div
                onClick={(e) => {
                  const timeDate = getKeyFromDateInfo(parsedCurrentDay, hour);
                  e.stopPropagation();
                  onHourClick(
                    {
                      ...parsedCurrentDay,
                      hour,
                      timeDate,
                      timeDateUTC: new Date(timeDate).toISOString(),
                    },
                    e,
                  );
                }}
                data-cy="Hours"
                className="day-reverse-columns__border-hour"
              >
                {getTimeUnitString(hour - 1, timeDateFormat)}
              </div>
            </div>
          ))}
        </div>
        <div className="day-reverse-items">
          {renderItems({ dateInfo: parsedCurrentDay, idx: 0 })}
          {parsedCurrentDay.isCurrentDay && (
            <div
              data-cy="CurrentMinutLine"
              className="day-reverse-items__minute-line"
              style={{
                gridColumn: getHours(new Date()) * 60 + getMinutes(new Date()),
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default DayReverseView;
