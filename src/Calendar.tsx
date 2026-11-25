import cn from 'classnames';
import type { ReactNode } from 'react';
import { Legend } from './components/Legend';
import { MorePopover } from './components/MorePopover';
import { Toolbar } from './components/Toolbar';
import { CalendarContext } from './context';
import type { ViewRange } from './core/date';
import type { NormalizedItem } from './core/items';
import { useCalendarValue } from './hooks/useCalendarValue';
import type { CalendarItem, CalendarProps, CalendarView } from './types';
import { DayGridView } from './views/DayGridView';
import { DayReverseView } from './views/DayReverseView';
import { InPlaceView } from './views/InPlaceView';
import { TimeGridView } from './views/TimeGridView';
import './styles/calendar.scss';

type ViewComponent = (props: {
  items: NormalizedItem[];
  range: ViewRange;
}) => ReactNode;

const VIEW_COMPONENTS: Record<CalendarView, ViewComponent> = {
  MONTH: DayGridView,
  WEEK: DayGridView,
  WEEK_TIME: TimeGridView,
  DAY: TimeGridView,
  DAY_REVERSE: DayReverseView,
  WEEK_IN_PLACE: InPlaceView,
  DAY_IN_PLACE: InPlaceView,
};

/**
 * A calendar for any data with dates: seven views, Google Calendar style layout,
 * custom rendering for every part and theming through CSS variables.
 */
export default function Calendar<T extends CalendarItem = CalendarItem>(
  props: CalendarProps<T>,
) {
  const { value, range, items, title, more, closeMore } =
    useCalendarValue(props);
  const View = VIEW_COMPONENTS[value.view];
  const showToolbar = !!(
    props.setCurrentDate ||
    props.onViewChange ||
    props.renderNavigation
  );
  const showLegend =
    !!props.colorDots?.length && props.showColorDotsLegend !== false;

  return (
    <CalendarContext.Provider value={value}>
      <div
        className={cn(
          'rlc',
          `rlc--${props.theme ?? 'light'}`,
          `rlc--view-${value.view.toLowerCase().replace(/_/g, '-')}`,
          props.className,
        )}
        style={props.style}
      >
        {showToolbar && <Toolbar title={title} range={range} />}
        <div className="rlc-body">
          <View items={items} range={range} />
        </div>
        {showLegend && <Legend dots={props.colorDots!} />}
        {more && (
          <MorePopover
            date={more.date}
            items={more.items}
            anchor={more.anchor}
            onClose={closeMore}
          />
        )}
      </div>
    </CalendarContext.Provider>
  );
}
