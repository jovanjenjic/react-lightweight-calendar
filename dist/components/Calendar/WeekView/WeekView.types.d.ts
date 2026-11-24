import { JSX } from 'react';
import { Locale } from 'date-fns';
import { DateInfoFunction, ColorDot, DateInfo, TimeFormatModified, ColorDotFull, WeekStartsOn } from '../Calendar.types.js';

interface WeekViewProps {
    renderItems: ({ dateInfo, idx }: DateInfoFunction) => JSX.Element[];
    currentDate: string | Date;
    onDayNumberClick: (day: string, event: React.MouseEvent<HTMLElement>) => void;
    onDayStringClick: (day: string | Date, event: React.MouseEvent<HTMLElement>) => void;
    onColorDotClick: (value: ColorDot, event: React.MouseEvent<HTMLElement>) => void;
    onCellClick: (value: DateInfo, event: React.MouseEvent<HTMLElement>) => void;
    timeDateFormat: TimeFormatModified;
    preparedColorDots: ColorDotFull;
    weekStartsOn: WeekStartsOn;
    locale: Locale;
}

export type { WeekViewProps };
