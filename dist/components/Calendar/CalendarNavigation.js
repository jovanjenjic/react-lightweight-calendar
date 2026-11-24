"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var _jsxruntime = require('react/jsx-runtime');
var _datefns = require('date-fns');
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _index = require('../../utils/index');
var _Button = require('../Button/Button'); var _Button2 = _interopRequireDefault(_Button);
var _Calendarconstants = require('./Calendar.constants');
var _Calendartypes = require('./Calendar.types');
const CalendarNavigation = ({
  setCurrentDate,
  currentDate,
  currentView,
  timeDateFormat,
  locale,
  todayLabel
}) => {
  const getNextTimeUnit = _react2.default.useMemo(() => {
    switch (currentView) {
      case _Calendartypes.CurrentView.MONTH:
        return "months";
      case _Calendartypes.CurrentView.WEEK:
        return "weeks";
      case _Calendartypes.CurrentView.WEEK_TIME:
      case _Calendartypes.CurrentView.WEEK_IN_PLACE:
        return "weeks";
      case _Calendartypes.CurrentView.DAY:
      case _Calendartypes.CurrentView.DAY_REVERSE:
      case _Calendartypes.CurrentView.DAY_IN_PLACE:
        return "days";
      default:
        return "months";
    }
  }, [currentView]);
  const changeMonth = (type) => {
    const duration = { [getNextTimeUnit]: 1 };
    const newDate = type === "add" ? _index.formatFullDate.call(void 0, _datefns.add.call(void 0, new Date(currentDate), duration)) : _index.formatFullDate.call(void 0, _datefns.sub.call(void 0, new Date(currentDate), duration));
    setCurrentDate(newDate);
  };
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { "data-cy": "CalendarNavigation", className: "calendar__navigation", children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      _Button2.default,
      {
        dataCy: "NavigationNowButton",
        label: todayLabel,
        onClick: () => setCurrentDate(_index.formatFullDate.call(void 0, /* @__PURE__ */ new Date())),
        withBorder: true
      }
    ),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "calendar__navigation-arrow-buttons", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
        _Button2.default,
        {
          dataCy: "NavigationLeftButton",
          arrowSide: "left",
          onClick: () => changeMonth("sub")
        }
      ),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
        _Button2.default,
        {
          dataCy: "NavigationRightButton",
          arrowSide: "right",
          onClick: () => changeMonth("add")
        }
      )
    ] }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "calendar__navigation__month-text", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "data-cy": "NavigationTimeDateText", children: _datefns.format.call(void 0, 
      new Date(currentDate),
      _optionalChain([timeDateFormat, 'optionalAccess', _ => _.monthYear]) || _Calendarconstants.TimeDateFormat.MONTH_YEAR,
      { locale }
    ) }) })
  ] });
};
var CalendarNavigation_default = CalendarNavigation;


exports.default = CalendarNavigation_default;
