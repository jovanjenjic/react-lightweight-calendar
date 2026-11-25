import { useState, type RefObject } from 'react';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

/** Space kept under the last row of a week, in px. */
const WEEK_BOTTOM_SPACE = 4;

/**
 * For `dayMaxItems="auto"`: how many item rows fit in one week of `container`,
 * which holds `weekCount` equally tall weeks. `null` until measured.
 */
export function useAutoRows(
  enabled: boolean,
  container: RefObject<HTMLElement | null>,
  weekCount: number,
): number | null {
  const [rows, setRows] = useState<number | null>(null);

  useIsomorphicLayoutEffect(() => {
    const element = container.current;
    if (!enabled || !element || typeof ResizeObserver === 'undefined') return;
    const measure = () => {
      const lane = measureLaneHeight(element);
      const head =
        element.querySelector<HTMLElement>('.rlc-week__head')?.offsetHeight ??
        28;
      const weekHeight = element.clientHeight / weekCount;
      setRows(
        Math.max(1, Math.floor((weekHeight - head - WEEK_BOTTOM_SPACE) / lane)),
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [enabled, container, weekCount]);

  return rows;
}

/**
 * Height of one item row in `element`, in px. `--_lane-height` is a calc() of other
 * variables, which getComputedStyle returns unresolved, so let the browser lay out
 * an invisible element of that height instead.
 */
function measureLaneHeight(element: HTMLElement): number {
  const probe = document.createElement('div');
  probe.style.cssText =
    'position:absolute;visibility:hidden;height:var(--_lane-height)';
  element.appendChild(probe);
  const height = probe.offsetHeight;
  probe.remove();
  return height || 24;
}
