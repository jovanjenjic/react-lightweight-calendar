"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var _jsxruntime = require('react/jsx-runtime');
var _react = require('react');
var _utils = require('../../utils');
var _Calendartypes = require('./Calendar.types');
var _CalendarNavigation = require('./CalendarNavigation'); var _CalendarNavigation2 = _interopRequireDefault(_CalendarNavigation);
var _DayInPlaceView = require('./DayInPlaceView/DayInPlaceView'); var _DayInPlaceView2 = _interopRequireDefault(_DayInPlaceView);
var _DayReverseView = require('./DayReverseView/DayReverseView'); var _DayReverseView2 = _interopRequireDefault(_DayReverseView);
var _DayView = require('./DayView/DayView'); var _DayView2 = _interopRequireDefault(_DayView);
var _MonthView = require('./MonthView/MonthView'); var _MonthView2 = _interopRequireDefault(_MonthView);
var _WeekTimeInPlaceView = require('./WeekTimeInPlaceView/WeekTimeInPlaceView'); var _WeekTimeInPlaceView2 = _interopRequireDefault(_WeekTimeInPlaceView);
var _WeekTimeView = require('./WeekTimeView/WeekTimeView'); var _WeekTimeView2 = _interopRequireDefault(_WeekTimeView);
var _WeekView = require('./WeekView/WeekView'); var _WeekView2 = _interopRequireDefault(_WeekView);
const CalendarComponent = ({
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
  todayLabel
}) => {
  const preparedColorDots = _react.useMemo.call(void 0, () => {
    const newValue = { dateKeys: {}, colorKeys: {} };
    (colorDots || []).forEach((dot) => {
      newValue.dateKeys[dot.date] = dot;
      newValue.colorKeys[dot.color] = dot;
    });
    return newValue;
  }, [colorDots]);
  const leftMargin = [
    _Calendartypes.CurrentView.DAY,
    _Calendartypes.CurrentView.DAY_IN_PLACE,
    _Calendartypes.CurrentView.WEEK_TIME,
    _Calendartypes.CurrentView.WEEK_IN_PLACE
  ].includes(currentView);
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: leftMargin ? "calendar--left-margin" : "", children: [
    !!setCurrentDate && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      _CalendarNavigation2.default,
      {
        currentDate,
        currentView,
        setCurrentDate,
        timeDateFormat,
        locale,
        todayLabel
      }
    ),
    currentView === _Calendartypes.CurrentView.MONTH && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      _MonthView2.default,
      {
        preparedColorDots,
        renderItems,
        currentView,
        currentDate,
        onDayNumberClick,
        onDayStringClick,
        onColorDotClick,
        onCellClick,
        timeDateFormat,
        weekStartsOn,
        locale
      }
    ),
    currentView === _Calendartypes.CurrentView.WEEK && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      _WeekView2.default,
      {
        preparedColorDots,
        renderItems,
        currentDate,
        onDayNumberClick,
        onDayStringClick,
        onColorDotClick,
        onCellClick,
        timeDateFormat,
        weekStartsOn,
        locale
      }
    ),
    currentView === _Calendartypes.CurrentView.WEEK_TIME && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      _WeekTimeView2.default,
      {
        preparedColorDots,
        renderItems,
        renderHeaderItems,
        currentDate,
        onDayNumberClick,
        onDayStringClick,
        onColorDotClick,
        onCellClick,
        onCellHeaderClick,
        timeDateFormat,
        onHourClick,
        weekStartsOn,
        locale
      }
    ),
    currentView === _Calendartypes.CurrentView.DAY && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      _DayView2.default,
      {
        preparedColorDots,
        renderItems,
        renderHeaderItems,
        currentDate,
        onDayNumberClick,
        onDayStringClick,
        onColorDotClick,
        onCellClick,
        onCellHeaderClick,
        timeDateFormat,
        onHourClick,
        locale
      }
    ),
    currentView === _Calendartypes.CurrentView.DAY_REVERSE && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      _DayReverseView2.default,
      {
        preparedColorDots,
        renderItems,
        currentDate,
        onDayNumberClick,
        onDayStringClick,
        onColorDotClick,
        onCellClick,
        timeDateFormat,
        onHourClick,
        locale
      }
    ),
    currentView === _Calendartypes.CurrentView.WEEK_IN_PLACE && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      _WeekTimeInPlaceView2.default,
      {
        preparedColorDots,
        renderItems,
        currentDate,
        onDayNumberClick,
        onDayStringClick,
        onColorDotClick,
        onCellClick,
        onCellHeaderClick,
        timeDateFormat,
        onHourClick,
        weekStartsOn,
        locale
      }
    ),
    currentView === _Calendartypes.CurrentView.DAY_IN_PLACE && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      _DayInPlaceView2.default,
      {
        preparedColorDots,
        renderItems,
        currentDate,
        onDayNumberClick,
        onDayStringClick,
        onColorDotClick,
        onCellClick,
        onCellHeaderClick,
        timeDateFormat,
        onHourClick,
        locale
      }
    ),
    !_utils.isEmptyObject.call(void 0, preparedColorDots) && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "data-cy": "ColorDots", className: "calendar-color-dots-legend", children: Object.keys(preparedColorDots.colorKeys).map((color) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
      "div",
      {
        className: "calendar-color-dots-legend__flex",
        onClick: (e) => onColorDotClick(_optionalChain([preparedColorDots, 'optionalAccess', _ => _.colorKeys, 'access', _2 => _2[color]]), e),
        children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
            "p",
            {
              style: { background: color },
              className: "calendar-color-dots-legend__flex__color-dot"
            }
          ),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "p", { className: "calendar-color-dots-legend__flex__text", children: _optionalChain([preparedColorDots, 'optionalAccess', _3 => _3.colorKeys, 'access', _4 => _4[color], 'optionalAccess', _5 => _5.text]) })
        ]
      },
      color
    )) })
  ] });
};
var CalendarComponent_default = CalendarComponent;


exports.default = CalendarComponent_default;
