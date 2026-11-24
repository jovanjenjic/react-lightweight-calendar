"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var _jsxruntime = require('react/jsx-runtime');
var _react = require('react');
var _datefns = require('date-fns');
var _classnames = require('classnames'); var _classnames2 = _interopRequireDefault(_classnames);
var _Calendarhelper = require('../Calendar.helper');
var _Calendarconstants = require('../Calendar.constants');
const getDateInfo = (date, currentMonth) => {
  return {
    day: _datefns.getDate.call(void 0, date),
    month: _datefns.getMonth.call(void 0, date),
    year: _datefns.getYear.call(void 0, date),
    isCurrentMonth: _datefns.getMonth.call(void 0, date) === currentMonth,
    isCurrentDay: _datefns.isToday.call(void 0, date),
    date: _datefns.format.call(void 0, date, _Calendarconstants.TimeDateFormat.FULL_DATE),
    timeDate: "",
    timeDateUTC: ""
  };
};
const DayInPlaceView = ({
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
  locale
}) => {
  const parsedCurrentDay = _react.useMemo.call(void 0, () => {
    return getDateInfo(new Date(currentDate), _datefns.getMonth.call(void 0, new Date(currentDate)));
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
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { "data-cy": "DayInPlaceViewInside", className: "day-view-inside", children: [
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
        "div",
        {
          className: "day-in-place-cell-header",
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
                  "day-in-place-cell-header__number",
                  !parsedCurrentDay.isCurrentMonth && "day-in-place-cell-header__number--disabled",
                  parsedCurrentDay.isCurrentDay && "day-in-place-cell-header__number--current-day"
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
                className: "day-in-place-cell-header__color-dot",
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
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
        "div",
        {
          "data-cy": "Cells",
          className: "day-in-place-hour-row",
          children: Array.from(Array(24)).map((_, hour) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
            "div",
            {
              className: "day-in-place-hour-row__hour-cell",
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
              children: [
                /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                  "div",
                  {
                    "data-cy": "Hours",
                    className: "day-in-place-hour-row__hour-cell-hour-number",
                    onClick: (e) => {
                      const timeDate = _Calendarhelper.getKeyFromDateInfo.call(void 0, parsedCurrentDay, hour);
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
                    children: _Calendarhelper.getTimeUnitString.call(void 0, hour - 1, timeDateFormat)
                  }
                ),
                renderItems({ dateInfo: parsedCurrentDay, hour, idx: 0 })
              ]
            },
            `${parsedCurrentDay.date}-${hour}`
          ))
        },
        parsedCurrentDay.date
      )
    ] })
  ] });
};
var DayInPlaceView_default = DayInPlaceView;


exports.default = DayInPlaceView_default;
