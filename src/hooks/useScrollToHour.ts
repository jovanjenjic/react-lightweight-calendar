import { useRef } from 'react';
import { DEFAULT_SCROLL_HOUR } from '../constants';
import { useCalendar } from '../context';
import { toDateKey, type ViewRange } from '../core/date';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

/**
 * Scrolls a timeline to `scrollToHour` when the view or the period changes. It finds
 * the element marked `data-rlc-hour="<hour>"` inside the returned ref. Only has an
 * effect when the calendar has a fixed height, so the timeline can scroll.
 */
export function useScrollToHour(range: ViewRange, axis: 'x' | 'y' = 'y') {
  const ctx = useCalendar();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollToHour } = ctx.props;
  const includesToday = range.days.some(
    (day) => toDateKey(day) === ctx.todayKey,
  );
  const periodKey = `${ctx.view}:${toDateKey(range.start)}`;

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const wanted =
      typeof scrollToHour === 'number'
        ? scrollToHour
        : includesToday || scrollToHour === 'now'
          ? ctx.now.getHours() - 1
          : DEFAULT_SCROLL_HOUR;
    const hour = Math.min(
      Math.max(Math.floor(wanted), ctx.startHour),
      ctx.endHour - 1,
    );
    const marker = element.querySelector<HTMLElement>(
      `[data-rlc-hour="${hour}"]`,
    );
    if (!marker) return;
    const box = element.getBoundingClientRect();
    const markerBox = marker.getBoundingClientRect();
    if (axis === 'y') element.scrollTop += markerBox.top - box.top;
    else element.scrollLeft += markerBox.left - box.left;
    // Only when the period changes, not on every minute tick of `now`.
  }, [periodKey, scrollToHour, ctx.startHour, ctx.endHour]);

  return ref;
}
