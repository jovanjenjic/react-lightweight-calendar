/**
 * Picks dark or light text for a background color, so items with only a `bgColor`
 * stay readable. Understands hex and rgb()/rgba(); returns `undefined` for anything
 * else (named colors, CSS variables), which keeps the theme's default text color.
 */
export function readableTextColor(background: unknown): string | undefined {
  const rgb = parseColor(background);
  if (!rgb) return undefined;
  const [r, g, b] = rgb.map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  // Compare contrast against white (#fff) and near-black (#1f1f1f).
  const onWhite = 1.05 / (luminance + 0.05);
  const onDark = (luminance + 0.05) / 0.0638;
  return onWhite >= onDark ? '#ffffff' : '#1f1f1f';
}

function parseColor(value: unknown): [number, number, number] | null {
  if (typeof value !== 'string') return null;
  const color = value.trim().toLowerCase();
  const hex = /^#([0-9a-f]{3,8})$/.exec(color);
  if (hex) {
    let h = hex[1];
    if (h.length === 3 || h.length === 4)
      h = [...h.slice(0, 3)].map((c) => c + c).join('');
    if (h.length !== 6 && h.length !== 8) return null;
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [
      number,
      number,
      number,
    ];
  }
  const rgb = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/.exec(color);
  if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])];
  return null;
}
