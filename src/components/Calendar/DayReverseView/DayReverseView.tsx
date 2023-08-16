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
import { DayTimeViewProps } from './DayReverseView.types';
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

const DayReverseView: FC<DayTimeViewProps> = ({
  renderItems,
  renderHeaderItems,
  currentDate,
  onDayNumberClick,
  onDayStringClick,
  onHourClick,
  onColorDotClick,
  onCellClick,
  onCellHeaderClick,
  timeDateFormat,
  preparedColorDots,
}) => {
  // Current day info
  const parsedCurrentDay = useMemo(() => {
    return getDateInfo(new Date(currentDate));
  }, [currentDate]);

  return (
    <>
      <div data-cy="StringDay" className="days-reverse-component">
        <div
          onClick={(e) => onDayStringClick(currentDate, e)}
          className="days-reverse-component__day"
        >
          {format(
            new Date(currentDate),
            timeDateFormat.day || TimeDateFormat.SHORT_WEEKDAY,
          )}
        </div>
      </div>
      <div data-cy="DayViewInside" className="day-reverse-view-inside">
        <div className="day-reverse-hour-columns__cells">
          {Array.from(Array(24)).map((_, hour) => (
            <div
              key={hour}
              data-cy="Hours"
              className="day-reverse-hour-columns__cells-item"
              onClick={(e) => {
                const timeDate = getKeyFromDateInfo(parsedCurrentDay, hour);
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
              {getTimeUnitString(hour - 1, timeDateFormat)}
            </div>
          ))}
        </div>
        <div className="day-reverse-hour-columns">
          {renderItems({ dateInfo: parsedCurrentDay, idx: 0 })}
          <div className="day-hour-rows__items">
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
        </div>
      </div>
    </>
  );
};

export default DayReverseView;
