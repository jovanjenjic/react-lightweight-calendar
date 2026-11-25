import type { KeyboardEvent } from 'react';

/** Makes Enter and Space click an element that has `role="button"`. */
export function clickOnEnterOrSpace(event: KeyboardEvent<HTMLElement>) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    event.currentTarget.click();
  }
}
