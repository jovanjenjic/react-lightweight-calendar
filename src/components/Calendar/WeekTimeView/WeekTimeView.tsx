import './WeekTimeView.scss';
import React, { useMemo, FC } from 'react';
import cn from 'classnames';
import {
  add,
  getDate,
  getMonth,
  getYear,
  isToday,
  startOfWeek,
  format,
  getHours,
  getMinutes,
} from 'date-fns';
import { DateInfo } from '../Calendar.types';
import { formatFullDate } from '../../../utils/index';
import { getTimeUnitString, onDayStringClickHandler } from '../Calendar.helper';
import { WeekTimeViewProps } from './WeekTimeView.types';

const getDateInfo = (date: Date, currentMonth: number): DateInfo => {
  return {
    day: getDate(date),
    month: getMonth(date),
    year: getYear(date),
    isCurrentMonth: getMonth(date) === currentMonth,
    isCurrentDay: isToday(date),
    date: formatFullDate(date),
  };
};

const WeekTimeView: FC<WeekTimeViewProps> = ({
  renderItems,
  renderHeaderItems,
  currentDate,
  onDayStringClick,
  onDayNumberClick,
  onHourClick,
  onColorDotClick,
  onCellClick,
  timeDateFormat,
  preparedColorDots,
}) => {
  const weekStartsOn = timeDateFormat.weekStartsOn ?? 1;
  // Returns every day of the week
  const getCurrentWeek = useMemo(() => {
    const startDate = startOfWeek(new Date(currentDate), { weekStartsOn });
    const nextTimeUnit = getDate(add(startDate, { weeks: 1 }));

    const weekDates: DateInfo[] = [];
    let day = 0;

    while (
      getDate(startOfWeek(add(startDate, { days: day }), { weekStartsOn })) !==
      nextTimeUnit
    ) {
      weekDates.push(
        getDateInfo(
          add(startDate, { days: day }),
          getMonth(new Date(currentDate)),
        ),
      );
      day++;
    }

    return weekDates;
  }, [currentDate, weekStartsOn]);

  return (
    <>
      <div data-cy="StringDays" className="days-component">
        {Array.from(Array(7)).map((_, i) => (
          <div
            key={i}
            className="days-component__day"
            onClick={() =>
              onDayStringClick(
                onDayStringClickHandler(currentDate, i, weekStartsOn),
              )
            }
          >
            {format(
              add(startOfWeek(new Date(currentDate), { weekStartsOn }), {
                days: i,
              }),
              timeDateFormat.day,
            )}
          </div>
        ))}
      </div>
      <div data-cy="WeekTimeViewInside" className="week-time-view-inside">
        <div className="vertical-borders-container">
          {Array.from(Array(7)).map((_, key) => (
            <div
              data-cy="CellsBorder"
              key={key}
              className={cn(
                'vertical-borders-container',
                'vertical-borders-container__border',
              )}
            />
          ))}
        </div>
        <div className="week-time-header">
          <>
            {Array.from(Array(7)).map((_, i) => (
              <div key={i} className="week-time-header--item">
                <p
                  data-cy="DayNumber"
                  data-day-type={
                    getCurrentWeek[i].isCurrentDay
                      ? 'current'
                      : !getCurrentWeek[i].isCurrentMonth && 'disabled'
                  }
                  className={cn(
                    'week-time-header__number',
                    !getCurrentWeek[i].isCurrentMonth &&
                      'week-time-header__number--disabled',
                    getCurrentWeek[i].isCurrentDay &&
                      'week-time-header__number--current-day',
                  )}
                  onClick={() => onDayNumberClick(getCurrentWeek[i].date)}
                >
                  {getCurrentWeek[i].day}
                </p>
                {preparedColorDots.dateKeys?.[getCurrentWeek[i].date] && (
                  <p
                    data-cy="ColorDot"
                    data-date={getCurrentWeek[i].date}
                    style={{
                      backgroundColor:
                        preparedColorDots.dateKeys[getCurrentWeek[i].date]
                          ?.color,
                    }}
                    className="week-time-header__color-dot"
                    onClick={() =>
                      onColorDotClick(
                        preparedColorDots.dateKeys[getCurrentWeek[i].date],
                      )
                    }
                  />
                )}
              </div>
            ))}
            {renderHeaderItems(
              getCurrentWeek[0]?.date,
              getCurrentWeek[getCurrentWeek.length - 1]?.date,
            )}
          </>
        </div>
        <div className="week-time-week">
          <>
            <div className="week-time-week__cover">
              {Array.from(Array(24)).map((_, hour) =>
                Array.from(Array(7)).map((_, day) => (
                  <div
                    key={`${day}-${hour}`}
                    onClick={() =>
                      onCellClick({ ...getCurrentWeek[day], hour })
                    }
                  />
                )),
              )}
            </div>
            <div data-cy="HourRows" className="week-time-week__border-bottom">
              {Array.from(Array(24)).map((_, hour) => (
                <div
                  key={hour}
                  data-cy="Hours"
                  className="week-time-week__border-bottom-row"
                >
                  <p
                    onClick={(e) => {
                      e.stopPropagation();
                      onHourClick(hour);
                    }}
                    className="week-time-week__border-bottom-hour-unit"
                  >
                    {getTimeUnitString(hour - 1, timeDateFormat)}
                  </p>
                </div>
              ))}
            </div>
            {getCurrentWeek.map((dateInfo, idx) => (
              <div key={dateInfo.date} className="week-time-week__column">
                {renderItems({ dateInfo, idx })}
                {dateInfo.isCurrentDay && (
                  <div
                    key={dateInfo.date}
                    data-cy="CurrentMinutLine"
                    className="current-minute-line"
                    style={{
                      gridColumn: '1/3',
                      gridRow:
                        getHours(new Date()) * 60 + getMinutes(new Date()),
                    }}
                  />
                )}
              </div>
            ))}
          </>
        </div>
      </div>
    </>
  );
};

export default WeekTimeView;
