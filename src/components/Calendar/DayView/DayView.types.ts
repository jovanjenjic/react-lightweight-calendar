import { Locale } from 'date-fns';
import {
  ColorDot,
  ColorDotFull,
  DateInfo,
  DateInfoFunction,
  TimeFormatModified,
} from '../Calendar.types';

export interface DayTimeViewProps {
  renderItems: ({ dateInfo, idx }: DateInfoFunction) => JSX.Element[];
  renderHeaderItems: (
    startDate: string,
    endDate?: string,
  ) => (JSX.Element | null)[];
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
