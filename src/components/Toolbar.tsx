import cn from 'classnames';
import { CALENDAR_VIEWS } from '../constants';
import { useCalendar } from '../context';
import type { ViewRange } from '../core/date';
import type { NavigationRenderProps } from '../types';

/** Today / previous / next, the title, and the view switcher. */
export function Toolbar({ title, range }: { title: string; range: ViewRange }) {
  const ctx = useCalendar();
  const { props, labels, view } = ctx;
  const views = props.views?.length ? props.views : [...CALENDAR_VIEWS];
  const canNavigate = !!props.setCurrentDate;

  const goTo = (direction: -1 | 0 | 1) =>
    props.setCurrentDate?.(
      direction === 0 ? ctx.todayKey : ctx.shift(direction),
    );

  if (props.renderNavigation) {
    const renderProps: NavigationRenderProps = {
      title,
      currentDate: ctx.currentDate,
      view,
      range: { start: range.start, end: range.end },
      goToToday: () => goTo(0),
      goToPrevious: () => goTo(-1),
      goToNext: () => goTo(1),
      canNavigate,
      views,
      onViewChange: props.onViewChange,
      labels,
    };
    return (
      <div className="rlc-toolbar rlc-toolbar--custom">
        {props.renderNavigation(renderProps)}
      </div>
    );
  }

  return (
    <div className="rlc-toolbar">
      {canNavigate && (
        <div className="rlc-toolbar__nav">
          <button
            type="button"
            className="rlc-btn rlc-toolbar__today"
            onClick={() => goTo(0)}
          >
            {labels.today}
          </button>
          <ArrowButton label={labels.previous} onClick={() => goTo(-1)} left />
          <ArrowButton label={labels.next} onClick={() => goTo(1)} />
        </div>
      )}
      <h2 className="rlc-toolbar__title" aria-live="polite">
        {title}
      </h2>
      {props.onViewChange && (
        <div
          className="rlc-toolbar__views"
          role="group"
          aria-label={labels.viewSwitcher}
        >
          {views.map((v) => (
            <button
              key={v}
              type="button"
              className={cn(
                'rlc-btn',
                'rlc-toolbar__view',
                v === view && 'rlc-toolbar__view--active',
              )}
              aria-pressed={v === view}
              onClick={() => props.onViewChange?.(v)}
            >
              {labels.views[v]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ArrowButton({
  label,
  onClick,
  left = false,
}: {
  label: string;
  onClick: () => void;
  left?: boolean;
}) {
  return (
    <button
      type="button"
      className="rlc-btn rlc-toolbar__arrow"
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d={
            left
              ? 'M15.4 7.4 14 6l-6 6 6 6 1.4-1.4L10.8 12z'
              : 'M8.6 16.6 10 18l6-6-6-6-1.4 1.4 4.6 4.6z'
          }
          fill="currentColor"
        />
      </svg>
    </button>
  );
}
