import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { monthEvents, weekEvents } from '../playground/data';
import Calendar from './Calendar';
import type { CalendarProps, CalendarView } from './types';

function Controlled(args: CalendarProps) {
  const [view, setView] = useState<CalendarView>(
    (args.currentView as CalendarView) ?? 'WEEK_TIME',
  );
  const [date, setDate] = useState<string | Date>(new Date());
  return (
    <div style={{ height: 720 }}>
      <Calendar
        {...args}
        currentView={view}
        onViewChange={setView}
        currentDate={date}
        setCurrentDate={setDate}
      />
    </div>
  );
}

const meta = {
  title: 'Calendar',
  component: Calendar,
  render: (args) => <Controlled key={String(args.currentView)} {...args} />,
  args: {
    data: monthEvents(),
    activeTimeDateField: 'startTime-endTime',
    currentView: 'WEEK_TIME',
    weekStartsOn: 1,
    theme: 'light',
    dayMaxItems: 'auto',
    startHour: 0,
    endHour: 24,
    disableHoverEffect: false,
  },
  argTypes: {
    currentView: {
      control: 'select',
      options: [
        'MONTH',
        'WEEK',
        'WEEK_TIME',
        'DAY',
        'DAY_REVERSE',
        'WEEK_IN_PLACE',
        'DAY_IN_PLACE',
      ],
    },
    theme: { control: 'inline-radio', options: ['light', 'dark', 'auto'] },
    weekStartsOn: { control: 'select', options: [0, 1, 6] },
    activeTimeDateField: {
      control: 'select',
      options: ['startTime-endTime', 'startTime', 'endTime'],
    },
    startHour: { control: { type: 'range', min: 0, max: 23 } },
    endHour: { control: { type: 'range', min: 1, max: 24 } },
    data: { control: false },
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WeekSchedule: Story = {};

export const Month: Story = { args: { currentView: 'MONTH' } };

export const Dark: Story = { args: { theme: 'dark', data: weekEvents() } };

export const WorkingHours: Story = {
  args: { currentView: 'DAY', startHour: 7, endHour: 20, data: weekEvents() },
};
