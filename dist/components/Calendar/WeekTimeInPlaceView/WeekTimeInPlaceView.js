"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var _jsxruntime = require('react/jsx-runtime');
var _classnames = require('classnames'); var _classnames2 = _interopRequireDefault(_classnames);
var _react = require('react');








var _datefns = require('date-fns');
var _index = require('../../../utils/index');




var _Calendarhelper = require('../Calendar.helper');
const getDateInfo = (date, currentMonth) => {
  return {
    day: _datefns.getDate.call(void 0, date),
    month: _datefns.getMonth.call(void 0, date),
    year: _datefns.getYear.call(void 0, date),
    isCurrentMonth: _datefns.getMonth.call(void 0, date) === currentMonth,
    isCurrentDay: _datefns.isToday.call(void 0, date),
    date: _index.formatFullDate.call(void 0, date),
    timeDate: "",
    timeDateUTC: ""
  };
};
const WeekTimeInPlaceView = ({
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
  weekStartsOn,
  locale
}) => {
  const getCurrentWeek = _react.useMemo.call(void 0, () => {
    const startOfWeekOptions = { weekStartsOn };
    const startDate = _datefns.startOfWeek.call(void 0, new Date(currentDate), startOfWeekOptions);
    const nextTimeUnit = _datefns.getDate.call(void 0, _datefns.add.call(void 0, startDate, { weeks: 1 }));
    const weekDates = [];
    let day = 0;
    while (_datefns.getDate.call(void 0, 
      _datefns.startOfWeek.call(void 0, _datefns.add.call(void 0, startDate, { days: day }), startOfWeekOptions)
    ) !== nextTimeUnit) {
      weekDates.push(
        getDateInfo(
          _datefns.add.call(void 0, startDate, { days: day }),
          _datefns.getMonth.call(void 0, new Date(currentDate))
        )
      );
      day++;
    }
    return weekDates;
  }, [currentDate, weekStartsOn]);
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "data-cy": "StringDays", className: "days-component", children: Array.from(Array(7)).map((_, i) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      "div",
      {
        className: "days-component__day",
        onClick: (e) => onDayStringClick(
          _Calendarhelper.onDayStringClickHandler.call(void 0, currentDate, i, weekStartsOn),
          e
        ),
        children: _datefns.format.call(void 0, 
          _datefns.add.call(void 0, _datefns.startOfWeek.call(void 0, new Date(currentDate), { weekStartsOn }), {
            days: i
          }),
          timeDateFormat.day,
          { locale }
        )
      },
      i
    )) }),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
      "div",
      {
        "data-cy": "WeekTimeInPlaceViewInside",
        className: "week-time-in-place-view-inside",
        children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "vertical-borders-container", children: Array.from(Array(7)).map((_, key) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
            "div",
            {
              "data-cy": "CellsBorder",
              className: _classnames2.default.call(void 0, 
                "vertical-borders-container",
                "vertical-borders-container__border"
              )
            },
            key
          )) }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "week-in-place-header", children: Array.from(Array(7)).map((_, i) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
            "div",
            {
              className: "week-in-place-cell-header",
              onClick: (e) => {
                const timeDate = _Calendarhelper.getKeyFromDateInfo.call(void 0, getCurrentWeek[i], 0);
                onCellHeaderClick(
                  {
                    ...getCurrentWeek[i],
                    hour: 0,
                    timeDate,
                    timeDateUTC: new Date(timeDate).toISOString()
                  },
                  e
                );
              },
              children: [
                /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                  "p",
                  {
                    "data-cy": "DayNumber",
                    "data-day-type": getCurrentWeek[i].isCurrentDay ? "current" : !getCurrentWeek[i].isCurrentMonth && "disabled",
                    className: _classnames2.default.call(void 0, 
                      "week-in-place-cell-header__number",
                      !getCurrentWeek[i].isCurrentMonth && "week-in-place-cell-header__number--disabled",
                      getCurrentWeek[i].isCurrentDay && "week-in-place-cell-header__number--current-day"
                    ),
                    onClick: (e) => {
                      e.stopPropagation();
                      onDayNumberClick(getCurrentWeek[i].date, e);
                    },
                    children: getCurrentWeek[i].day
                  }
                ),
                _optionalChain([preparedColorDots, 'access', _2 => _2.dateKeys, 'optionalAccess', _3 => _3[getCurrentWeek[i].date]]) && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                  "p",
                  {
                    "data-cy": "ColorDot",
                    "data-date": getCurrentWeek[i].date,
                    style: {
                      backgroundColor: _optionalChain([preparedColorDots, 'access', _4 => _4.dateKeys, 'access', _5 => _5[getCurrentWeek[i].date], 'optionalAccess', _6 => _6.color])
                    },
                    className: "week-in-place-cell-header__color-dot",
                    onClick: (e) => {
                      e.stopPropagation();
                      onColorDotClick(
                        preparedColorDots.dateKeys[getCurrentWeek[i].date],
                        e
                      );
                    }
                  }
                )
              ]
            },
            i
          )) }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "data-cy": "Cells", className: "week-in-place-row", children: Array.from(Array(24)).map(
            (_, hour) => getCurrentWeek.map((dateInfo, idx) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
              "div",
              {
                className: _classnames2.default.call(void 0, 
                  "week-in-place-row__hour-cell",
                  hour !== 23 && "week-in-place-row__hour-cell--border-bottom"
                ),
                onClick: (e) => {
                  const timeDate = _Calendarhelper.getKeyFromDateInfo.call(void 0, dateInfo, hour);
                  onCellClick(
                    {
                      ...dateInfo,
                      hour,
                      timeDate,
                      timeDateUTC: new Date(timeDate).toISOString()
                    },
                    e
                  );
                },
                children: [
                  idx === 0 && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                    "div",
                    {
                      "data-cy": "Hours",
                      className: "week-in-place-row__hour-cell-hour-number",
                      onClick: (e) => {
                        e.stopPropagation();
                        onHourClick(hour, e);
                      },
                      children: _Calendarhelper.getTimeUnitString.call(void 0, hour - 1, timeDateFormat)
                    }
                  ),
                  renderItems({ dateInfo, hour, idx })
                ]
              },
              dateInfo.date
            ))
          ) })
        ]
      }
    )
  ] });
};
var WeekTimeInPlaceView_default = WeekTimeInPlaceView;


exports.default = WeekTimeInPlaceView_default;
