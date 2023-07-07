import '../Calendar/Calendar.scss';
import React, { ReactElement } from 'react';
import cn from 'classnames';
import {
  CalendarWrapperProps,
  CurrentView,
  DateInfoFunction,
  PreparedDataWithTimeFull,
  PreparedDataWithTimeInPlace,
  PreparedDataWithoutTime,
} from './Calendar.types';
import {
  formatFullDate,
  formatHour,
  formatMonthDayHour,
  prepareCalendarData,
  prepareCalendarDataInPlace,
  prepareCalendarDataWithTime,
} from '../../utils/index';
import {
  shouldCollapse,
  shouldShowItem,
  getHeaderItemInfo,
  getKeyFromDateInfo,
  initializeProps,
} from './Calendar.helper';
import CalendarComponent from './CalendarComponent';

const CalendarWrapper: React.FC<CalendarWrapperProps> = ({
  data,
  renderItem,
  renderItemText,
  renderHeaderItem,
  renderHeaderItemText,
  enableHoverEffect,
  currentDate,
  setCurrentDate,
  activeTimeDateField,
  currentView,
  cellDisplayMode,
  colorDots,
  onDayNumberClick,
  onDayStringClick,
  onHourClick,
  onColorDotClick,
  onItemClick,
  onCellClick,
  timeDateFormat,
}) => {
  const {
    cellDisplayModeModified,
    timeDateFormatModified,
    onDayNumberClickModified,
    onDayStringClickModified,
    onHourClickModified,
    onColorDotClickModified,
    onItemClickModified,
    onCellClickModified,
  } = initializeProps({
    cellDisplayMode,
    timeDateFormat,
    onDayNumberClick,
    onDayStringClick,
    onHourClick,
    onColorDotClick,
    onItemClick,
    onCellClick,
  });

  const [hoveredElement, setHoveredElement] = React.useState(0);
  const [startIntervalKey, endIntervalKey] = (activeTimeDateField ?? '')
    .split('-')
    .map((str) => str.replace(/\s/g, '')) as [string, string];

  // Prepared data based on curentView so that for each item in the array there is all needed data
  const preparedData:
    | PreparedDataWithTimeFull
    | Record<string, PreparedDataWithoutTime[]>[]
    | PreparedDataWithTimeInPlace = React.useMemo(() => {
    switch (currentView) {
      case CurrentView.DAY:
      case CurrentView.WEEK_TIME:
        return prepareCalendarDataWithTime(data, activeTimeDateField);
      case CurrentView.MONTH:
      case CurrentView.WEEK:
        return prepareCalendarData(
          data,
          activeTimeDateField,
          timeDateFormatModified?.weekStartsOn ?? 1,
        );
      case CurrentView.DAY_IN_PLACE:
      case CurrentView.WEEK_IN_PLACE:
        return prepareCalendarDataInPlace(data, activeTimeDateField);
    }
  }, [data, activeTimeDateField, currentView]);

  // A method that will render elements for four views
  // MONTH, WEEK, WEEK_IN_PLACE, DAY_IN_PLACE
  const renderItemsWithoutTimeOrInPlace = ({
    dateInfo,
    idx,
    hour,
  }: DateInfoFunction): ReactElement[] => {
    const key = hour
      ? getKeyFromDateInfo(dateInfo, hour)
      : formatFullDate(new Date(dateInfo.date));

    const isCollapsed = shouldCollapse(
      cellDisplayModeModified,
      currentView,
      key,
    );

    // If a cell is collapsed, only the last item will be displayed
    const arrayData: PreparedDataWithoutTime[] =
      (isCollapsed ? preparedData?.[key]?.slice(-1) : preparedData?.[key]) ||
      [];

    return arrayData.map((preparedDataItem, index) => {
      const shoudShow = shouldShowItem(
        preparedDataItem,
        key,
        cellDisplayModeModified,
        currentView,
        preparedData,
        currentDate,
      );
      return shoudShow ? (
        <div
          key={`${index}-${dateInfo.date}`}
          style={{
            gridColumn: `${idx + 1} / ${
              idx + (isCollapsed ? 1 : preparedDataItem?.length || 1) + 1
            }`,
          }}
          onMouseEnter={() =>
            enableHoverEffect && setHoveredElement(preparedDataItem?.id)
          }
          onMouseLeave={() => enableHoverEffect && setHoveredElement(0)}
          className={cn(
            'item',
            hoveredElement === preparedDataItem.id && 'item--hovered',
          )}
        >
          {renderItem ? (
            renderItem(preparedDataItem, hoveredElement === preparedDataItem.id)
          ) : (
            <div
              className={cn(
                'sub-item',
                hoveredElement === preparedDataItem.id && 'sub-item--hovered',
                preparedDataItem?.isStart && 'sub-item--left-border',
              )}
              style={{
                backgroundColor: preparedDataItem?.bgColor,
                color: preparedDataItem?.textColor,
              }}
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onItemClickModified(preparedDataItem);
                }}
              >
                {renderItemText ? (
                  renderItemText(preparedDataItem)
                ) : (
                  <>
                    <div>{preparedDataItem?.title}</div>
                    <div>
                      {formatMonthDayHour(
                        new Date(preparedDataItem[startIntervalKey]),
                      )}
                      {endIntervalKey &&
                        `${
                          ' - ' +
                          formatMonthDayHour(
                            new Date(preparedDataItem[endIntervalKey]),
                          )
                        }`}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <></>
      );
    });
  };

  // A method that will render elements for two views
  // DAY, WEEK_TIME
  const renderItemsWithTime = ({
    dateInfo,
  }: DateInfoFunction): ReactElement[] => {
    const key = formatFullDate(new Date(dateInfo.date));

    return ((preparedData as PreparedDataWithTimeFull).day[key] || []).map(
      (preparedDataItem, index) => {
        return (
          <div
            key={`${index}-${dateInfo.date}`}
            style={{
              gridRow: `${+preparedDataItem.startMinute} / ${+preparedDataItem.endMinute}`,
              width: preparedDataItem.width,
              left: preparedDataItem.left,
              margin: preparedDataItem.margin,
              marginRight: '4%',
            }}
            onMouseEnter={() =>
              enableHoverEffect && setHoveredElement(preparedDataItem?.id)
            }
            onMouseLeave={() => enableHoverEffect && setHoveredElement(0)}
            className={cn(
              'item',
              hoveredElement === preparedDataItem.id && 'item--hovered',
            )}
          >
            {renderItem ? (
              renderItem(
                preparedDataItem,
                hoveredElement === preparedDataItem.id,
              )
            ) : (
              <div
                className={cn(
                  'sub-item',
                  hoveredElement === preparedDataItem.id && 'sub-item--hovered',
                )}
                style={{
                  backgroundColor: preparedDataItem?.bgColor,
                  color: preparedDataItem?.textColor,
                }}
                onClick={() => onItemClickModified(preparedDataItem)}
              >
                {renderItemText ? (
                  renderItemText(preparedDataItem)
                ) : (
                  <>
                    <div>{preparedDataItem?.title}</div>
                    <div>
                      {formatHour(new Date(preparedDataItem[startIntervalKey]))}
                      {endIntervalKey &&
                        `${
                          ' - ' +
                          formatHour(new Date(preparedDataItem[endIntervalKey]))
                        }`}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        );
      },
    );
  };

  // The method renders the elements in the header on two views (DAY and WEEK_TIME)
  const renderHeaderItems = (
    startDate: string,
    endDate?: string,
  ): (JSX.Element | null)[] => {
    const weekItems = preparedData as PreparedDataWithTimeFull;

    return weekItems.week.map((preparedDataItem, index) => {
      // Based on the intersection of the intervals, it is decided where the element should be positioned
      const { gridColumn, isFromPrevious, isFromNext } = getHeaderItemInfo(
        startDate,
        endDate || startDate,
        preparedDataItem[startIntervalKey],
        preparedDataItem[endIntervalKey],
        timeDateFormatModified.weekStartsOn ?? 1,
      );

      if (!gridColumn) {
        return null;
      }

      return (
        <div
          key={`${index}-${startDate}`}
          style={{
            gridColumn,
          }}
          className="item"
        >
          {renderHeaderItem ? (
            renderHeaderItem(preparedDataItem, {
              gridColumn,
              isFromPrevious,
              isFromNext,
            })
          ) : (
            <div
              className={cn(
                'sub-item',
                isFromPrevious && 'sub-item--left-arrow',
                isFromNext && 'sub-item--right-arrow',
              )}
              onClick={() => onItemClickModified(preparedDataItem)}
              style={{
                backgroundColor: preparedDataItem?.bgColor,
                color: preparedDataItem?.textColor,
              }}
            >
              {renderHeaderItemText ? (
                renderHeaderItemText(preparedDataItem)
              ) : (
                <div>{preparedDataItem?.title}</div>
              )}
            </div>
          )}
        </div>
      );
    });
  };

  const renderItems = React.useMemo(() => {
    switch (currentView) {
      case CurrentView.DAY:
      case CurrentView.WEEK_TIME:
        return renderItemsWithTime;
      case CurrentView.MONTH:
      case CurrentView.WEEK:
      case CurrentView.WEEK_IN_PLACE:
      case CurrentView.DAY_IN_PLACE:
        return renderItemsWithoutTimeOrInPlace;
      default:
        return renderItemsWithoutTimeOrInPlace;
    }
  }, [
    currentView,
    cellDisplayMode,
    hoveredElement,
    activeTimeDateField,
    enableHoverEffect,
  ]);

  return (
    <CalendarComponent
      renderItems={renderItems}
      renderHeaderItems={renderHeaderItems}
      setCurrentDate={setCurrentDate}
      currentView={currentView}
      colorDots={colorDots}
      currentDate={currentDate}
      onDayNumberClick={onDayNumberClickModified}
      onDayStringClick={onDayStringClickModified}
      onHourClick={onHourClickModified}
      onColorDotClick={onColorDotClickModified}
      onCellClick={onCellClickModified}
      timeDateFormat={timeDateFormatModified}
    />
  );
};

export default CalendarWrapper;
