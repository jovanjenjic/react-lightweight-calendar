import React from 'react';
import ReactDOM from 'react-dom/client';
import CalendarWrapper from './components/Calendar/CalendarWrapper';
import dataViewConfig from './dataProps';
import {
  CellDisplayMode,
  CellDisplayModeState,
} from './components/Calendar/Calendar.types';
import { enUS } from 'date-fns/locale';

const Playground = () => {
  const [currentDate, setCurrentDate] = React.useState('2023-06-02');
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

  const onDayNumberClick = (day, event) =>
    console.log('onDayNumberClick', day, event);
  const onDayStringClick = (day, event) =>
    console.log('onDayStringClick', day, event);
  const onHourClick = (day, event) => console.log('onHourClick', day, event);
  const onColorDotClick = (val, e) => console.log('onColorDotClick', val, e);
  const onItemClick = (item, event) => console.log('onItemClick', item, event);
  const onCellHeaderClick = (value, event) =>
    console.log('onCellHeaderClick', value, event);
  const onCellClick = (value, event) => {
    console.log('onCellClick', value, event);
    setCellDisplayMode(() => {
      if (cellDisplayMode['MONTH'].inactiveCells.includes(value.timeDate)) {
        return {
          ...cellDisplayMode,
          MONTH: {
            ...cellDisplayMode['MONTH'],
            inactiveCells: cellDisplayMode['MONTH'].inactiveCells.filter(
              (val) => val !== value?.timeDate,
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
            value?.timeDate,
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
      <CalendarWrapper
        {...dataView}
        disableHoverEffect={false}
        onDayNumberClick={onDayNumberClick}
        onDayStringClick={onDayStringClick}
        onHourClick={onHourClick}
        onColorDotClick={onColorDotClick}
        onItemClick={onItemClick}
        onCellClick={onCellClick}
        onCellHeaderClick={onCellHeaderClick}
        locale={enUS}
      />
    </div>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(<Playground />);
