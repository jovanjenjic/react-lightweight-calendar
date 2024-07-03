import { FC, useMemo } from 'react';
import { isEmptyObject } from '../../utils';
import { CalendarProps, ColorDotFull, CurrentView } from './Calendar.types';
import CalendarNavigation from './CalendarNavigation';
import DayInPlaceView from './DayInPlaceView/DayInPlaceView';
import DayReverseView from './DayReverseView/DayReverseView';
import DayView from './DayView/DayView';
import MonthView from './MonthView/MonthView';
import WeekTimeInPlaceView from './WeekTimeInPlaceView/WeekTimeInPlaceView';
import WeekTimeView from './WeekTimeView/WeekTimeView';
import WeekView from './WeekView/WeekView';

const CalendarComponent: FC<CalendarProps> = ({
  renderItems,
  renderHeaderItems,
  currentView,
  currentDate,
  colorDots,
  setCurrentDate,
  onDayNumberClick,
  onDayStringClick,
  onHourClick,
  onColorDotClick,
  onCellClick,
  onCellHeaderClick,
  timeDateFormat,
  weekStartsOn,
  locale,
  todayLabel,
}) => {
  // Object that will be used to display the color dot for each day, but also for the legend below the calendar
  const preparedColorDots: ColorDotFull = useMemo(() => {
    const newValue = { dateKeys: {}, colorKeys: {} };
    (colorDots || []).forEach((dot) => {
      newValue.dateKeys[dot.date] = dot;
      newValue.colorKeys[dot.color] = dot;
    });
    return newValue;
  }, [colorDots]);

  // In case there are hours on the left side of the calendar, it is necessary to move the calendar on the left side
  const leftMargin = [
    CurrentView.DAY,
    CurrentView.DAY_IN_PLACE,
    CurrentView.WEEK_TIME,
    CurrentView.WEEK_IN_PLACE,
  ].includes(currentView);

  return (
    <div className={leftMargin ? 'calendar--left-margin' : ''}>
      {!!setCurrentDate && (
        <CalendarNavigation
          currentDate={currentDate}
          currentView={currentView}
          setCurrentDate={setCurrentDate}
          timeDateFormat={timeDateFormat}
          locale={locale}
          todayLabel={todayLabel}
        />
      )}
      {currentView === CurrentView.MONTH && (
        <MonthView
          preparedColorDots={preparedColorDots}
          renderItems={renderItems}
          currentView={currentView}
          currentDate={currentDate}
          onDayNumberClick={onDayNumberClick}
          onDayStringClick={onDayStringClick}
          onColorDotClick={onColorDotClick}
          onCellClick={onCellClick}
          timeDateFormat={timeDateFormat}
          weekStartsOn={weekStartsOn}
          locale={locale}
        />
      )}
      {currentView === CurrentView.WEEK && (
        <WeekView
          preparedColorDots={preparedColorDots}
          renderItems={renderItems}
          currentDate={currentDate}
          onDayNumberClick={onDayNumberClick}
          onDayStringClick={onDayStringClick}
          onColorDotClick={onColorDotClick}
          onCellClick={onCellClick}
          timeDateFormat={timeDateFormat}
          weekStartsOn={weekStartsOn}
          locale={locale}
        />
      )}
      {currentView === CurrentView.WEEK_TIME && (
        <WeekTimeView
          preparedColorDots={preparedColorDots}
          renderItems={renderItems}
          renderHeaderItems={renderHeaderItems}
          currentDate={currentDate}
          onDayNumberClick={onDayNumberClick}
          onDayStringClick={onDayStringClick}
          onColorDotClick={onColorDotClick}
          onCellClick={onCellClick}
          onCellHeaderClick={onCellHeaderClick}
          timeDateFormat={timeDateFormat}
          onHourClick={onHourClick}
          weekStartsOn={weekStartsOn}
          locale={locale}
        />
      )}
      {currentView === CurrentView.DAY && (
        <DayView
          preparedColorDots={preparedColorDots}
          renderItems={renderItems}
          renderHeaderItems={renderHeaderItems}
          currentDate={currentDate}
          onDayNumberClick={onDayNumberClick}
          onDayStringClick={onDayStringClick}
          onColorDotClick={onColorDotClick}
          onCellClick={onCellClick}
          onCellHeaderClick={onCellHeaderClick}
          timeDateFormat={timeDateFormat}
          onHourClick={onHourClick}
          locale={locale}
        />
      )}
      {currentView === CurrentView.DAY_REVERSE && (
        <DayReverseView
          preparedColorDots={preparedColorDots}
          renderItems={renderItems}
          currentDate={currentDate}
          onDayNumberClick={onDayNumberClick}
          onDayStringClick={onDayStringClick}
          onColorDotClick={onColorDotClick}
          onCellClick={onCellClick}
          timeDateFormat={timeDateFormat}
          onHourClick={onHourClick}
          locale={locale}
        />
      )}
      {currentView === CurrentView.WEEK_IN_PLACE && (
        <WeekTimeInPlaceView
          preparedColorDots={preparedColorDots}
          renderItems={renderItems}
          currentDate={currentDate}
          onDayNumberClick={onDayNumberClick}
          onDayStringClick={onDayStringClick}
          onColorDotClick={onColorDotClick}
          onCellClick={onCellClick}
          onCellHeaderClick={onCellHeaderClick}
          timeDateFormat={timeDateFormat}
          onHourClick={onHourClick}
          weekStartsOn={weekStartsOn}
          locale={locale}
        />
      )}
      {currentView === CurrentView.DAY_IN_PLACE && (
        <DayInPlaceView
          preparedColorDots={preparedColorDots}
          renderItems={renderItems}
          currentDate={currentDate}
          onDayNumberClick={onDayNumberClick}
          onDayStringClick={onDayStringClick}
          onColorDotClick={onColorDotClick}
          onCellClick={onCellClick}
          onCellHeaderClick={onCellHeaderClick}
          timeDateFormat={timeDateFormat}
          onHourClick={onHourClick}
          locale={locale}
        />
      )}
      {!isEmptyObject(preparedColorDots) && (
        <div data-cy="ColorDots" className="calendar-color-dots-legend">
          {Object.keys(preparedColorDots.colorKeys).map((color) => (
            <div
              key={color}
              className="calendar-color-dots-legend__flex"
              onClick={(e) =>
                onColorDotClick(preparedColorDots?.colorKeys[color], e)
              }
            >
              <p
                style={{ background: color }}
                className="calendar-color-dots-legend__flex__color-dot"
              />
              <p className="calendar-color-dots-legend__flex__text">
                {preparedColorDots?.colorKeys[color]?.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CalendarComponent;
