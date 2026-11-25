import cn from 'classnames';
import type { CSSProperties, MouseEvent, ReactNode } from 'react';
import { createItemInfo, useCalendar, type ItemPiece } from '../context';
import { readableTextColor } from '../core/color';
import type { NormalizedItem } from '../core/items';
import type { ItemRenderInfo } from '../types';
import { clickOnEnterOrSpace } from './keyboard';

/**
 * How an item is drawn: `bar` for all-day and multi-day items, `dot` for timed items
 * in day cells, `timed` on a timeline, `chip` in the in-place views.
 */
export type EventVariant = 'bar' | 'dot' | 'timed' | 'chip';

export interface EventItemProps extends Partial<ItemPiece> {
  n: NormalizedItem;
  variant: EventVariant;
  /** Set for items in the all-day row, which use `renderHeaderItem`. */
  header?: { gridColumn: string };
  style?: CSSProperties;
}

/** One item, in any view: custom rendering, colors, hover, click and keyboard. */
export function EventItem({
  n,
  variant,
  isAllDay = false,
  continuesBefore = false,
  continuesAfter = false,
  isCompact = false,
  header,
  style,
}: EventItemProps) {
  const ctx = useCalendar();
  const { props } = ctx;
  const { item } = n;
  const info = createItemInfo(n, ctx, {
    isAllDay,
    continuesBefore,
    continuesAfter,
    isCompact,
  });
  const title = item.title == null ? '' : String(item.title);
  const isCustom = !!(header ? props.renderHeaderItem : props.renderItem);
  const hoverable = !props.disableHoverEffect;

  let content: ReactNode;
  if (header && props.renderHeaderItem) {
    content = props.renderHeaderItem(item, {
      ...info,
      gridColumn: header.gridColumn,
      isFromPrevious: continuesBefore,
      isFromNext: continuesAfter,
    });
  } else if (!header && props.renderItem) {
    content = props.renderItem(item, info.isHovered, info);
  } else {
    const renderText = header
      ? props.renderHeaderItemText
      : props.renderItemText;
    content = renderText ? (
      <span className="rlc-event__custom-text">{renderText(item, info)}</span>
    ) : (
      <DefaultContent variant={variant} title={title} info={info} />
    );
  }

  const onClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    props.onItemClick?.(item, event);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      title={[title, info.timeLabel].filter(Boolean).join(' · ') || undefined}
      className={cn(
        'rlc-event',
        `rlc-event--${variant}`,
        isCustom && 'rlc-event--custom',
        info.isHovered && 'rlc-event--hovered',
        continuesBefore && 'rlc-event--continues-before',
        continuesAfter && 'rlc-event--continues-after',
        isCompact && 'rlc-event--compact',
      )}
      style={{ ...itemColors(item.bgColor, item.textColor), ...style }}
      onClick={onClick}
      onKeyDown={clickOnEnterOrSpace}
      onMouseEnter={hoverable ? () => ctx.setHoveredKey(n.key) : undefined}
      onMouseLeave={hoverable ? () => ctx.setHoveredKey(null) : undefined}
      onFocus={hoverable ? () => ctx.setHoveredKey(n.key) : undefined}
      onBlur={hoverable ? () => ctx.setHoveredKey(null) : undefined}
    >
      {content}
    </div>
  );
}

/** Item colors as CSS variables; text gets a readable color when only `bgColor` is set. */
function itemColors(background: unknown, text: unknown): CSSProperties {
  const bg = typeof background === 'string' && background ? background : null;
  const fg =
    typeof text === 'string' && text
      ? text
      : readableTextColor(bg ?? undefined);
  return {
    ...(bg && { '--_item-bg': bg }),
    ...(fg && { '--_item-text': fg }),
  } as CSSProperties;
}

function DefaultContent({
  variant,
  title,
  info,
}: {
  variant: EventVariant;
  title: string;
  info: ItemRenderInfo;
}) {
  const titleNode = <span className="rlc-event__title">{title}</span>;

  if (variant === 'dot' || variant === 'chip') {
    return (
      <>
        <span className="rlc-event__dot" aria-hidden="true" />
        {info.startTimeLabel && (
          <span className="rlc-event__time">{info.startTimeLabel}</span>
        )}
        {titleNode}
      </>
    );
  }
  if (variant === 'timed' && info.isCompact) {
    return (
      <span className="rlc-event__line">
        {titleNode}
        {info.startTimeLabel && (
          <span className="rlc-event__time">, {info.startTimeLabel}</span>
        )}
      </span>
    );
  }
  if (variant === 'timed') {
    return (
      <>
        {titleNode}
        {info.timeLabel && (
          <span className="rlc-event__time">{info.timeLabel}</span>
        )}
      </>
    );
  }
  return titleNode;
}
