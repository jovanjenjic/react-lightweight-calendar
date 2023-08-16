export interface DateInfo {
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
  DAY_REVERSE = 'DAY_REVERSE',
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
  day?: string;
  hour?: string;
  monthYear?: string;
}

export interface TimeFormatModified {
  day: string;
  hour: string;
  monthYear: string;
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
  onDayNumberClick: (day: string, event: React.MouseEvent<HTMLElement>) => void;
  onDayStringClick: (
    day: string | Date,
    event: React.MouseEvent<HTMLElement>,
  ) => void;
  onHourClick: (
    value: DateInfo | number,
    event: React.MouseEvent<HTMLElement>,
  ) => void;
  onColorDotClick: (
    value: ColorDot,
    event: React.MouseEvent<HTMLElement>,
  ) => void;
  onCellClick: (value: DateInfo, event: React.MouseEvent<HTMLElement>) => void;
  onCellHeaderClick: (
    value: DateInfo,
    event: React.MouseEvent<HTMLElement>,
  ) => void;
  timeDateFormat: TimeFormatModified;
  weekStartsOn: WeekStartsOn;
}

export interface CalendarWrapperProps {
  // eslint-disable-next-line
  data?: Record<string, any>[];
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
  disableHoverEffect?: boolean;
  currentDate?: string | Date;
  setCurrentDate?: (date: string | Date) => void;
  activeTimeDateField?: string;
  currentView?: CurrentView | string;
  cellDisplayMode?: CellDisplayMode;
  colorDots?: ColorDot[];
  onDayNumberClick?: (
    day: string,
    event: React.MouseEvent<HTMLElement>,
  ) => void;
  onDayStringClick?: (
    day: string | Date,
    event: React.MouseEvent<HTMLElement>,
  ) => void;
  onHourClick?: (
    value: DateInfo | number,
    event: React.MouseEvent<HTMLElement>,
  ) => void;
  onColorDotClick?: (
    value: ColorDot,
    event: React.MouseEvent<HTMLElement>,
  ) => void;
  // eslint-disable-next-line
  onItemClick?: (item: Record<string, any>, event: React.MouseEvent<HTMLElement>) => void;
  onCellClick?: (value: DateInfo, event: React.MouseEvent<HTMLElement>) => void;
  onCellHeaderClick?: (
    value: DateInfo,
    event: React.MouseEvent<HTMLElement>,
  ) => void;
  timeDateFormat?: TimeFormat;
  weekStartsOn?: WeekStartsOn | number;
}

export interface CalendarHeaderProps {
  setCurrentDate: (date: string | Date) => void;
  currentView: CurrentView;
  currentDate: string | Date;
  timeDateFormat: TimeFormatModified;
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
  cellDisplayMode?: CellDisplayMode;
  timeDateFormat?: TimeFormat;
  onDayNumberClick?: (
    day: string,
    event: React.MouseEvent<HTMLElement>,
  ) => void;
  onDayStringClick?: (
    day: string | Date,
    event: React.MouseEvent<HTMLElement>,
  ) => void;
  onHourClick?: (
    value: DateInfo | number,
    event: React.MouseEvent<HTMLElement>,
  ) => void;
  onColorDotClick?: (
    value: ColorDot,
    event: React.MouseEvent<HTMLElement>,
  ) => void;
  // eslint-disable-next-line
  onItemClick?: ((item: Record<string, any>, event: React.MouseEvent<HTMLElement>) => void) ;
  onCellClick?: (value: DateInfo, event: React.MouseEvent<HTMLElement>) => void;
  onCellHeaderClick?: (
    value: DateInfo,
    event: React.MouseEvent<HTMLElement>,
  ) => void;
  weekStartsOn?: WeekStartsOn;
  currentDate?: string | Date;
  currentView?: CurrentView | string;
  activeTimeDateField?: string;
  // eslint-disable-next-line
  data?: Record<string, any>[];
}
export interface InitializePropsRetFunc {
  cellDisplayModeModified: CellDisplayMode;
  onDayNumberClickModified: (
    day: string,
    event: React.MouseEvent<HTMLElement>,
  ) => void;
  onDayStringClickModified: (
    day: string | Date,
    event: React.MouseEvent<HTMLElement>,
  ) => void;
  onHourClickModified: (
    value: DateInfo | number,
    event: React.MouseEvent<HTMLElement>,
  ) => void;
  onColorDotClickModified: (
    value: ColorDot,
    event: React.MouseEvent<HTMLElement>,
  ) => void;
  // eslint-disable-next-line
  onItemClickModified: (item: Record<string, any>, event: React.MouseEvent<HTMLElement>) => void;
  onCellClickModified: (
    value: DateInfo,
    event: React.MouseEvent<HTMLElement>,
  ) => void;
  onCellHeaderClickModified: (
    value: DateInfo,
    event: React.MouseEvent<HTMLElement>,
  ) => void;
  timeDateFormatModified: TimeFormatModified;
  weekStartsOnModified: WeekStartsOn;
  currentDateModified: string | Date;
  currentViewModified: CurrentView;
  activeTimeDateFieldModified: string;
  // eslint-disable-next-line
  dataModified: Record<string, any>[];
}
