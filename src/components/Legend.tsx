import { useCalendar } from '../context';
import type { ColorDot } from '../types';

/** The legend under the calendar: one entry per color. */
export function Legend({ dots }: { dots: ColorDot[] }) {
  const { props } = useCalendar();
  if (props.renderLegend) {
    return <div className="rlc-legend">{props.renderLegend(dots)}</div>;
  }
  const byColor = new Map(dots.map((dot) => [dot.color, dot]));
  return (
    <div className="rlc-legend">
      {[...byColor.values()].map((dot) => (
        <button
          key={dot.color}
          type="button"
          className="rlc-btn rlc-legend__item"
          onClick={(event) => props.onColorDotClick?.(dot, event)}
        >
          <span
            className="rlc-color-dot"
            style={{ background: dot.color }}
            aria-hidden="true"
          />
          {dot.text}
        </button>
      ))}
    </div>
  );
}
