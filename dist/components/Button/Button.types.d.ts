interface ButtonProps {
    onClick: () => void;
    arrowSide?: 'left' | 'right';
    dataCy?: string;
    label?: string;
    withBorder?: boolean;
}

export type { ButtonProps };
