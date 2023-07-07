import {
  ColorDot,
  ColorDotFull,
  DateInfo,
  DateInfoFunction,
  TimeFormat,
} from '../Calendar.types';

export interface WeekViewProps {
  renderItems: ({ dateInfo, idx }: DateInfoFunction) => JSX.Element[];
  currentDate: string | Date;
  onDayNumberClick: (day: string) => void;
  onDayStringClick: (day: string | Date) => void;
  onColorDotClick: (value: ColorDot) => void;
  onCellClick: (value: DateInfo) => void;
  timeDateFormat: TimeFormat;
  preparedColorDots: ColorDotFull;
}
