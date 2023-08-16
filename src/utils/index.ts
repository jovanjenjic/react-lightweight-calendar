import { TimeDateFormat } from '../components/Calendar/Calendar.constants';
import { calculateStartAndEndMinute } from '../components/Calendar/Calendar.helper';
import {
  PreparedDataWithTime,
  PreparedDataWithTimeFull,
  PreparedDataWithTimeInPlace,
  PreparedDataWithoutTime,
  WeekStartsOn,
} from '../components/Calendar/Calendar.types';
import {
  differenceInDays,
  add,
  getDay,
  format,
  startOfDay,
  differenceInMinutes,
  endOfDay,
  isEqual,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  startOfHour,
  addDays,
} from 'date-fns';

export const formatFullDate = (date: Date): string =>
  format(date, TimeDateFormat.FULL_DATE);

export const formatFullDateTime = (date: Date): string =>
  format(date, TimeDateFormat.FULL_DATE_TIME);

export const formatHour = (date: Date): string =>
  format(date, TimeDateFormat.HOUR_MINUTE);

export const formatMonthDayHour = (date: Date): string =>
  format(date, TimeDateFormat.MONTH_DAY_HOUR);

export const dayInWeekBasedOnWeekStarts = (
  timeDate: string,
  weekStartsOn = 1,
): number => {
  return (getDay(new Date(timeDate)) - weekStartsOn + 7) % 7;
};

export const getAllDaysInMonth = (month) => {
  const daysOfMonth = eachDayOfInterval({
    start: startOfMonth(new Date(month)),
    end: endOfMonth(new Date(month)),
  }).map((day) => format(day, 'yyyy-MM-dd'));

  return daysOfMonth;
};

/**
 * Based on the currently selected field in the configuration (eg `startTime` or `startTime-endTime`),
 * a corresponding array is formed that will be displayed on the calendar.
 * Used for MONTH and WEEK view
 * @param calendarData - Array of data for calendar view
 * @param activeTimeDateField - Current active field (startTime, endTime, startTime-endTIme, etc...)
 * @param weekStartsOn - By default week starts on Monday
 * @returns - Prepared array of data for calendar view
 */
export const prepareCalendarData = (
  // eslint-disable-next-line
  calendarData: Record<string, any>[],
  activeTimeDateField: string,
  weekStartsOn: WeekStartsOn,
): Record<string, PreparedDataWithoutTime[]>[] => {
  const result = {} as Record<string, PreparedDataWithoutTime[]>[];
  const [startIntervalKey, endIntervalKey = startIntervalKey] = (
    activeTimeDateField ?? ''
  )
    .split('-')
    .map((str) => str.replace(/\s/g, ''));

  // A sorted array based on the date and time that is active
  const sortedCalendarValue = calendarData.sort(
    (a, b) =>
      new Date(a?.[startIntervalKey]).valueOf() -
      new Date(b?.[startIntervalKey]).valueOf(),
  );

  for (const obj of sortedCalendarValue) {
    const startDateValue = obj?.[startIntervalKey];
    const endDateValue = obj?.[endIntervalKey];

    if (!startDateValue || !endDateValue) continue;

    const startDate: Date = new Date(startDateValue);
    // Item can has an end interval, if it doesn't then it is the same as the start interval
    const endDate: Date = new Date(endDateValue);
    const startDateModified = startOfDay(new Date(startDate));
    const endDateModified = startOfDay(new Date(endDate));

    const numberOfDays: number = differenceInDays(
      endDateModified,
      startDateModified,
    );

    // The goal is to go through all the days that exist between the start and end value
    // of the interval for the current item (most often it is only one)
    for (let i = 0; i <= numberOfDays; i++) {
      const nextDay = add(startDate, { days: i });
      const key: string = formatFullDate(nextDay);

      // The first in a series of iterations. We started from him
      const isStartInterval: boolean = key === formatFullDate(startDate);

      // If the interval is large enough to continue in the next week. day() returns serial number of day in week
      const isNextWeek: boolean = getDay(nextDay) === weekStartsOn;

      if (isStartInterval || isNextWeek) {
        const res = {
          ...obj,
          isStart: isStartInterval,
          // Based on a longer interval, the component will be set to that interval of days.
          // At most, it can span seven days (week === 7 days) in one row, after which it continues in the next row
          length: isNextWeek
            ? Math.min(7, numberOfDays - i + 1)
            : Math.min(7, numberOfDays + 1),
        };
        result[key] = [...(result[key] || []), res];
      }
    }
  }

  return result;
};

// This is a helper method that, based on the number of
// elements and their position, will determine the width, position and margin for better visibility
// TODO: Switch it to work as recursion
const processMatchingItems = (dayElements: PreparedDataWithTime[]): void => {
  const calculateWidth = (numberInRow) => {
    return `${(2 / (numberInRow * 1.25 + 0.78)) * 100}%`;
  };

  const calculateLeft = (numberInRow, index) => {
    return `${(1 / (numberInRow + 1)) * 100 * index}%`;
  };

  let processedIds: number[] = [];
  let processedObjects = {};

  // Iterate through all the passed elements
  for (let i = 0; i < dayElements.length; i++) {
    const dayItem = dayElements[i];
    // If an element is processed, we skip it
    if (processedIds.includes(dayItem.id)) {
      continue;
    }

    // Elements that are in the range of the current element
    const matchingItems = dayElements.filter(
      (item) =>
        +item.startMinute > +dayItem.startMinute - 30 &&
        +item.startMinute < +dayItem.startMinute + 30,
    );

    let matchingItemsWithNeighbors: PreparedDataWithTime[] = [];
    // The elements that are in range of each of the elements that are in range.
    // It is necessary to find all neighbors that are in range
    for (let i = 0; i < matchingItems.length; i++) {
      const item = matchingItems[i];
      // Neighbors that are in range
      const neighbors = dayElements.filter(
        (neighbor) =>
          +neighbor.startMinute > +item.startMinute - 30 &&
          +neighbor.startMinute < +item.startMinute + 30,
      );
      // If an element does not exist in the array being processed, this element must added and consider its neighbors as well
      neighbors.forEach((o) => {
        if (!matchingItems.find((v) => v.id === o.id)) {
          matchingItems.push(o);
        }
      });

      matchingItemsWithNeighbors = [
        ...matchingItemsWithNeighbors,
        ...neighbors,
      ];
    }

    // Deleting duplicates that may be found because some elements may have the same neighbors in the range
    const withoutDuplicates = matchingItemsWithNeighbors.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.id === value.id),
    );

    const numberInRow = withoutDuplicates.length;
    // We detect the elements that have been processed so that we do not process an element more than once
    processedIds = [
      ...processedIds,
      ...withoutDuplicates.map((item) => item.id),
    ];
    // The sequential number of elements per group should be remembered so that each subsequent group is indented
    processedObjects = {
      ...processedObjects,
      [numberInRow]: (processedObjects[numberInRow] || 0) + 1,
    };
    // Calculation of width and moving
    withoutDuplicates.forEach((item, index) => {
      item.numberInRow = numberInRow;
      item.width = `calc(${calculateWidth(numberInRow)} - ${
        processedObjects[numberInRow]
      }% - 5px)`;
      item.left = calculateLeft(numberInRow, index);
    });
  }
};
/**
 * Based on the currently selected field in the configuration (eg `startTime` or `startTime-endTime`),
 * a corresponding array is formed that will be displayed on the calendar.
 * Used for DAY and WEEK_TIME
 * @param calendarData - Array of data for calendar view
 * @param activeTimeDateField - Current active field (startTime, endTime, startTime-endTIme, etc...)
 * @returns - Prepared array of data for calendar view
 */
export const prepareCalendarDataWithTime = (
  // eslint-disable-next-line
  calendarData: Record<string, any>[],
  activeTimeDateField: string,
): PreparedDataWithTimeFull => {
  const result = {
    week: [] as PreparedDataWithTime[],
    day: {} as Record<string, PreparedDataWithTime>[],
  };
  // If there is an end interval, it is separated by '-' (createdAt - updatedAt)
  const [startIntervalKey, endIntervalKey = startIntervalKey] = (
    activeTimeDateField ?? ''
  )
    .split('-')
    .map((str) => str.replace(/\s/g, '')) as [string, string];

  // Sorted by active field
  const sortedCalendarValue = calendarData.sort(
    (a, b) =>
      new Date(a?.[startIntervalKey]).valueOf() -
      new Date(b?.[startIntervalKey]).valueOf(),
  );

  sortedCalendarValue.forEach((obj) => {
    const startDateValue = obj?.[startIntervalKey];
    // If there is no end interval key, it will be the same as start
    const endDateValue = obj?.[endIntervalKey];

    // If by chance one of the values is missing, it means that the item is invalid and we will not
    // insert it into the resulting array
    if (!startDateValue || !endDateValue) return;

    const startDate = new Date(startDateValue);
    const endDate = new Date(endDateValue);

    const numberOfMinutes = differenceInMinutes(endDate, startDate);

    const key: string = formatFullDate(startDate);

    const res: PreparedDataWithTime = {
      ...obj,
      startMinute: 0,
      endMinute: 0,
    };

    // In case it is longer than 24 hours, we will place it in the header
    if (numberOfMinutes > 24 * 60) {
      result.week = [...(result.week || []), res];
      // In case it is not longer than 24 hours but is on 2 different days
    } else if (differenceInMinutes(endDate, startOfDay(startDate)) >= 24 * 60) {
      // First day
      const firstDayEnd = endOfDay(startDate);
      const { startMinute, endMinute } = calculateStartAndEndMinute(
        startDate,
        firstDayEnd,
      );
      const firstDayRes = {
        ...res,
        startMinute,
        endMinute,
      };
      result.day[key] = [...(result.day[key] || []), firstDayRes];

      // Next day
      const secondDayStart = startOfDay(endDate);
      // To avoid the case when it is until the beginning of the next day (00:00)
      if (formatFullDateTime(secondDayStart) !== formatFullDateTime(endDate)) {
        const startAndEndMinutSecondItem = calculateStartAndEndMinute(
          secondDayStart,
          endDate,
        );
        const secondDayKey: string = formatFullDate(secondDayStart);
        const secondDayRes = {
          ...res,
          startMinute: startAndEndMinutSecondItem.startMinute,
          endMinute: startAndEndMinutSecondItem.endMinute,
        };
        result.day[secondDayKey] = [
          ...(result.day[secondDayKey] || []),
          secondDayRes,
        ];
      }
      // In case if it is in one day
    } else {
      const { startMinute, endMinute } = calculateStartAndEndMinute(
        startDate,
        endDate,
      );
      const expendedRes = {
        ...res,
        startMinute,
        endMinute: endMinute == startMinute ? endMinute + 30 : endMinute,
      };
      result.day[key] = [...(result.day[key] || []), expendedRes];
    }
  });

  Object.keys(result.day).forEach((key) => {
    processMatchingItems(result.day[key]);
  });

  return result;
};

/**
 * Based on the currently selected field in the configuration (eg `startTime` or `startTime-endTime`),
 * a corresponding array is formed that will be displayed on the calendar.
 * Used for DAY_IN_PLACE and WEEK_IN_PLACE views
 * @param calendarData - Array of data for calendar view
 * @param activeTimeDateField - Current active field (startTime, endTime, startTime-endTIme, etc...)
 * @returns - Prepared array of data for calendar view
 */
export const prepareCalendarDataInPlace = (
  // eslint-disable-next-line
  calendarData: Record<string, any>[],
  activeTimeDateField: string,
): PreparedDataWithTimeInPlace => {
  const result = {};

  // Regardless of the existence of the second interval, we only consider the first interval.
  // This method will position the elements always in one cell, sorted
  const [startIntervalKey] = (activeTimeDateField ?? '')
    .split('-')
    .map((str) => str.replace(/\s/g, '')) as [string, string];

  // A sorted array based on the date and time that was selected within configurations
  const sortedCalendarValue = calendarData.sort(
    (a, b) =>
      new Date(a?.[startIntervalKey]).valueOf() -
      new Date(b?.[startIntervalKey]).valueOf(),
  );

  for (const obj of sortedCalendarValue) {
    const startDateValue = obj?.[startIntervalKey];
    if (!startDateValue) continue;

    const startDate = new Date(startDateValue);
    const roundedStartTime = startOfHour(startDate);

    const key: string = formatFullDateTime(roundedStartTime);

    result[key] = [...(result[key] || []), obj];
  }

  return result;
};

/**
 * Based on the currently selected field in the configuration (eg `startTime` or `startTime-endTime`),
 * a corresponding array is formed that will be displayed on the calendar.
 * Used for DAY and WEEK_TIME
 * @param calendarData - Array of data for calendar view
 * @param activeTimeDateField - Current active field (startTime, endTime, startTime-endTIme, etc...)
 * @returns - Prepared array of data for calendar view
 */
export const prepareCalendarDataWithTimeReverse = (
  // eslint-disable-next-line
  calendarData: Record<string, any>[],
  activeTimeDateField: string,
): PreparedDataWithTimeFull => {
  const result = {
    week: [] as PreparedDataWithTime[],
    day: {} as Record<string, PreparedDataWithTime>[],
  };
  // If there is an end interval, it is separated by '-' (createdAt - updatedAt)
  const [startIntervalKey, endIntervalKey = startIntervalKey] = (
    activeTimeDateField ?? ''
  )
    .split('-')
    .map((str) => str.replace(/\s/g, '')) as [string, string];

  // Sorted by active field
  const sortedCalendarValue = calendarData.sort(
    (a, b) =>
      new Date(a?.[startIntervalKey]).valueOf() -
      new Date(b?.[startIntervalKey]).valueOf(),
  );

  sortedCalendarValue.forEach((obj) => {
    const startDateValue = obj?.[startIntervalKey];
    const endDateValue = obj?.[endIntervalKey];

    if (!startDateValue || !endDateValue) return;

    const startDate = new Date(startDateValue);
    const endDate = new Date(endDateValue);

    // Calculate difference in days
    const diffInDays = differenceInDays(endDate, startDate);

    for (let i = 0; i <= diffInDays; i++) {
      const currentDate = addDays(startDate, i);
      const key: string = formatFullDate(currentDate);

      const res: PreparedDataWithTime = {
        ...obj,
        startMinute: 0,
        endMinute: 0,
      };

      const startOfDayDate =
        startDate > startOfDay(currentDate)
          ? startDate
          : startOfDay(currentDate);
      const endOfDayDate =
        endDate < endOfDay(currentDate) ? endDate : endOfDay(currentDate);

      const { startMinute, endMinute } = calculateStartAndEndMinute(
        startOfDayDate,
        endOfDayDate,
      );

      const adjustedRes = {
        ...res,
        startMinute,
        endMinute,
      };

      result.day[key] = [...(result.day[key] || []), adjustedRes];
    }
  });

  Object.keys(result.day).forEach((key) => {
    processMatchingItems(result.day[key]);
  });

  return result;
};

// It simulates the lodash method
export const isEqualValues = (value, other) => {
  if (value === other) {
    return true;
  }

  const typeValue = typeof value;
  const typeOther = typeof other;
  if (typeValue !== typeOther) {
    return false;
  }

  if (value === null || other === null || typeValue !== 'object') {
    return false;
  }

  const valueKeys = Object.keys(value);
  const otherKeys = Object.keys(other);

  if (valueKeys.length !== otherKeys.length) {
    return false;
  }

  for (const key of valueKeys) {
    if (!isEqual(value[key], other[key])) {
      return false;
    }
  }

  return true;
};

// It simulates the lodash method
export const isEmptyObject = (value) => {
  if (value == null) {
    return true;
  }

  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }

  if (typeof value === 'string' || Array.isArray(value)) {
    return value.length === 0;
  }

  return false;
};
