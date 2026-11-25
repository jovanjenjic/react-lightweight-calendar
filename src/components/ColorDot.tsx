import { useCalendar } from '../context';
import type { ColorDot as ColorDotData } from '../types';
import { clickOnEnterOrSpace } from './keyboard';

/** A day's color dot, or what `renderColorDot` returns for it. */
export function ColorDot({ dot }: { dot: ColorDotData }) {
  const { props } = useCalendar();
  const custom = props.renderColorDot;
  return (
    <span
      className={custom ? 'rlc-color-dot-custom' : 'rlc-color-dot'}
      role="button"
      tabIndex={0}
      title={dot.text}
      aria-label={dot.text}
      style={custom ? undefined : { background: dot.color }}
      onClick={(event) => {
        event.stopPropagation();
        props.onColorDotClick?.(dot, event);
      }}
      onKeyDown={clickOnEnterOrSpace}
    >
      {custom?.(dot)}
    </span>
  );
}
