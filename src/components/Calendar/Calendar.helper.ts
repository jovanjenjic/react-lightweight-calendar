import {
  add,
  addHours,
  format,
  getHours,
  getMinutes,
  startOfWeek,
} from 'date-fns';
import {
  CalculateStartAndEndMinuteFunc,
  CellDisplayMode,
  CellDisplayModeState,
  CurrentView,
  DateInfo,
  GetHeaderItemInfoFunc,
  InitializePropsFunc,
  InitializePropsRetFunc,
  PreparedDataWithoutTime,
  TimeFormat,
  WeekStartsOn,
} from './Calendar.types';
import {
  dayInWeekBasedOnWeekStarts,
  formatFullDate,
  formatFullDateTime,
  getAllDaysInMonth,
  isEmptyObject,
} from '../../utils/index';
import { TimeDateFormat } from './Calendar.constants';

// Designed to prepare and display the hours on the left side of the calendar
export const getTimeUnitString = (
  hour: number,
  timeDateFormat: TimeFormat,
): string => {
  return format(addHours(0, hour), timeDateFormat.hour || TimeDateFormat.HOUR);
};

// Makes the necessary keys by adding hours to each day
export const getKeyFromDateInfo = (
  dateInfo: DateInfo,
  hour: number,
): string => {
  const currentHour: Date = add(new Date(`${dateInfo.date} 00:00:00`), {
    hours: hour,
  });

  return formatFullDateTime(currentHour);
};

// In case a cell is collapsed, it decides whether any next item should be
// displayed that originates from that collapsed cell
export const shouldShowItem = (
  preparedDataItem: PreparedDataWithoutTime,
  dateKey: string,
  cellDisplayMode: CellDisplayMode,
  currentView: CurrentView,
  preparedData,
  currentDate: string | Date,
): boolean => {
  let retValue = true;
  if (
    preparedDataItem.isStart ||
    cellDisplayMode[currentView]?.state === CellDisplayModeState.ALL_EXPANDED ||
    currentView !== CurrentView.MONTH
  ) {
    return true;
  }

  const calendarDays =
    cellDisplayMode[currentView]?.state === CellDisplayModeState.ALL_COLLAPSED
      ? getAllDaysInMonth(currentDate)
      : cellDisplayMode[currentView]?.inactiveCells;

  for (let i = 0; i < calendarDays?.length && retValue; i++) {
    const dayCell = calendarDays[i];
    if (formatFullDate(new Date(dateKey)) < formatFullDate(new Date(dayCell))) {
      retValue = true;
    } else if (dateKey !== dayCell) {
      const closedCellItems = preparedData[dayCell] || [];
      retValue = !closedCellItems.find(
        (item) => item.id === preparedDataItem.id,
      );
    }
  }

  return retValue;
};

// A simple method that decides whether a cell should be collapsed
export const shouldCollapse = (
  cellDisplayMode: CellDisplayMode,
  currentView: CurrentView,
  dateKey: string,
): boolean =>
  cellDisplayMode[currentView]?.state === CellDisplayModeState.ALL_COLLAPSED ||
  (cellDisplayMode[currentView]?.state === CellDisplayModeState.CUSTOM &&
    cellDisplayMode[currentView].inactiveCells.includes(dateKey));

// It creates the necessary information for the elements in the header - position
// and whether the element is from the previous week or day or from the next
export const getHeaderItemInfo = (
  startWeekDate: string,
  endWeekDate: string,
  startIntervalDate: string,
  endIntervalDate: string,
  weekStartsOn: number,
): GetHeaderItemInfoFunc => {
  if (
    formatFullDate(new Date(startWeekDate)) >
      formatFullDate(new Date(endIntervalDate)) ||
    formatFullDate(new Date(endWeekDate)) <
      formatFullDate(new Date(startIntervalDate))
  ) {
    return { gridColumn: '' };
  }

  const isFromPrevious =
    formatFullDate(new Date(startWeekDate)) >
    formatFullDate(new Date(startIntervalDate));
  const isFromNext =
    formatFullDate(new Date(endWeekDate)) <
    formatFullDate(new Date(endIntervalDate));

  const startPosition = dayInWeekBasedOnWeekStarts(
    isFromPrevious ? startWeekDate : startIntervalDate,
    weekStartsOn,
  );
  const endPosition = dayInWeekBasedOnWeekStarts(
    isFromNext ? endWeekDate : endIntervalDate,
    weekStartsOn,
  );

  const gridColumn =
    startWeekDate === endWeekDate
      ? '1'
      : `${startPosition + 1} / ${endPosition + 2}`;

  return {
    gridColumn,
    isFromPrevious,
    isFromNext,
  };
};

// Calculates the height of the interval for two views (DAY and WEEK_TIME).
// If second interval unit is not set, the height will be 30 minutes or pixels
export const calculateStartAndEndMinute = (
  startDate: Date,
  endDate: Date,
): CalculateStartAndEndMinuteFunc => {
  const startMinute = getHours(startDate) * 60 + getMinutes(startDate) + 1 || 1;
  const endMinute = getHours(endDate) * 60 + getMinutes(endDate) + 1 || 1;

  return {
    startMinute,
    endMinute: startMinute === endMinute ? endMinute + 30 : endMinute,
  };
};

export const initializeProps = ({
  cellDisplayMode,
  timeDateFormat,
  onDayNumberClick,
  onDayStringClick,
  onHourClick,
  onColorDotClick,
  onItemClick,
  onCellClick,
}: InitializePropsFunc): InitializePropsRetFunc => {
  const onDayNumberClickModified = onDayNumberClick || (() => null);
  const onDayStringClickModified = onDayStringClick || (() => null);
  const onHourClickModified = onHourClick || (() => null);
  const onColorDotClickModified = onColorDotClick || (() => null);
  const onItemClickModified = onItemClick || (() => null);
  const onCellClickModified = onCellClick || (() => null);

  const timeDateFormatModified = {
    day: timeDateFormat?.day || TimeDateFormat.SHORT_WEEKDAY,
    hour: timeDateFormat?.hour || TimeDateFormat.HOUR,
    monthYear: timeDateFormat?.monthYear || TimeDateFormat.MONTH_YEAR,
    weekStartsOn: timeDateFormat?.weekStartsOn ?? WeekStartsOn.MONDAY,
  };

  const cellDisplayModeConst = {
    MONTH: {
      inactiveCells: [],
      state: CellDisplayModeState.ALL_EXPANDED,
    },
    WEEK_TIME: {
      inactiveCells: [],
      state: CellDisplayModeState.ALL_EXPANDED,
    },
    DAY_IN_PLACE: {
      inactiveCells: [],
      state: CellDisplayModeState.ALL_EXPANDED,
    },
    WEEK_IN_PLACE: {
      inactiveCells: [],
      state: CellDisplayModeState.ALL_EXPANDED,
    },
  } as CellDisplayMode;

  return {
    cellDisplayModeModified: isEmptyObject(cellDisplayMode)
      ? cellDisplayModeConst
      : (cellDisplayMode as CellDisplayMode),
    timeDateFormatModified,
    onDayNumberClickModified,
    onDayStringClickModified,
    onHourClickModified,
    onColorDotClickModified,
    onItemClickModified,
    onCellClickModified,
  };
};

export const onDayStringClickHandler = (currentDate, days, weekStartsOn) => {
  return formatFullDate(
    add(startOfWeek(new Date(currentDate), { weekStartsOn }), {
      days,
    }),
  );
};
