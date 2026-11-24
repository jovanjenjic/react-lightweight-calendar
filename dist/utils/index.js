"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var _Calendarconstants = require('../components/Calendar/Calendar.constants');
var _Calendarhelper = require('../components/Calendar/Calendar.helper');














var _datefns = require('date-fns');
const formatFullDate = (date) => _datefns.format.call(void 0, date, _Calendarconstants.TimeDateFormat.FULL_DATE);
const formatFullDateTime = (date) => _datefns.format.call(void 0, date, _Calendarconstants.TimeDateFormat.FULL_DATE_TIME);
const formatHour = (date) => _datefns.format.call(void 0, date, _Calendarconstants.TimeDateFormat.HOUR_MINUTE);
const formatMonthDayHour = (date) => _datefns.format.call(void 0, date, _Calendarconstants.TimeDateFormat.MONTH_DAY_HOUR);
const dayInWeekBasedOnWeekStarts = (timeDate, weekStartsOn = 1) => {
  return (_datefns.getDay.call(void 0, new Date(timeDate)) - weekStartsOn + 7) % 7;
};
const getAllDaysInMonth = (month) => {
  const daysOfMonth = _datefns.eachDayOfInterval.call(void 0, {
    start: _datefns.startOfMonth.call(void 0, new Date(month)),
    end: _datefns.endOfMonth.call(void 0, new Date(month))
  }).map((day) => _datefns.format.call(void 0, day, "yyyy-MM-dd"));
  return daysOfMonth;
};
const prepareCalendarData = (calendarData, activeTimeDateField, weekStartsOn) => {
  const result = {};
  const [startIntervalKey, endIntervalKey = startIntervalKey] = (_nullishCoalesce(activeTimeDateField, () => ( ""))).split("-").map((str) => str.replace(/\s/g, ""));
  const sortedCalendarValue = calendarData.sort(
    (a, b) => new Date(_optionalChain([a, 'optionalAccess', _ => _[startIntervalKey]])).valueOf() - new Date(_optionalChain([b, 'optionalAccess', _2 => _2[startIntervalKey]])).valueOf()
  );
  for (const obj of sortedCalendarValue) {
    const startDateValue = _optionalChain([obj, 'optionalAccess', _3 => _3[startIntervalKey]]);
    const endDateValue = _optionalChain([obj, 'optionalAccess', _4 => _4[endIntervalKey]]);
    if (!startDateValue || !endDateValue) continue;
    const startDate = new Date(startDateValue);
    const endDate = new Date(endDateValue);
    const startDateModified = _datefns.startOfDay.call(void 0, new Date(startDate));
    const endDateModified = _datefns.startOfDay.call(void 0, new Date(endDate));
    const numberOfDays = _datefns.differenceInDays.call(void 0, 
      endDateModified,
      startDateModified
    );
    for (let i = 0; i <= numberOfDays; i++) {
      const nextDay = _datefns.add.call(void 0, startDate, { days: i });
      const key = formatFullDate(nextDay);
      const isStartInterval = key === formatFullDate(startDate);
      const isNextWeek = _datefns.getDay.call(void 0, nextDay) === weekStartsOn;
      if (isStartInterval || isNextWeek) {
        const res = {
          ...obj,
          isStart: isStartInterval,
          // Based on a longer interval, the component will be set to that interval of days.
          // At most, it can span seven days (week === 7 days) in one row, after which it continues in the next row
          length: isNextWeek ? Math.min(7, numberOfDays - i + 1) : Math.min(7, numberOfDays + 1)
        };
        result[key] = [...result[key] || [], res];
      }
    }
  }
  return result;
};
const processMatchingItems = (dayElements) => {
  const calculateWidth = (numberInRow) => {
    return `${2 / (numberInRow * 1.25 + 0.78) * 100}%`;
  };
  const calculateLeft = (numberInRow, index) => {
    return `${1 / (numberInRow + 1) * 100 * index}%`;
  };
  let processedIds = [];
  let processedObjects = {};
  for (let i = 0; i < dayElements.length; i++) {
    const dayItem = dayElements[i];
    if (processedIds.includes(dayItem.id)) {
      continue;
    }
    const matchingItems = dayElements.filter(
      (item) => +item.startMinute > +dayItem.startMinute - 30 && +item.startMinute < +dayItem.startMinute + 30
    );
    let matchingItemsWithNeighbors = [];
    for (let i2 = 0; i2 < matchingItems.length; i2++) {
      const item = matchingItems[i2];
      const neighbors = dayElements.filter(
        (neighbor) => +neighbor.startMinute > +item.startMinute - 30 && +neighbor.startMinute < +item.startMinute + 30
      );
      neighbors.forEach((o) => {
        if (!matchingItems.find((v) => v.id === o.id)) {
          matchingItems.push(o);
        }
      });
      matchingItemsWithNeighbors = [
        ...matchingItemsWithNeighbors,
        ...neighbors
      ];
    }
    const withoutDuplicates = matchingItemsWithNeighbors.filter(
      (value, index, self) => index === self.findIndex((t) => t.id === value.id)
    );
    const numberInRow = withoutDuplicates.length;
    processedIds = [
      ...processedIds,
      ...withoutDuplicates.map((item) => item.id)
    ];
    processedObjects = {
      ...processedObjects,
      [numberInRow]: (processedObjects[numberInRow] || 0) + 1
    };
    withoutDuplicates.forEach((item, index) => {
      item.numberInRow = numberInRow;
      item.width = `calc(${calculateWidth(numberInRow)} - ${processedObjects[numberInRow]}% - 5px)`;
      item.left = calculateLeft(numberInRow, index);
    });
  }
};
const prepareCalendarDataWithTime = (calendarData, activeTimeDateField) => {
  const result = {
    week: [],
    day: {}
  };
  const [startIntervalKey, endIntervalKey = startIntervalKey] = (_nullishCoalesce(activeTimeDateField, () => ( ""))).split("-").map((str) => str.replace(/\s/g, ""));
  const sortedCalendarValue = calendarData.sort(
    (a, b) => new Date(_optionalChain([a, 'optionalAccess', _5 => _5[startIntervalKey]])).valueOf() - new Date(_optionalChain([b, 'optionalAccess', _6 => _6[startIntervalKey]])).valueOf()
  );
  sortedCalendarValue.forEach((obj) => {
    const startDateValue = _optionalChain([obj, 'optionalAccess', _7 => _7[startIntervalKey]]);
    const endDateValue = _optionalChain([obj, 'optionalAccess', _8 => _8[endIntervalKey]]);
    if (!startDateValue || !endDateValue) return;
    const startDate = new Date(startDateValue);
    const endDate = new Date(endDateValue);
    const numberOfMinutes = _datefns.differenceInMinutes.call(void 0, endDate, startDate);
    const key = formatFullDate(startDate);
    const res = {
      ...obj,
      startMinute: 0,
      endMinute: 0
    };
    if (numberOfMinutes > 24 * 60) {
      result.week = [...result.week || [], res];
    } else if (_datefns.differenceInMinutes.call(void 0, endDate, _datefns.startOfDay.call(void 0, startDate)) >= 24 * 60) {
      const firstDayEnd = _datefns.endOfDay.call(void 0, startDate);
      const { startMinute, endMinute } = _Calendarhelper.calculateStartAndEndMinute.call(void 0, 
        startDate,
        firstDayEnd
      );
      const firstDayRes = {
        ...res,
        startMinute,
        endMinute
      };
      result.day[key] = [...result.day[key] || [], firstDayRes];
      const secondDayStart = _datefns.startOfDay.call(void 0, endDate);
      if (formatFullDateTime(secondDayStart) !== formatFullDateTime(endDate)) {
        const startAndEndMinutSecondItem = _Calendarhelper.calculateStartAndEndMinute.call(void 0, 
          secondDayStart,
          endDate
        );
        const secondDayKey = formatFullDate(secondDayStart);
        const secondDayRes = {
          ...res,
          startMinute: startAndEndMinutSecondItem.startMinute,
          endMinute: startAndEndMinutSecondItem.endMinute
        };
        result.day[secondDayKey] = [
          ...result.day[secondDayKey] || [],
          secondDayRes
        ];
      }
    } else {
      const { startMinute, endMinute } = _Calendarhelper.calculateStartAndEndMinute.call(void 0, 
        startDate,
        endDate
      );
      const expendedRes = {
        ...res,
        startMinute,
        endMinute: endMinute == startMinute ? endMinute + 30 : endMinute
      };
      result.day[key] = [...result.day[key] || [], expendedRes];
    }
  });
  Object.keys(result.day).forEach((key) => {
    processMatchingItems(result.day[key]);
  });
  return result;
};
const prepareCalendarDataInPlace = (calendarData, activeTimeDateField) => {
  const result = {};
  const [startIntervalKey] = (_nullishCoalesce(activeTimeDateField, () => ( ""))).split("-").map((str) => str.replace(/\s/g, ""));
  const sortedCalendarValue = calendarData.sort(
    (a, b) => new Date(_optionalChain([a, 'optionalAccess', _9 => _9[startIntervalKey]])).valueOf() - new Date(_optionalChain([b, 'optionalAccess', _10 => _10[startIntervalKey]])).valueOf()
  );
  for (const obj of sortedCalendarValue) {
    const startDateValue = _optionalChain([obj, 'optionalAccess', _11 => _11[startIntervalKey]]);
    if (!startDateValue) continue;
    const startDate = new Date(startDateValue);
    const roundedStartTime = _datefns.startOfHour.call(void 0, startDate);
    const key = formatFullDateTime(roundedStartTime);
    result[key] = [...result[key] || [], obj];
  }
  return result;
};
const prepareCalendarDataWithTimeReverse = (calendarData, activeTimeDateField) => {
  const result = {
    week: [],
    day: {}
  };
  const [startIntervalKey, endIntervalKey = startIntervalKey] = (_nullishCoalesce(activeTimeDateField, () => ( ""))).split("-").map((str) => str.replace(/\s/g, ""));
  const sortedCalendarValue = calendarData.sort(
    (a, b) => new Date(_optionalChain([a, 'optionalAccess', _12 => _12[startIntervalKey]])).valueOf() - new Date(_optionalChain([b, 'optionalAccess', _13 => _13[startIntervalKey]])).valueOf()
  );
  sortedCalendarValue.forEach((obj) => {
    const startDateValue = _optionalChain([obj, 'optionalAccess', _14 => _14[startIntervalKey]]);
    const endDateValue = _optionalChain([obj, 'optionalAccess', _15 => _15[endIntervalKey]]);
    if (!startDateValue || !endDateValue) return;
    const startDate = new Date(startDateValue);
    const endDate = new Date(endDateValue);
    const diffInDays = _datefns.differenceInDays.call(void 0, endDate, startDate);
    for (let i = 0; i <= diffInDays; i++) {
      const currentDate = _datefns.addDays.call(void 0, startDate, i);
      const key = formatFullDate(currentDate);
      const res = {
        ...obj,
        startMinute: 0,
        endMinute: 0
      };
      const startOfDayDate = startDate > _datefns.startOfDay.call(void 0, currentDate) ? startDate : _datefns.startOfDay.call(void 0, currentDate);
      const endOfDayDate = endDate < _datefns.endOfDay.call(void 0, currentDate) ? endDate : _datefns.endOfDay.call(void 0, currentDate);
      const { startMinute, endMinute } = _Calendarhelper.calculateStartAndEndMinute.call(void 0, 
        startOfDayDate,
        endOfDayDate
      );
      const adjustedRes = {
        ...res,
        startMinute,
        endMinute
      };
      result.day[key] = [...result.day[key] || [], adjustedRes];
    }
  });
  Object.keys(result.day).forEach((key) => {
    processMatchingItems(result.day[key]);
  });
  return result;
};
const isEqualValues = (value, other) => {
  if (value === other) {
    return true;
  }
  const typeValue = typeof value;
  const typeOther = typeof other;
  if (typeValue !== typeOther) {
    return false;
  }
  if (value === null || other === null || typeValue !== "object") {
    return false;
  }
  const valueKeys = Object.keys(value);
  const otherKeys = Object.keys(other);
  if (valueKeys.length !== otherKeys.length) {
    return false;
  }
  for (const key of valueKeys) {
    if (!_datefns.isEqual.call(void 0, value[key], other[key])) {
      return false;
    }
  }
  return true;
};
const isEmptyObject = (value) => {
  if (value == null) {
    return true;
  }
  if (typeof value === "object") {
    return Object.keys(value).length === 0;
  }
  if (typeof value === "string" || Array.isArray(value)) {
    return value.length === 0;
  }
  return false;
};













exports.dayInWeekBasedOnWeekStarts = dayInWeekBasedOnWeekStarts; exports.formatFullDate = formatFullDate; exports.formatFullDateTime = formatFullDateTime; exports.formatHour = formatHour; exports.formatMonthDayHour = formatMonthDayHour; exports.getAllDaysInMonth = getAllDaysInMonth; exports.isEmptyObject = isEmptyObject; exports.isEqualValues = isEqualValues; exports.prepareCalendarData = prepareCalendarData; exports.prepareCalendarDataInPlace = prepareCalendarDataInPlace; exports.prepareCalendarDataWithTime = prepareCalendarDataWithTime; exports.prepareCalendarDataWithTimeReverse = prepareCalendarDataWithTimeReverse;
