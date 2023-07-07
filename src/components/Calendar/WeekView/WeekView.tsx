import './WeekVIew.scss';
import cn from 'classnames';
import React, { useMemo, FC } from 'react';
import {
  add,
  getDate,
  getMonth,
  getYear,
  isToday,
  startOfWeek,
  format,
} from 'date-fns';
import { DateInfo } from '../Calendar.types';
import { formatFullDate } from '../../../utils/index';
import { WeekViewProps } from './WeekView.types';
import { onDayStringClickHandler } from '../Calendar.helper';

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

const WeekView: FC<WeekViewProps> = ({
  renderItems,
  currentDate,
  onDayNumberClick,
  onDayStringClick,
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
      <div data-cy="WeekViewInside" className="week-view-inside">
        <div data-cy="VerticalBorders" className="vertical-borders-container">
          {Array.from(Array(7)).map((_, key) => (
            <div
              key={key}
              className={cn(
                'vertical-borders-container',
                'vertical-borders-container__border',
              )}
            />
          ))}
        </div>
        <div data-cy="WeekRow" className="week-view-row">
          {getCurrentWeek.map((dateInfo, idx) => (
            <React.Fragment key={dateInfo.date}>
              <div
                className="week-view-row-day-cell--cover"
                style={{
                  gridColumn: `${idx + 1} / ${idx + 2}`,
                }}
                onClick={() =>
                  onCellClick({
                    ...dateInfo,
                    cellKey: formatFullDate(new Date(dateInfo.date)),
                  })
                }
              />
              <div className="week-view-cell-header">
                <p
                  data-cy="DayNumber"
                  data-day-type={
                    dateInfo.isCurrentDay
                      ? 'current'
                      : !dateInfo.isCurrentMonth && 'disabled'
                  }
                  className={cn(
                    'week-view-cell-header__number',
                    !dateInfo.isCurrentMonth &&
                      'week-view-cell-header__number--disabled',
                    dateInfo.isCurrentDay &&
                      'week-view-cell-header__number--current-day',
                  )}
                  onClick={() => onDayNumberClick(dateInfo.date)}
                >
                  {dateInfo.day}
                </p>
                {preparedColorDots.dateKeys?.[dateInfo.date] && (
                  <p
                    data-cy="ColorDot"
                    data-date={dateInfo.date}
                    style={{
                      backgroundColor:
                        preparedColorDots.dateKeys[dateInfo.date]?.color,
                    }}
                    className="week-view-cell-header__color-dot"
                    onClick={() =>
                      onColorDotClick(preparedColorDots.dateKeys[dateInfo.date])
                    }
                  />
                )}
              </div>
              {renderItems({ dateInfo, idx })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
};

export default WeekView;
