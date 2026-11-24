import { FC } from 'react';
import { CalendarProps } from './Calendar.types.js';
import 'date-fns';

declare const CalendarComponent: FC<CalendarProps>;

export { CalendarComponent as default };
