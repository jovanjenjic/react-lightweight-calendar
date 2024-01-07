import { Locale } from 'date-fns';
import {
  ColorDot,
  ColorDotFull,
  DateInfo,
  DateInfoExtendedFunction,
  TimeFormatModified,
} from '../Calendar.types';

export interface DayInPlaceViewProps {
  renderItems: ({
    dateInfo,
    hour,
    idx,
  }: DateInfoExtendedFunction) => JSX.Element[];
  currentDate: string | Date;
  onDayNumberClick: (day: string, event: React.MouseEvent<HTMLElement>) => void;
  onDayStringClick: (
    day: string | Date,
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
  preparedColorDots: ColorDotFull;
  onHourClick: (
    value: DateInfo | number,
    event: React.MouseEvent<HTMLElement>,
  ) => void;
  locale: Locale;
}
