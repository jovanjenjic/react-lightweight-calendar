import { Locale } from 'date-fns';
import {
  ColorDot,
  ColorDotFull,
  CurrentView,
  DateInfo,
  DateInfoFunction,
  TimeFormatModified,
  WeekStartsOn,
} from '../Calendar.types';

export interface MonthViewProps {
  renderItems: ({ dateInfo, idx }: DateInfoFunction) => JSX.Element[];
  currentView: CurrentView;
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
  timeDateFormat: TimeFormatModified;
  preparedColorDots: ColorDotFull;
  weekStartsOn: WeekStartsOn;
  locale: Locale;
}
