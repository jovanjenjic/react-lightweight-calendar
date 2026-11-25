import cn from 'classnames';
import { format } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import { useCalendar } from '../context';
import { toDateKey } from '../core/date';
import { isMultiDay, type NormalizedItem } from '../core/items';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';
import { EventItem } from './EventItem';

/** Space kept between the popover and the "+N more" link, in px. */
const OFFSET = { x: 8, y: 40 };

/** The list of a day's items opened by "+N more", positioned next to the link. */
export function MorePopover({
  date,
  items,
  anchor,
  onClose,
}: {
  date: Date;
  items: NormalizedItem[];
  anchor: HTMLElement;
  /** `restoreFocus` moves the focus back to the link. */
  onClose: (restoreFocus?: boolean) => void;
}) {
  const ctx = useCalendar();
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number }>();
  const key = toDateKey(date);

  // Place it at the link, kept inside the calendar, and move the focus into it.
  useIsomorphicLayoutEffect(() => {
    const popover = ref.current;
    const root = popover?.closest<HTMLElement>('.rlc');
    if (!popover || !root) return;
    const rootBox = root.getBoundingClientRect();
    const anchorBox = anchor.getBoundingClientRect();
    const maxLeft = Math.max(root.clientWidth - popover.offsetWidth, 0);
    setPosition({
      top: Math.max(anchorBox.top - rootBox.top - OFFSET.y, 0),
      left: Math.min(
        Math.max(anchorBox.left - rootBox.left - OFFSET.x, 0),
        maxLeft,
      ),
    });
    popover.focus();
  }, [anchor, key]);

  // Escape closes it; so does a click anywhere outside it and its link.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose(true);
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!ref.current?.contains(target) && !anchor.contains(target)) onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [anchor, onClose]);

  return (
    <div
      ref={ref}
      className="rlc-popover"
      role="dialog"
      aria-label={format(date, 'PPPP', { locale: ctx.locale })}
      tabIndex={-1}
      style={position ?? { visibility: 'hidden' }}
    >
      <div className="rlc-popover__head">
        <span className="rlc-popover__weekday">
          {format(date, ctx.formats.day, { locale: ctx.locale })}
        </span>
        <span
          className={cn(
            'rlc-daynum',
            'rlc-daynum--large',
            key === ctx.todayKey && 'rlc-daynum--today',
          )}
        >
          {date.getDate()}
        </span>
        <button
          type="button"
          className="rlc-btn rlc-popover__close"
          aria-label={ctx.labels.close}
          onClick={() => onClose(true)}
        >
          ×
        </button>
      </div>
      <div className="rlc-popover__list">
        {items.map((n) => (
          <EventItem
            key={n.key}
            n={n}
            variant={n.isAllDay || isMultiDay(n) ? 'bar' : 'dot'}
            isAllDay={n.isAllDay}
            continuesBefore={n.firstKey < key}
            continuesAfter={n.lastKey > key}
          />
        ))}
      </div>
    </div>
  );
}
