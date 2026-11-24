"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var _jsxruntime = require('react/jsx-runtime');
var _classnames = require('classnames'); var _classnames2 = _interopRequireDefault(_classnames);
var _react = require('react'); var _react2 = _interopRequireDefault(_react);








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
const WeekView = ({
  renderItems,
  currentDate,
  onDayNumberClick,
  onDayStringClick,
  onColorDotClick,
  onCellClick,
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
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { "data-cy": "WeekViewInside", className: "week-view-inside", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "data-cy": "VerticalBorders", className: "vertical-borders-container", children: Array.from(Array(7)).map((_, key) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
        "div",
        {
          className: _classnames2.default.call(void 0, 
            "vertical-borders-container",
            "vertical-borders-container__border"
          )
        },
        key
      )) }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "data-cy": "WeekRow", className: "week-view-row", children: getCurrentWeek.map((dateInfo, idx) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _react2.default.Fragment, { children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "div",
          {
            className: "week-view-row-day-cell--cover",
            style: {
              gridColumn: `${idx + 1} / ${idx + 2}`
            },
            onClick: (e) => {
              const timeDate = _index.formatFullDate.call(void 0, new Date(dateInfo.date));
              onCellClick(
                {
                  ...dateInfo,
                  timeDate,
                  timeDateUTC: new Date(timeDate).toISOString()
                },
                e
              );
            }
          }
        ),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "week-view-cell-header", children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
            "p",
            {
              "data-cy": "DayNumber",
              "data-day-type": dateInfo.isCurrentDay ? "current" : !dateInfo.isCurrentMonth && "disabled",
              className: _classnames2.default.call(void 0, 
                "week-view-cell-header__number",
                !dateInfo.isCurrentMonth && "week-view-cell-header__number--disabled",
                dateInfo.isCurrentDay && "week-view-cell-header__number--current-day"
              ),
              onClick: (e) => onDayNumberClick(dateInfo.date, e),
              children: dateInfo.day
            }
          ),
          _optionalChain([preparedColorDots, 'access', _2 => _2.dateKeys, 'optionalAccess', _3 => _3[dateInfo.date]]) && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
            "p",
            {
              "data-cy": "ColorDot",
              "data-date": dateInfo.date,
              style: {
                backgroundColor: _optionalChain([preparedColorDots, 'access', _4 => _4.dateKeys, 'access', _5 => _5[dateInfo.date], 'optionalAccess', _6 => _6.color])
              },
              className: "week-view-cell-header__color-dot",
              onClick: (e) => onColorDotClick(
                preparedColorDots.dateKeys[dateInfo.date],
                e
              )
            }
          )
        ] }),
        renderItems({ dateInfo, idx })
      ] }, dateInfo.date)) })
    ] })
  ] });
};
var WeekView_default = WeekView;


exports.default = WeekView_default;
