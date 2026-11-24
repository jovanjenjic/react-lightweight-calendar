"use strict";Object.defineProperty(exports, "__esModule", {value: true});var CurrentView = /* @__PURE__ */ ((CurrentView2) => {
  CurrentView2["MONTH"] = "MONTH";
  CurrentView2["WEEK"] = "WEEK";
  CurrentView2["WEEK_TIME"] = "WEEK_TIME";
  CurrentView2["DAY"] = "DAY";
  CurrentView2["DAY_REVERSE"] = "DAY_REVERSE";
  CurrentView2["WEEK_IN_PLACE"] = "WEEK_IN_PLACE";
  CurrentView2["DAY_IN_PLACE"] = "DAY_IN_PLACE";
  return CurrentView2;
})(CurrentView || {});
var CellDisplayModeState = /* @__PURE__ */ ((CellDisplayModeState2) => {
  CellDisplayModeState2["ALL_COLLAPSED"] = "ALL_COLLAPSED";
  CellDisplayModeState2["ALL_EXPANDED"] = "ALL_EXPANDED";
  CellDisplayModeState2["CUSTOM"] = "CUSTOM";
  return CellDisplayModeState2;
})(CellDisplayModeState || {});
var WeekStartsOn = /* @__PURE__ */ ((WeekStartsOn2) => {
  WeekStartsOn2[WeekStartsOn2["SUNDAY"] = 0] = "SUNDAY";
  WeekStartsOn2[WeekStartsOn2["MONDAY"] = 1] = "MONDAY";
  WeekStartsOn2[WeekStartsOn2["TUESDAY"] = 2] = "TUESDAY";
  WeekStartsOn2[WeekStartsOn2["WEDNESDAY"] = 3] = "WEDNESDAY";
  WeekStartsOn2[WeekStartsOn2["THURSDAY"] = 4] = "THURSDAY";
  WeekStartsOn2[WeekStartsOn2["FRIDAY"] = 5] = "FRIDAY";
  WeekStartsOn2[WeekStartsOn2["SATURDAY"] = 6] = "SATURDAY";
  return WeekStartsOn2;
})(WeekStartsOn || {});




exports.CellDisplayModeState = CellDisplayModeState; exports.CurrentView = CurrentView; exports.WeekStartsOn = WeekStartsOn;
