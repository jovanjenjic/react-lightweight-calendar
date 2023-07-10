import {
  ColorDot,
  ColorDotFull,
  DateInfo,
  DateInfoExtendedFunction,
  TimeFormat,
  WeekStartsOn,
} from '../Calendar.types';

export interface WeekInPlaceViewProps {
  renderItems: ({
    dateInfo,
    hour,
    idx,
  }: DateInfoExtendedFunction) => JSX.Element[];
  currentDate: string | Date;
  onDayNumberClick: (day: string) => void;
  onDayStringClick: (day: string | Date) => void;
  onColorDotClick: (value: ColorDot) => void;
  onCellClick: (value: DateInfo) => void;
  timeDateFormat: TimeFormat;
  preparedColorDots: ColorDotFull;
  onHourClick: (value: DateInfo | number) => void;
  weekStartsOn: WeekStartsOn;
}
