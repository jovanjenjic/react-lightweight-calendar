import { useMemo } from 'react';

/** The hours from `startHour` up to `endHour` (exclusive). */
export const useHours = (startHour: number, endHour: number) =>
  useMemo(
    () => Array.from({ length: endHour - startHour }, (_, i) => startHour + i),
    [startHour, endHour],
  );
