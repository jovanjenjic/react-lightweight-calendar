type TypographyAlignments = 'left' | 'center' | 'right';
type IconColoringMode = 'fill' | 'stroke' | 'both';
interface TypographyDefault {
    marginBottom?: number;
    color?: string;
    className?: string;
    align?: TypographyAlignments;
}

export type { IconColoringMode, TypographyAlignments, TypographyDefault };
