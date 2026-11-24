"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var _jsxruntime = require('react/jsx-runtime');
var _react = require('react');
var _classnames = require('classnames'); var _classnames2 = _interopRequireDefault(_classnames);










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
const WeekTimeView = ({
  renderItems,
  renderHeaderItems,
  currentDate,
  onDayStringClick,
  onDayNumberClick,
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
    const startDate = _datefns.startOfWeek.call(void 0, new Date(currentDate), { weekStartsOn });
    const nextTimeUnit = _datefns.getDate.call(void 0, _datefns.add.call(void 0, startDate, { weeks: 1 }));
    const weekDates = [];
    let day = 0;
    while (_datefns.getDate.call(void 0, _datefns.startOfWeek.call(void 0, _datefns.add.call(void 0, startDate, { days: day }), { weekStartsOn })) !== nextTimeUnit) {
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
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { "data-cy": "WeekTimeViewInside", className: "week-time-view-inside", children: [
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
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "week-time-header", children: [
        Array.from(Array(7)).map((_, i) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
          "div",
          {
            className: "week-time-header--item",
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
                    "week-time-header__number",
                    !getCurrentWeek[i].isCurrentMonth && "week-time-header__number--disabled",
                    getCurrentWeek[i].isCurrentDay && "week-time-header__number--current-day"
                  ),
                  onClick: (e) => {
                    e.stopPropagation();
                    onDayNumberClick(getCurrentWeek[i].date, e);
                  },
                  children: getCurrentWeek[i].day
                }
              ),
              _optionalChain([preparedColorDots, 'access', _3 => _3.dateKeys, 'optionalAccess', _4 => _4[getCurrentWeek[i].date]]) && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                "p",
                {
                  "data-cy": "ColorDot",
                  "data-date": getCurrentWeek[i].date,
                  style: {
                    backgroundColor: _optionalChain([preparedColorDots, 'access', _5 => _5.dateKeys, 'access', _6 => _6[getCurrentWeek[i].date], 'optionalAccess', _7 => _7.color])
                  },
                  className: "week-time-header__color-dot",
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
        )),
        renderHeaderItems(
          _optionalChain([getCurrentWeek, 'access', _8 => _8[0], 'optionalAccess', _9 => _9.date]),
          _optionalChain([getCurrentWeek, 'access', _10 => _10[getCurrentWeek.length - 1], 'optionalAccess', _11 => _11.date])
        )
      ] }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "week-time-week", children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "week-time-week__cover", children: Array.from(Array(24)).map(
          (_, hour) => Array.from(Array(7)).map((_2, day) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
            "div",
            {
              onClick: (e) => {
                const timeDate = _Calendarhelper.getKeyFromDateInfo.call(void 0, 
                  getCurrentWeek[day],
                  hour
                );
                onCellClick(
                  {
                    ...getCurrentWeek[day],
                    hour,
                    timeDate,
                    timeDateUTC: new Date(timeDate).toISOString()
                  },
                  e
                );
              }
            },
            `${day}-${hour}`
          ))
        ) }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "data-cy": "HourRows", className: "week-time-week__border-bottom", children: Array.from(Array(24)).map((_, hour) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "div",
          {
            "data-cy": "Hours",
            className: "week-time-week__border-bottom-row",
            children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
              "p",
              {
                onClick: (e) => {
                  e.stopPropagation();
                  onHourClick(hour, e);
                },
                className: "week-time-week__border-bottom-hour-unit",
                children: _Calendarhelper.getTimeUnitString.call(void 0, hour - 1, timeDateFormat)
              }
            )
          },
          hour
        )) }),
        getCurrentWeek.map((dateInfo, idx) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "week-time-week__column", children: [
          renderItems({ dateInfo, idx }),
          dateInfo.isCurrentDay && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
            "div",
            {
              "data-cy": "CurrentMinutLine",
              className: "current-minute-line",
              style: {
                gridColumn: "1/3",
                gridRow: _datefns.getHours.call(void 0, /* @__PURE__ */ new Date()) * 60 + _datefns.getMinutes.call(void 0, /* @__PURE__ */ new Date())
              }
            },
            dateInfo.date
          )
        ] }, dateInfo.date))
      ] }) })
    ] })
  ] });
};
var WeekTimeView_default = WeekTimeView;


exports.default = WeekTimeView_default;
