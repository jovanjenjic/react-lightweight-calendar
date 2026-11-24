import { CalculateStartAndEndMinuteFunc, GetHeaderItemInfoFunc, DateInfo, TimeFormat, InitializePropsFunc, InitializePropsRetFunc, CellDisplayMode, CurrentView, PreparedDataWithoutTime } from './Calendar.types.js';
import 'react';
import 'date-fns';

declare const getTimeUnitString: (hour: number, timeDateFormat: TimeFormat) => string;
declare const getKeyFromDateInfo: (dateInfo: DateInfo, hour: number) => string;
declare const shouldShowItem: (preparedDataItem: PreparedDataWithoutTime, dateKey: string, cellDisplayMode: CellDisplayMode, currentView: CurrentView, preparedData: any, currentDate: string | Date) => boolean;
declare const shouldCollapse: (cellDisplayMode: CellDisplayMode, currentView: CurrentView, dateKey: string) => boolean;
declare const getHeaderItemInfo: (startWeekDate: string, endWeekDate: string, startIntervalDate: string, endIntervalDate: string, weekStartsOn: number) => GetHeaderItemInfoFunc;
declare const calculateStartAndEndMinute: (startDate: Date, endDate: Date) => CalculateStartAndEndMinuteFunc;
declare const initializeProps: ({ cellDisplayMode, timeDateFormat, weekStartsOn, onDayNumberClick, onDayStringClick, onHourClick, onColorDotClick, onItemClick, onCellClick, onCellHeaderClick, currentDate, currentView, activeTimeDateField, data, locale, todayLabel, }: InitializePropsFunc) => InitializePropsRetFunc;
declare const onDayStringClickHandler: (currentDate: any, days: any, weekStartsOn: any) => string;

export { calculateStartAndEndMinute, getHeaderItemInfo, getKeyFromDateInfo, getTimeUnitString, initializeProps, onDayStringClickHandler, shouldCollapse, shouldShowItem };
