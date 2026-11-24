import { WeekStartsOn, PreparedDataWithoutTime, PreparedDataWithTimeInPlace, PreparedDataWithTimeFull } from '../components/Calendar/Calendar.types.js';
import 'react';
import 'date-fns';

declare const formatFullDate: (date: Date) => string;
declare const formatFullDateTime: (date: Date) => string;
declare const formatHour: (date: Date) => string;
declare const formatMonthDayHour: (date: Date) => string;
declare const dayInWeekBasedOnWeekStarts: (timeDate: string, weekStartsOn?: number) => number;
declare const getAllDaysInMonth: (month: any) => string[];
/**
 * Based on the currently selected field in the configuration (eg `startTime` or `startTime-endTime`),
 * a corresponding array is formed that will be displayed on the calendar.
 * Used for MONTH and WEEK view
 * @param calendarData - Array of data for calendar view
 * @param activeTimeDateField - Current active field (startTime, endTime, startTime-endTIme, etc...)
 * @param weekStartsOn - By default week starts on Monday
 * @returns - Prepared array of data for calendar view
 */
declare const prepareCalendarData: (calendarData: Record<string, any>[], activeTimeDateField: string, weekStartsOn: WeekStartsOn) => Record<string, PreparedDataWithoutTime[]>[];
/**
 * Based on the currently selected field in the configuration (eg `startTime` or `startTime-endTime`),
 * a corresponding array is formed that will be displayed on the calendar.
 * Used for DAY and WEEK_TIME
 * @param calendarData - Array of data for calendar view
 * @param activeTimeDateField - Current active field (startTime, endTime, startTime-endTIme, etc...)
 * @returns - Prepared array of data for calendar view
 */
declare const prepareCalendarDataWithTime: (calendarData: Record<string, any>[], activeTimeDateField: string) => PreparedDataWithTimeFull;
/**
 * Based on the currently selected field in the configuration (eg `startTime` or `startTime-endTime`),
 * a corresponding array is formed that will be displayed on the calendar.
 * Used for DAY_IN_PLACE and WEEK_IN_PLACE views
 * @param calendarData - Array of data for calendar view
 * @param activeTimeDateField - Current active field (startTime, endTime, startTime-endTIme, etc...)
 * @returns - Prepared array of data for calendar view
 */
declare const prepareCalendarDataInPlace: (calendarData: Record<string, any>[], activeTimeDateField: string) => PreparedDataWithTimeInPlace;
/**
 * Based on the currently selected field in the configuration (eg `startTime` or `startTime-endTime`),
 * a corresponding array is formed that will be displayed on the calendar.
 * Used for DAY and WEEK_TIME
 * @param calendarData - Array of data for calendar view
 * @param activeTimeDateField - Current active field (startTime, endTime, startTime-endTIme, etc...)
 * @returns - Prepared array of data for calendar view
 */
declare const prepareCalendarDataWithTimeReverse: (calendarData: Record<string, any>[], activeTimeDateField: string) => PreparedDataWithTimeFull;
declare const isEqualValues: (value: any, other: any) => boolean;
declare const isEmptyObject: (value: any) => boolean;

export { dayInWeekBasedOnWeekStarts, formatFullDate, formatFullDateTime, formatHour, formatMonthDayHour, getAllDaysInMonth, isEmptyObject, isEqualValues, prepareCalendarData, prepareCalendarDataInPlace, prepareCalendarDataWithTime, prepareCalendarDataWithTimeReverse };
