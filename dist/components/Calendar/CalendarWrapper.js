"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var _jsxruntime = require('react/jsx-runtime');
var _classnames = require('classnames'); var _classnames2 = _interopRequireDefault(_classnames);
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
require('../../styles/styles.css');








var _index = require('../../utils/index');
var _StyleGuide = require('../StyleGuide/StyleGuide'); var _StyleGuide2 = _interopRequireDefault(_StyleGuide);






var _Calendarhelper = require('./Calendar.helper');


var _Calendartypes = require('./Calendar.types');
var _CalendarComponent = require('./CalendarComponent'); var _CalendarComponent2 = _interopRequireDefault(_CalendarComponent);
const CalendarWrapper = ({
  data,
  renderItem,
  renderItemText,
  renderHeaderItem,
  renderHeaderItemText,
  disableHoverEffect,
  currentDate,
  setCurrentDate,
  activeTimeDateField,
  currentView,
  cellDisplayMode,
  colorDots,
  onDayNumberClick,
  onDayStringClick,
  onHourClick,
  onColorDotClick,
  onItemClick,
  onCellClick,
  onCellHeaderClick,
  timeDateFormat,
  weekStartsOn,
  locale,
  todayLabel
}) => {
  const {
    cellDisplayModeModified,
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
    dataModified,
    activeTimeDateFieldModified,
    localeModified,
    todayLabelModified
  } = _Calendarhelper.initializeProps.call(void 0, {
    cellDisplayMode,
    timeDateFormat,
    onDayNumberClick,
    onDayStringClick,
    onHourClick,
    onColorDotClick,
    onCellHeaderClick,
    onItemClick,
    onCellClick,
    weekStartsOn,
    currentDate,
    currentView,
    activeTimeDateField,
    data,
    locale,
    todayLabel
  });
  const [hoveredElement, setHoveredElement] = _react2.default.useState(0);
  const [startIntervalKey, endIntervalKey] = (_nullishCoalesce(activeTimeDateFieldModified, () => ( ""))).split("-").map((str) => str.replace(/\s/g, ""));
  const preparedData = _react2.default.useMemo(() => {
    switch (currentViewModified) {
      case _Calendartypes.CurrentView.DAY_REVERSE:
        return _index.prepareCalendarDataWithTimeReverse.call(void 0, 
          dataModified,
          activeTimeDateFieldModified
        );
      case _Calendartypes.CurrentView.DAY:
      case _Calendartypes.CurrentView.WEEK_TIME:
        return _index.prepareCalendarDataWithTime.call(void 0, 
          dataModified,
          activeTimeDateFieldModified
        );
      case _Calendartypes.CurrentView.MONTH:
      case _Calendartypes.CurrentView.WEEK:
        return _index.prepareCalendarData.call(void 0, 
          dataModified,
          activeTimeDateFieldModified,
          weekStartsOnModified
        );
      case _Calendartypes.CurrentView.DAY_IN_PLACE:
      case _Calendartypes.CurrentView.WEEK_IN_PLACE:
        return _index.prepareCalendarDataInPlace.call(void 0, 
          dataModified,
          activeTimeDateFieldModified
        );
    }
  }, [
    dataModified,
    activeTimeDateFieldModified,
    currentViewModified,
    weekStartsOnModified
  ]);
  const renderMonthWeekDayInPlaceWeekInPlaceItems = ({
    dateInfo,
    idx,
    hour
  }) => {
    const key = hour || hour === 0 ? _Calendarhelper.getKeyFromDateInfo.call(void 0, dateInfo, hour) : _index.formatFullDate.call(void 0, new Date(dateInfo.date));
    const isCollapsed = _Calendarhelper.shouldCollapse.call(void 0, 
      cellDisplayModeModified,
      currentViewModified,
      key
    );
    const arrayData = (isCollapsed ? _optionalChain([preparedData, 'optionalAccess', _ => _[key], 'optionalAccess', _2 => _2.slice, 'call', _3 => _3(-1)]) : _optionalChain([preparedData, 'optionalAccess', _4 => _4[key]])) || [];
    return arrayData.map((preparedDataItem, index) => {
      const shoudShow = _Calendarhelper.shouldShowItem.call(void 0, 
        preparedDataItem,
        key,
        cellDisplayModeModified,
        currentViewModified,
        preparedData,
        currentDateModified
      );
      const rightMargin = [
        _Calendartypes.CurrentView.DAY_IN_PLACE,
        _Calendartypes.CurrentView.WEEK_IN_PLACE
      ].includes(currentViewModified);
      return shoudShow ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
        "div",
        {
          style: {
            gridColumn: `${idx + 1} / ${idx + (isCollapsed ? 1 : _optionalChain([preparedDataItem, 'optionalAccess', _5 => _5.length]) || 1) + 1}`
          },
          onMouseEnter: () => !disableHoverEffect && setHoveredElement(_optionalChain([preparedDataItem, 'optionalAccess', _6 => _6.id])),
          onMouseLeave: () => !disableHoverEffect && setHoveredElement(0),
          className: _classnames2.default.call(void 0, 
            "item",
            hoveredElement === preparedDataItem.id && "item--hovered",
            rightMargin && "item--right-margin"
          ),
          onClick: (e) => {
            e.stopPropagation();
            onItemClickModified(preparedDataItem, e);
          },
          children: renderItem ? renderItem(preparedDataItem, hoveredElement === preparedDataItem.id) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
            "div",
            {
              className: _classnames2.default.call(void 0, 
                "sub-item",
                hoveredElement === preparedDataItem.id && "sub-item--hovered",
                _optionalChain([preparedDataItem, 'optionalAccess', _7 => _7.isStart]) && "sub-item--left-border"
              ),
              style: {
                backgroundColor: _optionalChain([preparedDataItem, 'optionalAccess', _8 => _8.bgColor]),
                color: _optionalChain([preparedDataItem, 'optionalAccess', _9 => _9.textColor])
              },
              children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { children: renderItemText ? renderItemText(preparedDataItem) : /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
                /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { children: _optionalChain([preparedDataItem, 'optionalAccess', _10 => _10.title]) }),
                /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { children: [
                  _index.formatMonthDayHour.call(void 0, 
                    new Date(preparedDataItem[startIntervalKey])
                  ),
                  endIntervalKey && `${" - " + _index.formatMonthDayHour.call(void 0, 
                    new Date(preparedDataItem[endIntervalKey])
                  )}`
                ] })
              ] }) })
            }
          )
        },
        `${index}-${dateInfo.date}`
      ) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _jsxruntime.Fragment, {});
    });
  };
  const renderDayWeekTimeItems = ({
    dateInfo
  }) => {
    const key = _index.formatFullDate.call(void 0, new Date(dateInfo.date));
    const isDayReverseView = currentView === _Calendartypes.CurrentView.DAY_REVERSE;
    return (preparedData.day[key] || []).map(
      (preparedDataItem, index) => {
        return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "div",
          {
            style: {
              [!isDayReverseView ? "gridRow" : "gridColumn"]: `${preparedDataItem.startMinute} / ${preparedDataItem.endMinute}`,
              width: !isDayReverseView && preparedDataItem.width,
              left: !isDayReverseView && preparedDataItem.left,
              margin: !isDayReverseView && preparedDataItem.margin
            },
            onMouseEnter: () => !disableHoverEffect && setHoveredElement(_optionalChain([preparedDataItem, 'optionalAccess', _11 => _11.id])),
            onMouseLeave: () => !disableHoverEffect && setHoveredElement(0),
            className: _classnames2.default.call(void 0, 
              "item",
              hoveredElement === preparedDataItem.id && "item--hovered"
            ),
            onClick: (e) => onItemClickModified(preparedDataItem, e),
            children: renderItem ? renderItem(
              preparedDataItem,
              hoveredElement === preparedDataItem.id
            ) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
              "div",
              {
                className: _classnames2.default.call(void 0, 
                  "sub-item",
                  hoveredElement === preparedDataItem.id && "sub-item--hovered",
                  preparedDataItem.endMinute - preparedDataItem.startMinute <= 40 && "sub-item--small-size"
                ),
                style: {
                  backgroundColor: _optionalChain([preparedDataItem, 'optionalAccess', _12 => _12.bgColor]),
                  color: _optionalChain([preparedDataItem, 'optionalAccess', _13 => _13.textColor])
                },
                children: renderItemText ? renderItemText(preparedDataItem) : /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
                  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { children: _optionalChain([preparedDataItem, 'optionalAccess', _14 => _14.title]) }),
                  /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { children: [
                    _index.formatHour.call(void 0, new Date(preparedDataItem[startIntervalKey])),
                    endIntervalKey && `${" - " + _index.formatHour.call(void 0, new Date(preparedDataItem[endIntervalKey]))}`
                  ] })
                ] })
              }
            )
          },
          `${index}-${dateInfo.date}`
        );
      }
    );
  };
  const renderHeaderItems = (startDate, endDate) => {
    const weekItems = preparedData;
    return weekItems.week.map((preparedDataItem, index) => {
      const { gridColumn, isFromPrevious, isFromNext } = _Calendarhelper.getHeaderItemInfo.call(void 0, 
        startDate,
        endDate || startDate,
        preparedDataItem[startIntervalKey],
        preparedDataItem[endIntervalKey],
        weekStartsOnModified
      );
      if (!gridColumn) {
        return null;
      }
      return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
        "div",
        {
          style: {
            gridColumn
          },
          className: "item",
          children: renderHeaderItem ? renderHeaderItem(preparedDataItem, {
            gridColumn,
            isFromPrevious,
            isFromNext
          }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
            "div",
            {
              className: _classnames2.default.call(void 0, 
                "sub-item",
                isFromPrevious && "sub-item--left-arrow",
                isFromNext && "sub-item--right-arrow"
              ),
              onClick: (e) => {
                e.stopPropagation();
                onItemClickModified(preparedDataItem, e);
              },
              style: {
                backgroundColor: _optionalChain([preparedDataItem, 'optionalAccess', _15 => _15.bgColor]),
                color: _optionalChain([preparedDataItem, 'optionalAccess', _16 => _16.textColor])
              },
              children: renderHeaderItemText ? renderHeaderItemText(preparedDataItem) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { children: _optionalChain([preparedDataItem, 'optionalAccess', _17 => _17.title]) })
            }
          )
        },
        `${index}-${startDate}`
      );
    });
  };
  const renderItems = _react2.default.useMemo(() => {
    switch (currentViewModified) {
      case _Calendartypes.CurrentView.DAY:
      case _Calendartypes.CurrentView.DAY_REVERSE:
      case _Calendartypes.CurrentView.WEEK_TIME:
        return renderDayWeekTimeItems;
      case _Calendartypes.CurrentView.MONTH:
      case _Calendartypes.CurrentView.WEEK:
      case _Calendartypes.CurrentView.WEEK_IN_PLACE:
      case _Calendartypes.CurrentView.DAY_IN_PLACE:
        return renderMonthWeekDayInPlaceWeekInPlaceItems;
      default:
        return renderMonthWeekDayInPlaceWeekInPlaceItems;
    }
  }, [
    currentViewModified,
    cellDisplayMode,
    hoveredElement,
    activeTimeDateFieldModified,
    disableHoverEffect,
    weekStartsOn,
    preparedData
  ]);
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _StyleGuide2.default, {}),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      _CalendarComponent2.default,
      {
        renderItems,
        renderHeaderItems,
        setCurrentDate,
        currentView: currentViewModified,
        colorDots,
        currentDate: currentDateModified,
        onDayNumberClick: onDayNumberClickModified,
        onDayStringClick: onDayStringClickModified,
        onHourClick: onHourClickModified,
        onColorDotClick: onColorDotClickModified,
        onCellClick: onCellClickModified,
        onCellHeaderClick: onCellHeaderClickModified,
        timeDateFormat: timeDateFormatModified,
        weekStartsOn: weekStartsOnModified,
        locale: localeModified,
        todayLabel: todayLabelModified
      }
    )
  ] });
};
var CalendarWrapper_default = CalendarWrapper;


exports.default = CalendarWrapper_default;
