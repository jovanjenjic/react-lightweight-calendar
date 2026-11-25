import { useState, type RefObject } from 'react';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

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
      const lane =
        parseFloat(
          getComputedStyle(element).getPropertyValue('--_lane-height'),
        ) || 24;
      const head =
        element.querySelector<HTMLElement>('.rlc-week__head')?.offsetHeight ??
        28;
      const weekHeight = element.clientHeight / weekCount;
      setRows(Math.max(1, Math.floor((weekHeight - head - 4) / lane)));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [enabled, container, weekCount]);

  return rows;
}
