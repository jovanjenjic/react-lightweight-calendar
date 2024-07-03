import { Story } from '@storybook/react';
import { enUS } from 'date-fns/locale';
import Prism from 'prismjs';
import 'prismjs/themes/prism-twilight.css';
import React from 'react';
import { colorDots, testData } from '../../dataProps';
import Styleguide from '../StyleGuide/StyleGuide';
import {
  CalendarWrapperProps,
  CellDisplayModeState,
  CurrentView,
  WeekStartsOn,
} from './Calendar.types';
import CalendarWrapper from './CalendarWrapper';

export default {
  title: 'UI Components/Calendar',
  argTypes: {
    currentView: {
      control: 'select',
      options: [
        'WEEK_TIME',
        'DAY',
        'DAY_REVERSE',
        'MONTH',
        'WEEK',
        'WEEK_IN_PLACE',
        'DAY_IN_PLACE',
      ],
    },
    activeTimeDateField: {
      control: 'select',
      options: ['startTime', 'endTime', 'startTime-endTime'],
    },
    currentDate: { type: 'date' },
    disableHoverEffect: { type: 'boolean' },
    weekStartsOn: {
      control: 'select',
      options: [0, 1, 2, 3, 4, 5, 6],
    },
  },
};

const codeSnippet = Prism.highlight(
  `<Calendar
    data={[ // (REQUIRED)
        {
            id: 'number',
            startTime: '2023-06-02T01:10:00Z', // It doesn't have to be called startTime, it can be anything (createdAt, updatedAt...), but the format must be the same
            endTime: '2023-06-02T02:10:00Z', // It doesn't have to be called endTime, it can be anything (createdAt, updatedAt...), but the format must be the same
            title: 'Conference', // If not passed, the text will not be displayed on element
            bgColor: 'rgb(129, 205, 242)', // If we do not pass the color, color will be the default one
            textColor: 'white', // If we do not pass the color, color will be the default one
        },
    ]}
    currentView='string' // (DEFAULT: MONTH) WEEK_TIME, DAY, DAY_REVERSE, MONTH, WEEK, WEEK_IN_PLACE or DAY_IN_PLACE 
    currentDate='string' // (REQUIRED, DEFAULT: now) The current date displayed on the calendar ('2023-06-01')
    setCurrentDate={(date: string) => void} // The current date is being changed. If this field is not sent, the calendar navigation will be hidden
    activeTimeDateField='string' // The field based on which the elements will be positioned. It can be any time date field from the 'data' array. It can also be an interval separated by a '-'. ('startTime', 'endTime', 'createdAt', 'updatedAt', 'startTime-endTime'...)
    weekStartsOn: 'number'// It regulates from which day the week will start. These are numbers from 0 to 6. (0 - SUNDAY, 1 - MONDAY, 2 - TUESDAY, 3 - WEDNESDAY, 4 - THURSDAY, 5 - FRIDAY, 6 - SATURDAY)
    renderItem={(data: Record<string, any>, isHovered: boolean) => JSX.Element} // Callback for custom rendering element
    renderItemText={(data: Record<string, any>) => JSX.Element} // Callback for custom rendering element text
    renderHeaderItem={ // Callback for custom rendering header element (can be applied to WEEK_TIME ans DAY views)
      (data: Record<string, any>, extras: {
        gridColumn: 'string'; // From which to which column it is positioned
        isFromPrevious: 'boolean'; // Is the element from the previous week or day. Based on this field, you can add indicator (for example arrows) that say the element comes from the previous week or day
        isFromNext: 'boolean'; // Is the element from the next week or day. Based on this field, you can add indicator (for example arrows) that say the element comes from the next week or day
      }) => JSX.Element} 
    renderHeaderItemText={(data: Record<string, any>) => JSX.Element} // Callback for custom rendering header element text (can be applied to WEEK_TIME and DAY views)
    disableHoverEffect='boolean' // It will add a 'hovered' className to each hovered element. In the default preview it will add a darker color and z-index
    colorDots={[
        {
            color: 'string', // Dot color
            text: 'string', // Info text
            date: 'string' // Based in this field color will be positionate
        },
    ]}
    timeDateFormat={{ // Time units display format. https://date-fns.org/v2.29.3/docs/format
      day: 'string', // Day in the calendar header
      hour: 'string', // Hour on the left side of the calendar
      monthYear: 'string', // Text in navigation
    }}
    locale={enUS} // Locale object from the date-fns library
    todayLabel="Today" // Label for the "Today" button
    onDayNumberClick={(day: string, event: React.MouseEvent<HTMLElement>) => void} // A callback method that is called by clicking on day number
    onDayStringClick={(day: string | Date, event: React.MouseEvent<HTMLElement>) => void} // A callback method that is called by clicking on day text
    onHourClick={(value: DateInfo | number, event: React.MouseEvent<HTMLElement>) => void} // A callback method that is called by clicking on hour on left side of Calendar
    onColorDotClick={value: ColorDotInfo, event: React.MouseEvent<HTMLElement>) => void} // A callback method that is called by clicking on a color
    onItemClick={(item: Record<string, any>, event: React.MouseEvent<HTMLElement>) => void} // A callback method that is called by clicking on an item
    onCellClick={(value: DateInfo, event: React.MouseEvent<HTMLElement>) => void} // A callback method that is called by clicking on a cell
    onCellHeaderClick={(value: DateInfo, event: React.MouseEvent<HTMLElement>) => void} // A callback function that is called when a cell header is clicked. In the case of a MONTH and WEEK views, onCellClick method will be called instead of this one.
    cellDisplayMode={ // Controls whether the elements of a cell will be shown or hidden. Will not bi applied on WEEK_TIME and DAY views
        [CURRENT_VIEW]: { // WEEK_TIME, DAY, MONTH...
            inactiveCells: ['string'], // List of inactive cells. (['2023-05-29'...])
            state: 'string, // ALL_EXPANDED (by default), ALL_COLLAPSED, CUSTOM
        }
    }
    />`,
  Prism.languages.javascript,
  'javascript',
);

const Template: Story<CalendarWrapperProps> = (args) => {
  const [argsData, setArgsData] = React.useState(args);

  React.useEffect(() => {
    setArgsData(args);
  }, [args]);

  return (
    <>
      <Styleguide />
      <header className="story-header">
        <h1 className="story-header__title">Calendar</h1>
        <br />
        <p className="font-body-m">
          There are 6 different calendar views. It is used to display various
          elements and entities
        </p>
      </header>

      <br />
      <br />

      <CalendarWrapper
        data={argsData.data}
        activeTimeDateField={argsData.activeTimeDateField}
        currentView={argsData.currentView}
        currentDate={argsData.currentDate}
        setCurrentDate={(newDate) =>
          setArgsData({ ...args, currentDate: newDate })
        }
        weekStartsOn={argsData.weekStartsOn}
        disableHoverEffect={argsData.disableHoverEffect}
        colorDots={argsData.colorDots}
        timeDateFormat={argsData.timeDateFormat}
        cellDisplayMode={argsData.cellDisplayMode}
        locale={enUS}
        todayLabel="Today"
      />

      <br />
      <br />
      <pre className="language-js">
        <code dangerouslySetInnerHTML={{ __html: codeSnippet }} />
      </pre>
    </>
  );
};

export const Calendar = Template.bind({});

Calendar.args = {
  data: testData,
  currentView: CurrentView.WEEK_TIME,
  currentDate: '2023-06-02',
  activeTimeDateField: 'startTime-endTime',
  disableHoverEffect: false,
  weekStartsOn: WeekStartsOn.MONDAY,
  timeDateFormat: {
    day: 'EEE',
    hour: 'hh a',
    monthYear: 'LLLL yyyy',
  },
  colorDots: colorDots,
  cellDisplayMode: {
    MONTH: {
      inactiveCells: [],
      state: CellDisplayModeState.CUSTOM,
    },
    WEEK_TIME: {
      inactiveCells: [],
      state: CellDisplayModeState.CUSTOM,
    },
    DAY_IN_PLACE: {
      inactiveCells: [],
      state: CellDisplayModeState.CUSTOM,
    },
    WEEK_IN_PLACE: {
      inactiveCells: [],
      state: CellDisplayModeState.CUSTOM,
    },
  },
  locale: enUS,
  todayLabel: 'Today',
};
