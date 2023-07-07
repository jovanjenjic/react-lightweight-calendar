import React from 'react';
import { Story } from '@storybook/react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-twilight.css';
import Styleguide from '../StyleGuide/StyleGuide';
import CalendarWrapper from './CalendarWrapper';
import {
  CalendarWrapperProps,
  CellDisplayModeState,
  CurrentView,
  WeekStartsOn,
} from './Calendar.types';
import { testData } from '../../dataProps';
import { formatFullDate } from '../../utils';

export default {
  title: 'UI Components/Calendar',
  argTypes: {
    currentView: {
      control: 'select',
      options: [
        'WEEK_TIME',
        'DAY',
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
    enableHoverEffect: { type: 'boolean' },
  },
};

const codeSnippet = Prism.highlight(
  `<Calendar
    data={[ // (REQUIRED)
        {
            id: 'number',
            startTime: '2023-06-02T01:10:00Z', // It doesn't have to be called startTime, it can be anything
            endTime: '2023-06-02T02:10:00Z', // It doesn't have to be called endTime, it can be anything
            title: 'Dobar film', // If not passed, the text will not be displayed on element
            bgColor: 'rgb(129, 205, 242)', // If we do not pass the color it will be the default
            textColor: 'white', // If we do not pass the color it will be the default
        },
    ]}
    currentView='string' // (REQUIRED) WEEK_TIME, DAY, MONTH, WEEK, WEEK_IN_PLACE, DAY_IN_PLACE 
    currentDate='string' // (REQUIRED) The current date displayed on the calendar 
    activeTimeDateField={} // (REQUIRED) The field based on which the elements will be positioned. It can be any time date field from the data array. It can also be an interval separated by a '-'
    renderItem={(data: Record<string, any>, isHovered: boolean) => JSX.Element} // Callback for custom rendering element
    renderItemText={} // Callback for custom rendering element text
    renderHeaderItem={} // Callback for custom rendering header element (WEEK_TIME, DAY)
    renderHeaderItemText={} // Callback for custom rendering header element text (WEEK_TIME, DAY)
    enableHoverEffect={} // It will add a 'hovered' class to each element. In the default preview it will add a darker color and z-index
    setCurrentDate={(date: string) => void} // The current date is being changed. If this field is not sent, the navigation will be hidden
    colorDots={[
        {
            color: 'string', // Dot color
            text: 'string', // Info text
            date: 'string' // Based in this field color will be positionate
        },
    ]} 
    onDayNumberClick={(day: string) => void} // A callback method that is called by clicking on day number
    onDayStringClick={(day: string | Date) => void} // A callback method that is called by clicking on day
    onHourClick={(value: DateInfo | number) => void} // // A callback method that is called by clicking on hour on left side of Calendar
    onColorDotClick={value: ColorDotInfo) => void} // A callback method that is called by clicking on a color
    onItemClick={(item: Record<string, any>) => void} // A callback method that is called by clicking on an item
    onCellClick={(value: DateInfo) => void} // A callback method that is called by clicking on a cell
    timeDateFormat={{ // Time units display format. https://date-fns.org/v2.29.3/docs/format
        day: 'string', // Day in the calendar header
        hour: 'string', // Hour on the left side of the calendar
        monthYear: 'string', // In navigation
        weekStartsOn: 'number'// It regulates the beginning of the week. These are odd numbers from zero to six. 0 is Sunday
    }}
    cellDisplayMode={ Will not bi applied on WEEK_TIME and DAY views
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
        <p className="font-body-m">
          Calendar component is used to display data in a calendar view
        </p>
      </header>

      <br />
      <br />

      <CalendarWrapper
        data={argsData.data}
        activeTimeDateField={argsData.activeTimeDateField}
        currentView={argsData.currentView}
        currentDate={formatFullDate(new Date(argsData.currentDate))}
        setCurrentDate={(newDate) =>
          setArgsData({ ...args, currentDate: newDate })
        }
        enableHoverEffect={argsData.enableHoverEffect}
        colorDots={argsData.colorDots}
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
  currentView: CurrentView.MONTH,
  currentDate: '2023-06-01',
  activeTimeDateField: 'startTime-endTime',
  enableHoverEffect: true,
  timeDateFormat: {
    day: 'EEE',
    hour: 'hh a',
    monthYear: 'LLLL yyyy',
    weekStartsOn: WeekStartsOn.MONDAY,
  },
  colorDots: [
    {
      color: 'orange',
      text: 'Text about yellow color',
      date: '2023-06-02',
    },
    {
      color: 'red',
      text: 'Text about red color',
      date: '2023-06-03',
    },
    {
      color: 'green',
      text: 'Text about green color',
      date: '2023-06-04',
    },
  ],
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
};
