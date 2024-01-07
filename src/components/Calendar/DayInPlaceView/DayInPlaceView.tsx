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
    timeDate: '',
    timeDateUTC: '',
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
  onCellHeaderClick,
  timeDateFormat,
  preparedColorDots,
  locale,
}) => {
  // Current day info
  const parsedCurrentDay = useMemo(() => {
    return getDateInfo(new Date(currentDate), getMonth(new Date(currentDate)));
  }, [currentDate]);

  return (
    <>
      <div data-cy="StringDay" className="days-component">
        <div
          onClick={(e) => onDayStringClick(currentDate, e)}
          className="days-component__day"
        >
          {format(
            new Date(currentDate),
            timeDateFormat.day || TimeDateFormat.SHORT_WEEKDAY,
            { locale },
          )}
        </div>
      </div>
      <div data-cy="DayInPlaceViewInside" className="day-view-inside">
        <div
          className="day-in-place-cell-header"
          onClick={(e) => {
            const timeDate = getKeyFromDateInfo(parsedCurrentDay, 0);
            onCellHeaderClick(
              {
                ...parsedCurrentDay,
                hour: 0,
                timeDate,
                timeDateUTC: new Date(timeDate).toISOString(),
              },
              e,
            );
          }}
        >
          <p
            data-cy="DayNumber"
            className={cn(
              'day-in-place-cell-header__number',
              !parsedCurrentDay.isCurrentMonth &&
                'day-in-place-cell-header__number--disabled',
              parsedCurrentDay.isCurrentDay &&
                'day-in-place-cell-header__number--current-day',
            )}
            onClick={(e) => {
              e.stopPropagation();
              onDayNumberClick(parsedCurrentDay.date, e);
            }}
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
        <div
          data-cy="Cells"
          key={parsedCurrentDay.date}
          className="day-in-place-hour-row"
        >
          {Array.from(Array(24)).map((_, hour) => (
            <div
              className="day-in-place-hour-row__hour-cell"
              key={`${parsedCurrentDay.date}-${hour}`}
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
              <div
                data-cy="Hours"
                className="day-in-place-hour-row__hour-cell-hour-number"
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
