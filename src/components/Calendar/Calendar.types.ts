export interface DateInfo {
  isCurrentDay: boolean;
  isCurrentMonth?: boolean;
  date: string;
  day: number;
  month: number;
  year: number;
  hour?: number;
  cellKey?: string;
}
export interface DateInfoFunction {
  dateInfo: DateInfo;
  idx: number;
  hour?: number;
}
export interface DateInfoExtendedFunction {
  dateInfo: DateInfo;
  hour: number;
  idx: number;
}

export interface PreparedDataWithoutTime {
  isStart: boolean;
  length: number;
  // eslint-disable-next-line
  [key: string]: any;
}

export interface PreparedDataWithTime {
  startMinute: number;
  endMinute: number;
  numberInRow?: number;
  margin?: string;
  width?: string;
  left?: string;
  // eslint-disable-next-line
  [key: string]: any;
}
export interface PreparedDataWithTimeFull {
  week: PreparedDataWithTime[];
  day: Record<string, PreparedDataWithTime>[];
}

export interface PreparedDataWithTimeInPlace {
  // eslint-disable-next-line
  [key: string]: any;
}

export enum CurrentView {
  MONTH = 'MONTH',
  WEEK = 'WEEK',
  WEEK_TIME = 'WEEK_TIME',
  DAY = 'DAY',
  WEEK_IN_PLACE = 'WEEK_IN_PLACE',
  DAY_IN_PLACE = 'DAY_IN_PLACE',
}

export enum CellDisplayModeState {
  ALL_COLLAPSED = 'ALL_COLLAPSED',
  ALL_EXPANDED = 'ALL_EXPANDED',
  CUSTOM = 'CUSTOM',
}

export enum WeekStartsOn {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

export interface ColorDot {
  color: string;
  text: string;
  date: string;
  // eslint-disable-next-line
  [key: string]: any;
}

export interface ColorDotFull {
  dateKeys: Record<string, ColorDot>[] | object;
  colorKeys: Record<string, ColorDot>[] | object;
}

export interface CellDisplayMode {
  [key: string]: {
    state: CellDisplayModeState;
    inactiveCells: string[];
  };
}

export interface TimeFormat {
  day: string;
  hour: string;
  monthYear: string;
  weekStartsOn?: WeekStartsOn;
}

export interface CalendarProps {
  renderItems: ({ dateInfo, idx }: DateInfoFunction) => JSX.Element[];
  renderHeaderItems: (
    startDate: string,
    endDate?: string,
  ) => (JSX.Element | null)[];
  currentView: CurrentView;
  currentDate: string | Date;
  setCurrentDate?: (date: string | Date) => void;
  colorDots?: ColorDot[];
  onDayNumberClick: (day: string) => void;
  onDayStringClick: (day: string | Date) => void;
  onHourClick: (value: DateInfo | number) => void;
  onColorDotClick: (value: ColorDot) => void;
  onCellClick: (value: DateInfo) => void;
  timeDateFormat: TimeFormat;
}

export interface CalendarWrapperProps {
  // eslint-disable-next-line
  data: Record<string, any>[];
  // eslint-disable-next-line
  renderItem?: (data: Record<string, any>, isHovered: boolean) => JSX.Element;
  // eslint-disable-next-line
  renderItemText?: (data: Record<string, any>) => JSX.Element;
  renderHeaderItem?: (
    // eslint-disable-next-line
    data: Record<string, any>,
    extras: {
      gridColumn: string;
      isFromPrevious?: boolean;
      isFromNext?: boolean;
    },
  ) => JSX.Element;
  // eslint-disable-next-line
  renderHeaderItemText?: (data: Record<string, any>) => JSX.Element;
  enableHoverEffect?: boolean;
  currentDate: string | Date;
  setCurrentDate?: (date: string | Date) => void;
  activeTimeDateField: string;
  currentView: CurrentView;
  cellDisplayMode?: CellDisplayMode;
  colorDots?: ColorDot[];
  onDayNumberClick?: (day: string) => void;
  onDayStringClick?: (day: string | Date) => void;
  onHourClick?: (value: DateInfo | number) => void;
  onColorDotClick?: (value: ColorDot) => void;
  // eslint-disable-next-line
  onItemClick?: (item: Record<string, any>) => void;
  onCellClick?: (value: DateInfo) => void;
  timeDateFormat?: TimeFormat;
}

export interface CalendarHeaderProps {
  setCurrentDate: (date: string | Date) => void;
  currentView: CurrentView;
  currentDate: string | Date;
  timeDateFormat: TimeFormat;
}

export interface CalculateStartAndEndMinuteFunc {
  startMinute: number;
  endMinute: number;
}

export interface GetHeaderItemInfoFunc {
  gridColumn: string;
  isFromPrevious?: boolean;
  isFromNext?: boolean;
}

export interface InitializePropsFunc {
  cellDisplayMode: CellDisplayMode | undefined;
  timeDateFormat: TimeFormat | undefined;
  onDayNumberClick: ((day: string) => void) | undefined;
  onDayStringClick: ((day: string | Date) => void) | undefined;
  onHourClick: ((value: DateInfo | number) => void) | undefined;
  onColorDotClick: ((value: ColorDot) => void) | undefined;
  // eslint-disable-next-line
  onItemClick: ((item: Record<string, any>) => void) | undefined;
  onCellClick: ((value: DateInfo) => void) | undefined;
}
export interface InitializePropsRetFunc {
  cellDisplayModeModified: CellDisplayMode;
  onDayNumberClickModified: (day: string) => void;
  onDayStringClickModified: (day: string | Date) => void;
  onHourClickModified: (value: DateInfo | number) => void;
  onColorDotClickModified: (value: ColorDot) => void;
  // eslint-disable-next-line
  onItemClickModified: (item: Record<string, any>) => void;
  onCellClickModified: (value: DateInfo) => void;
  timeDateFormatModified: TimeFormat;
}
