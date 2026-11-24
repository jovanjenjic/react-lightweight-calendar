import { JSX } from 'react';
import { Locale } from 'date-fns';

interface DateInfo {
    isCurrentDay: boolean;
    isCurrentMonth?: boolean;
    date: string;
    day: number;
    month: number;
    year: number;
    hour?: number;
    timeDate: string;
    timeDateUTC: string;
}
interface DateInfoFunction {
    dateInfo: DateInfo;
    idx: number;
    hour?: number;
}
interface DateInfoExtendedFunction {
    dateInfo: DateInfo;
    hour: number;
    idx: number;
}
interface PreparedDataWithoutTime {
    isStart: boolean;
    length: number;
    [key: string]: any;
}
interface PreparedDataWithTime {
    startMinute: number;
    endMinute: number;
    numberInRow?: number;
    margin?: string;
    width?: string;
    left?: string;
    [key: string]: any;
}
interface PreparedDataWithTimeFull {
    week: PreparedDataWithTime[];
    day: Record<string, PreparedDataWithTime>[];
}
interface PreparedDataWithTimeInPlace {
    [key: string]: any;
}
declare enum CurrentView {
    MONTH = "MONTH",
    WEEK = "WEEK",
    WEEK_TIME = "WEEK_TIME",
    DAY = "DAY",
    DAY_REVERSE = "DAY_REVERSE",
    WEEK_IN_PLACE = "WEEK_IN_PLACE",
    DAY_IN_PLACE = "DAY_IN_PLACE"
}
declare enum CellDisplayModeState {
    ALL_COLLAPSED = "ALL_COLLAPSED",
    ALL_EXPANDED = "ALL_EXPANDED",
    CUSTOM = "CUSTOM"
}
declare enum WeekStartsOn {
    SUNDAY = 0,
    MONDAY = 1,
    TUESDAY = 2,
    WEDNESDAY = 3,
    THURSDAY = 4,
    FRIDAY = 5,
    SATURDAY = 6
}
interface ColorDot {
    color: string;
    text: string;
    date: string;
    [key: string]: any;
}
interface ColorDotFull {
    dateKeys: Record<string, ColorDot>[] | object;
    colorKeys: Record<string, ColorDot>[] | object;
}
interface CellDisplayMode {
    [key: string]: {
        state: CellDisplayModeState;
        inactiveCells: string[];
    };
}
interface TimeFormat {
    day?: string;
    hour?: string;
    monthYear?: string;
}
interface TimeFormatModified {
    day: string;
    hour: string;
    monthYear: string;
}
interface CalendarProps {
    renderItems: ({ dateInfo, idx }: DateInfoFunction) => JSX.Element[];
    renderHeaderItems: (startDate: string, endDate?: string) => (JSX.Element | null)[];
    currentView: CurrentView;
    currentDate: string | Date;
    setCurrentDate?: (date: string | Date) => void;
    colorDots?: ColorDot[];
    onDayNumberClick: (day: string, event: React.MouseEvent<HTMLElement>) => void;
    onDayStringClick: (day: string | Date, event: React.MouseEvent<HTMLElement>) => void;
    onHourClick: (value: DateInfo | number, event: React.MouseEvent<HTMLElement>) => void;
    onColorDotClick: (value: ColorDot, event: React.MouseEvent<HTMLElement>) => void;
    onCellClick: (value: DateInfo, event: React.MouseEvent<HTMLElement>) => void;
    onCellHeaderClick: (value: DateInfo, event: React.MouseEvent<HTMLElement>) => void;
    timeDateFormat: TimeFormatModified;
    weekStartsOn: WeekStartsOn;
    locale: Locale;
    todayLabel: string;
}
interface CalendarWrapperProps {
    data?: Record<string, any>[];
    renderItem?: (data: Record<string, any>, isHovered: boolean) => JSX.Element;
    renderItemText?: (data: Record<string, any>) => JSX.Element;
    renderHeaderItem?: (data: Record<string, any>, extras: {
        gridColumn: string;
        isFromPrevious?: boolean;
        isFromNext?: boolean;
    }) => JSX.Element;
    renderHeaderItemText?: (data: Record<string, any>) => JSX.Element;
    disableHoverEffect?: boolean;
    currentDate?: string | Date;
    setCurrentDate?: (date: string | Date) => void;
    activeTimeDateField?: string;
    currentView?: CurrentView | string;
    cellDisplayMode?: CellDisplayMode;
    colorDots?: ColorDot[];
    onDayNumberClick?: (day: string, event: React.MouseEvent<HTMLElement>) => void;
    onDayStringClick?: (day: string | Date, event: React.MouseEvent<HTMLElement>) => void;
    onHourClick?: (value: DateInfo | number, event: React.MouseEvent<HTMLElement>) => void;
    onColorDotClick?: (value: ColorDot, event: React.MouseEvent<HTMLElement>) => void;
    onItemClick?: (item: Record<string, any>, event: React.MouseEvent<HTMLElement>) => void;
    onCellClick?: (value: DateInfo, event: React.MouseEvent<HTMLElement>) => void;
    onCellHeaderClick?: (value: DateInfo, event: React.MouseEvent<HTMLElement>) => void;
    timeDateFormat?: TimeFormat;
    weekStartsOn?: WeekStartsOn | number;
    locale?: Locale;
    todayLabel?: string;
}
interface CalendarHeaderProps {
    setCurrentDate: (date: string | Date) => void;
    currentView: CurrentView;
    currentDate: string | Date;
    timeDateFormat: TimeFormatModified;
    locale: Locale;
    todayLabel?: string;
}
interface CalculateStartAndEndMinuteFunc {
    startMinute: number;
    endMinute: number;
}
interface GetHeaderItemInfoFunc {
    gridColumn: string;
    isFromPrevious?: boolean;
    isFromNext?: boolean;
}
interface InitializePropsFunc {
    cellDisplayMode?: CellDisplayMode;
    timeDateFormat?: TimeFormat;
    onDayNumberClick?: (day: string, event: React.MouseEvent<HTMLElement>) => void;
    onDayStringClick?: (day: string | Date, event: React.MouseEvent<HTMLElement>) => void;
    onHourClick?: (value: DateInfo | number, event: React.MouseEvent<HTMLElement>) => void;
    onColorDotClick?: (value: ColorDot, event: React.MouseEvent<HTMLElement>) => void;
    onItemClick?: ((item: Record<string, any>, event: React.MouseEvent<HTMLElement>) => void);
    onCellClick?: (value: DateInfo, event: React.MouseEvent<HTMLElement>) => void;
    onCellHeaderClick?: (value: DateInfo, event: React.MouseEvent<HTMLElement>) => void;
    weekStartsOn?: WeekStartsOn;
    currentDate?: string | Date;
    currentView?: CurrentView | string;
    activeTimeDateField?: string;
    data?: Record<string, any>[];
    locale?: Locale;
    todayLabel?: string;
}
interface InitializePropsRetFunc {
    cellDisplayModeModified: CellDisplayMode;
    onDayNumberClickModified: (day: string, event: React.MouseEvent<HTMLElement>) => void;
    onDayStringClickModified: (day: string | Date, event: React.MouseEvent<HTMLElement>) => void;
    onHourClickModified: (value: DateInfo | number, event: React.MouseEvent<HTMLElement>) => void;
    onColorDotClickModified: (value: ColorDot, event: React.MouseEvent<HTMLElement>) => void;
    onItemClickModified: (item: Record<string, any>, event: React.MouseEvent<HTMLElement>) => void;
    onCellClickModified: (value: DateInfo, event: React.MouseEvent<HTMLElement>) => void;
    onCellHeaderClickModified: (value: DateInfo, event: React.MouseEvent<HTMLElement>) => void;
    timeDateFormatModified: TimeFormatModified;
    weekStartsOnModified: WeekStartsOn;
    currentDateModified: string | Date;
    currentViewModified: CurrentView;
    activeTimeDateFieldModified: string;
    dataModified: Record<string, any>[];
    localeModified: Locale;
    todayLabelModified: string;
}

export { CellDisplayModeState, CurrentView, WeekStartsOn };
export type { CalculateStartAndEndMinuteFunc, CalendarHeaderProps, CalendarProps, CalendarWrapperProps, CellDisplayMode, ColorDot, ColorDotFull, DateInfo, DateInfoExtendedFunction, DateInfoFunction, GetHeaderItemInfoFunc, InitializePropsFunc, InitializePropsRetFunc, PreparedDataWithTime, PreparedDataWithTimeFull, PreparedDataWithTimeInPlace, PreparedDataWithoutTime, TimeFormat, TimeFormatModified };
