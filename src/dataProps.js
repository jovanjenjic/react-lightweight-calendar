import {
  CurrentView,
  WeekStartsOn,
} from './components/Calendar/Calendar.types';

export const testData = [
  {
    id: 1111,
    startTime: '2023-05-10T03:05:06.628591Z',
    endTime: '2023-06-06T20:54:22.620702Z',
    title: 'Codeference',
  },
  {
    id: 2222,
    startTime: '2023-06-01T05:05:06.628591Z',
    endTime: '2023-06-01T06:03:00Z',
    title: 'Interview call',
  },
  {
    id: 3333,
    startTime: '2023-06-02T05:45:06.628591Z',
    endTime: '2023-06-03T04:15:00Z',
    title: 'Codeday',
  },
  {
    id: 4444,
    startTime: '2023-06-02T03:30:00Z',
    endTime: '2023-06-02T04:30:00Z',
    title: 'Meet up',
  },
  {
    id: 5555,
    startTime: '2023-05-02T06:35:06.628591Z',
    endTime: '2023-06-05T07:00:00Z',
    title: 'Codefair',
  },
  {
    id: 6666,
    startTime: '2023-06-02T06:00:00Z',
    endTime: '2023-06-02T07:00:00Z',
    title: 'Daily',
  },
  {
    id: 7777,
    startTime: '2023-06-02T02:15:00Z',
    endTime: '2023-06-02T03:00:00Z',
    title: 'Conference',
  },
  {
    id: 8888,
    startTime: '2023-06-02T01:10:00Z',
    endTime: '2023-06-02T02:10:00Z',
    title: 'Pause',
    bgColor: 'rgb(247 123 123)',
    textColor: 'white',
  },
  {
    id: 9999,
    startTime: '2023-06-02T03:30:00Z',
    endTime: '2023-06-02T04:30:00Z',
    title: 'Introduction',
  },
  {
    id: 1,
    startTime: '2023-06-01T03:30:00Z',
    endTime: '2023-06-02T05:00:00Z',
    title: 'Business trip',
  },
  {
    id: 2,
    startTime: '2023-06-02T08:30:00Z',
    endTime: '2023-06-02T10:00:00Z',
    title: 'Business trip',
  },
];

export const colorDots = [
  {
    color: '#71d3a5',
    text: 'Red color text',
    date: '2023-06-03',
  },
  {
    color: '#71d3a5',
    text: 'Green color text',
    date: '2023-06-04',
  },
];

const dataProp = (
  currentDate,
  setCurrentDate,
  cellDisplayMode = {},
  setCellDisplayMode,
) => ({
  data: testData,
  currentDate,
  setCurrentDate,
  currentView: CurrentView.DAY_REVERSE,
  cellDisplayMode,
  setCellDisplayMode,
  timeDateFormat: {
    day: 'EEE',
    hour: 'hh a',
    monthYear: 'LLLL yyyy',
  },
  weekStartsOn: WeekStartsOn.MONDAY,
  activeTimeDateField: 'startTime-endTime',
  colorDots,
});

export default dataProp;
