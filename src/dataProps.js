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
    title: 'Intervju call',
  },
  {
    id: 3333,
    startTime: '2023-06-02T06:45:06.628591Z',
    endTime: '2023-06-02T07:15:00Z',
    title: 'Codeday',
  },
  {
    id: 4444,
    startTime: '2023-06-02T03:30:00Z',
    endTime: '2023-06-02T05:00:00Z',
    title: 'Sastanak upoznavanja',
  },
  {
    id: 5555,
    startTime: '2023-05-02T06:35:06.628591Z',
    endTime: '2023-06-05T07:00:00Z',
    title: 'Codefair',
  },
  {
    id: 6666,
    startTime: '2023-06-02T05:00:00Z',
    endTime: '2023-06-02T06:00:00Z',
    title: 'Dejli',
  },
  {
    id: 7777,
    startTime: '2023-06-02T02:00:00Z',
    endTime: '2023-06-02T02:30:00Z',
    title: 'Druzenje Unije',
  },
  {
    id: 8888,
    startTime: '2023-06-02T01:10:00Z',
    endTime: '2023-06-02T02:10:00Z',
    title: 'Dobar film',
    bgColor: 'rgb(97, 189, 255)',
    textColor: 'white',
  },
];

const colorDots = [
  {
    color: 'orange',
    text: 'Text about blue color',
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
  currentView: CurrentView.MONTH,
  cellDisplayMode,
  setCellDisplayMode,
  timeDateFormat: {
    day: 'EEE',
    hour: 'hh a',
    monthYear: 'LLLL yyyy',
    weekStartsOn: WeekStartsOn.MONDAY,
  },
  activeTimeDateField: 'startTime-endTime',
  colorDots,
});

export default dataProp;
