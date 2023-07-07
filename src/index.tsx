import React from 'react';
import ReactDOM from 'react-dom/client';
import CalendarView from './components/Calendar/CalendarWrapper';
import dataViewConfig from './dataProps';
import Styleguide from './components/StyleGuide/StyleGuide';
import {
  CellDisplayMode,
  CellDisplayModeState,
} from './components/Calendar/Calendar.types';

const Playground = () => {
  const [currentDate, setCurrentDate] = React.useState('2023-06-03');
  const [cellDisplayMode, setCellDisplayMode] = React.useState<CellDisplayMode>(
    {
      MONTH: {
        inactiveCells: [],
        state: CellDisplayModeState.CUSTOM,
      },
      WEEK_TIME: {
        inactiveCells: [],
        state: CellDisplayModeState.ALL_COLLAPSED,
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
  );

  const onDayNumberClick = (day) => console.log('onDayNumberClick', day);
  const onDayStringClick = (day) => console.log('onDayStringClick', day);
  const onHourClick = (day) => console.log('onHourClick', day);
  const onColorDotClick = (day) => console.log('onColorDotClick', day);
  const onItemClick = (item) => console.log('onItemClick', item);
  const onCellClick = (value) => {
    console.log('onCellClick', value);
    setCellDisplayMode(() => {
      if (cellDisplayMode['MONTH'].inactiveCells.includes(value.cellKey)) {
        return {
          ...cellDisplayMode,
          MONTH: {
            ...cellDisplayMode['MONTH'],
            inactiveCells: cellDisplayMode['MONTH'].inactiveCells.filter(
              (val) => val !== value?.cellKey,
            ),
          },
        };
      }
      return {
        ...cellDisplayMode,
        MONTH: {
          ...cellDisplayMode['MONTH'],
          inactiveCells: [
            ...cellDisplayMode['MONTH'].inactiveCells,
            value?.cellKey,
          ],
        },
      };
    });
  };

  const dataView = dataViewConfig(
    currentDate,
    setCurrentDate,
    cellDisplayMode,
    setCellDisplayMode,
  );
  return (
    <div style={{ padding: '30px' }}>
      <Styleguide />
      <CalendarView
        {...dataView}
        enableHoverEffect={true}
        onDayNumberClick={onDayNumberClick}
        onDayStringClick={onDayStringClick}
        onHourClick={onHourClick}
        onColorDotClick={onColorDotClick}
        onItemClick={onItemClick}
        onCellClick={onCellClick}
      />
    </div>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(<Playground />);
