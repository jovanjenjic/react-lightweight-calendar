"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var _jsxruntime = require('react/jsx-runtime');
var _react = require('react');
var _classnames = require('classnames'); var _classnames2 = _interopRequireDefault(_classnames);








var _datefns = require('date-fns');
var _Calendarhelper = require('../Calendar.helper');
var _Calendarconstants = require('../Calendar.constants');
const getDateInfo = (date) => {
  return {
    day: _datefns.getDate.call(void 0, date),
    month: _datefns.getMonth.call(void 0, date),
    year: _datefns.getYear.call(void 0, date),
    isCurrentDay: _datefns.isToday.call(void 0, date),
    date: _datefns.format.call(void 0, date, _Calendarconstants.TimeDateFormat.FULL_DATE),
    timeDate: "",
    timeDateUTC: ""
  };
};
const DayView = ({
  renderItems,
  renderHeaderItems,
  currentDate,
  onDayNumberClick,
  onDayStringClick,
  onHourClick,
  onColorDotClick,
  onCellClick,
  onCellHeaderClick,
  timeDateFormat,
  preparedColorDots,
  locale
}) => {
  const parsedCurrentDay = _react.useMemo.call(void 0, () => {
    return getDateInfo(new Date(currentDate));
  }, [currentDate]);
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "data-cy": "StringDay", className: "days-component", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      "div",
      {
        onClick: (e) => onDayStringClick(currentDate, e),
        className: "days-component__day",
        children: _datefns.format.call(void 0, 
          new Date(currentDate),
          timeDateFormat.day || _Calendarconstants.TimeDateFormat.SHORT_WEEKDAY,
          { locale }
        )
      }
    ) }),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { "data-cy": "DayViewInside", className: "day-view-inside", children: [
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "day-header", children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
          "div",
          {
            className: "day-header__number-color-dot",
            onClick: (e) => {
              const timeDate = _Calendarhelper.getKeyFromDateInfo.call(void 0, parsedCurrentDay, 0);
              onCellHeaderClick(
                {
                  ...parsedCurrentDay,
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
                  className: _classnames2.default.call(void 0, 
                    "day-header__number",
                    parsedCurrentDay.isCurrentDay && "day-header__number--current-day"
                  ),
                  onClick: (e) => {
                    e.stopPropagation();
                    onDayNumberClick(parsedCurrentDay.date, e);
                  },
                  children: parsedCurrentDay.day
                }
              ),
              _optionalChain([preparedColorDots, 'access', _2 => _2.dateKeys, 'optionalAccess', _3 => _3[parsedCurrentDay.date]]) && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                "p",
                {
                  "data-cy": "ColorDot",
                  "data-date": parsedCurrentDay.date,
                  style: {
                    backgroundColor: _optionalChain([preparedColorDots, 'access', _4 => _4.dateKeys, 'access', _5 => _5[parsedCurrentDay.date], 'optionalAccess', _6 => _6.color])
                  },
                  className: "day-header__color-dot",
                  onClick: (e) => {
                    e.stopPropagation();
                    onColorDotClick(
                      preparedColorDots.dateKeys[parsedCurrentDay.date],
                      e
                    );
                  }
                }
              )
            ]
          }
        ),
        renderHeaderItems(_optionalChain([parsedCurrentDay, 'optionalAccess', _7 => _7.date]))
      ] }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "day-hour-rows", children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "data-cy": "HourRows", className: "day-hour-rows__border-bottom", children: Array.from(Array(24)).map((_, hour) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "div",
          {
            "data-cy": "Hours",
            className: "day-hour-rows__border-bottom-line",
            onClick: (e) => {
              const timeDate = _Calendarhelper.getKeyFromDateInfo.call(void 0, parsedCurrentDay, hour);
              onCellClick(
                {
                  ...parsedCurrentDay,
                  hour,
                  timeDate,
                  timeDateUTC: new Date(timeDate).toISOString()
                },
                e
              );
            },
            children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
              "p",
              {
                onClick: (e) => {
                  const timeDate = _Calendarhelper.getKeyFromDateInfo.call(void 0, 
                    parsedCurrentDay,
                    hour
                  );
                  e.stopPropagation();
                  onHourClick(
                    {
                      ...parsedCurrentDay,
                      hour,
                      timeDate,
                      timeDateUTC: new Date(timeDate).toISOString()
                    },
                    e
                  );
                },
                className: "day-hour-rows__border-bottom-hour-unit",
                children: _Calendarhelper.getTimeUnitString.call(void 0, hour - 1, timeDateFormat)
              }
            )
          },
          hour
        )) }),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "day-hour-rows__items", children: [
          renderItems({ dateInfo: parsedCurrentDay, idx: 0 }),
          parsedCurrentDay.isCurrentDay && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
            "div",
            {
              "data-cy": "CurrentMinutLine",
              className: "current-minute-line",
              style: {
                gridColumn: "1/3",
                gridRow: _datefns.getHours.call(void 0, /* @__PURE__ */ new Date()) * 60 + _datefns.getMinutes.call(void 0, /* @__PURE__ */ new Date())
              }
            }
          )
        ] })
      ] }) })
    ] })
  ] });
};
var DayView_default = DayView;


exports.default = DayView_default;
