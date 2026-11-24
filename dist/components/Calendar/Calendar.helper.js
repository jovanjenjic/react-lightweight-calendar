"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }






var _datefns = require('date-fns');
var _enUS = require('date-fns/locale/en-US');






var _index = require('../../utils/index');
var _Calendarconstants = require('./Calendar.constants');




var _Calendartypes = require('./Calendar.types');
const getTimeUnitString = (hour, timeDateFormat) => {
  return _datefns.format.call(void 0, _datefns.addHours.call(void 0, 0, hour), timeDateFormat.hour || _Calendarconstants.TimeDateFormat.HOUR);
};
const getKeyFromDateInfo = (dateInfo, hour) => {
  const currentHour = _datefns.add.call(void 0, /* @__PURE__ */ new Date(`${dateInfo.date} 00:00:00`), {
    hours: hour
  });
  return _index.formatFullDateTime.call(void 0, currentHour);
};
const shouldShowItem = (preparedDataItem, dateKey, cellDisplayMode, currentView, preparedData, currentDate) => {
  let retValue = true;
  if (preparedDataItem.isStart || _optionalChain([cellDisplayMode, 'access', _ => _[currentView], 'optionalAccess', _2 => _2.state]) === _Calendartypes.CellDisplayModeState.ALL_EXPANDED || currentView !== _Calendartypes.CurrentView.MONTH) {
    return true;
  }
  const calendarDays = _optionalChain([cellDisplayMode, 'access', _3 => _3[currentView], 'optionalAccess', _4 => _4.state]) === _Calendartypes.CellDisplayModeState.ALL_COLLAPSED ? _index.getAllDaysInMonth.call(void 0, currentDate) : _optionalChain([cellDisplayMode, 'access', _5 => _5[currentView], 'optionalAccess', _6 => _6.inactiveCells]);
  for (let i = 0; i < _optionalChain([calendarDays, 'optionalAccess', _7 => _7.length]) && retValue; i++) {
    const dayCell = calendarDays[i];
    if (_index.formatFullDate.call(void 0, new Date(dateKey)) < _index.formatFullDate.call(void 0, new Date(dayCell))) {
      retValue = true;
    } else if (dateKey !== dayCell) {
      const closedCellItems = preparedData[dayCell] || [];
      retValue = !closedCellItems.find(
        (item) => item.id === preparedDataItem.id
      );
    }
  }
  return retValue;
};
const shouldCollapse = (cellDisplayMode, currentView, dateKey) => _optionalChain([cellDisplayMode, 'access', _8 => _8[currentView], 'optionalAccess', _9 => _9.state]) === _Calendartypes.CellDisplayModeState.ALL_COLLAPSED || _optionalChain([cellDisplayMode, 'access', _10 => _10[currentView], 'optionalAccess', _11 => _11.state]) === _Calendartypes.CellDisplayModeState.CUSTOM && cellDisplayMode[currentView].inactiveCells.includes(dateKey);
const getHeaderItemInfo = (startWeekDate, endWeekDate, startIntervalDate, endIntervalDate, weekStartsOn) => {
  if (_index.formatFullDate.call(void 0, new Date(startWeekDate)) > _index.formatFullDate.call(void 0, new Date(endIntervalDate)) || _index.formatFullDate.call(void 0, new Date(endWeekDate)) < _index.formatFullDate.call(void 0, new Date(startIntervalDate))) {
    return { gridColumn: "" };
  }
  const isFromPrevious = _index.formatFullDate.call(void 0, new Date(startWeekDate)) > _index.formatFullDate.call(void 0, new Date(startIntervalDate));
  const isFromNext = _index.formatFullDate.call(void 0, new Date(endWeekDate)) < _index.formatFullDate.call(void 0, new Date(endIntervalDate));
  const startPosition = _index.dayInWeekBasedOnWeekStarts.call(void 0, 
    isFromPrevious ? startWeekDate : startIntervalDate,
    weekStartsOn
  );
  const endPosition = _index.dayInWeekBasedOnWeekStarts.call(void 0, 
    isFromNext ? endWeekDate : endIntervalDate,
    weekStartsOn
  );
  const gridColumn = startWeekDate === endWeekDate ? "1" : `${startPosition + 1} / ${endPosition + 2}`;
  return {
    gridColumn,
    isFromPrevious,
    isFromNext
  };
};
const calculateStartAndEndMinute = (startDate, endDate) => {
  const startMinute = _datefns.getHours.call(void 0, startDate) * 60 + _datefns.getMinutes.call(void 0, startDate) + 1 || 1;
  const endMinute = _datefns.getHours.call(void 0, endDate) * 60 + _datefns.getMinutes.call(void 0, endDate) + 1 || 1;
  return {
    startMinute,
    // Fifteen minutes is the minimum that can be shown
    endMinute: endMinute - startMinute < 15 ? startMinute + 15 : endMinute
  };
};
const initializeProps = ({
  cellDisplayMode,
  timeDateFormat,
  weekStartsOn,
  onDayNumberClick,
  onDayStringClick,
  onHourClick,
  onColorDotClick,
  onItemClick,
  onCellClick,
  onCellHeaderClick,
  currentDate,
  currentView,
  activeTimeDateField,
  data,
  locale,
  todayLabel
}) => {
  const onDayNumberClickModified = onDayNumberClick || (() => null);
  const onDayStringClickModified = onDayStringClick || (() => null);
  const onHourClickModified = onHourClick || (() => null);
  const onColorDotClickModified = onColorDotClick || (() => null);
  const onItemClickModified = onItemClick || (() => null);
  const onCellClickModified = onCellClick || (() => null);
  const onCellHeaderClickModified = onCellHeaderClick || (() => null);
  const timeDateFormatModified = {
    day: _optionalChain([timeDateFormat, 'optionalAccess', _12 => _12.day]) || _Calendarconstants.TimeDateFormat.SHORT_WEEKDAY,
    hour: _optionalChain([timeDateFormat, 'optionalAccess', _13 => _13.hour]) || _Calendarconstants.TimeDateFormat.HOUR,
    monthYear: _optionalChain([timeDateFormat, 'optionalAccess', _14 => _14.monthYear]) || _Calendarconstants.TimeDateFormat.MONTH_YEAR
  };
  const weekStartsOnModified = _nullishCoalesce(weekStartsOn, () => ( _Calendartypes.WeekStartsOn.MONDAY));
  const currentDateModified = currentDate || _index.formatFullDate.call(void 0, /* @__PURE__ */ new Date());
  const currentViewModified = currentView || _Calendartypes.CurrentView.MONTH;
  const activeTimeDateFieldModified = activeTimeDateField || "";
  const dataModified = data || [];
  const localeModified = locale || _enUS.enUS;
  const todayLabelModified = todayLabel || "Today";
  const cellDisplayModeConst = {
    MONTH: {
      inactiveCells: [],
      state: _Calendartypes.CellDisplayModeState.ALL_EXPANDED
    },
    WEEK_TIME: {
      inactiveCells: [],
      state: _Calendartypes.CellDisplayModeState.ALL_EXPANDED
    },
    DAY_IN_PLACE: {
      inactiveCells: [],
      state: _Calendartypes.CellDisplayModeState.ALL_EXPANDED
    },
    WEEK_IN_PLACE: {
      inactiveCells: [],
      state: _Calendartypes.CellDisplayModeState.ALL_EXPANDED
    }
  };
  return {
    cellDisplayModeModified: _index.isEmptyObject.call(void 0, cellDisplayMode) ? cellDisplayModeConst : cellDisplayMode,
    timeDateFormatModified,
    onDayNumberClickModified,
    onDayStringClickModified,
    onHourClickModified,
    onColorDotClickModified,
    onItemClickModified,
    onCellClickModified,
    onCellHeaderClickModified,
    weekStartsOnModified,
    currentDateModified,
    currentViewModified,
    activeTimeDateFieldModified,
    dataModified,
    localeModified,
    todayLabelModified
  };
};
const onDayStringClickHandler = (currentDate, days, weekStartsOn) => {
  return _index.formatFullDate.call(void 0, 
    _datefns.add.call(void 0, _datefns.startOfWeek.call(void 0, new Date(currentDate), { weekStartsOn }), {
      days
    })
  );
};









exports.calculateStartAndEndMinute = calculateStartAndEndMinute; exports.getHeaderItemInfo = getHeaderItemInfo; exports.getKeyFromDateInfo = getKeyFromDateInfo; exports.getTimeUnitString = getTimeUnitString; exports.initializeProps = initializeProps; exports.onDayStringClickHandler = onDayStringClickHandler; exports.shouldCollapse = shouldCollapse; exports.shouldShowItem = shouldShowItem;
