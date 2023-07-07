export type TypographyAlignments = 'left' | 'center' | 'right';
export type IconColoringMode = 'fill' | 'stroke' | 'both';

export interface TypographyDefault {
  marginBottom?: number;
  color?: string;
  className?: string;
  align?: TypographyAlignments;
}
