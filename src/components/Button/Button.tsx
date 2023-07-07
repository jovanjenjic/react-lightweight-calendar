import './Button.scss';
import React from 'react';
import cn from 'classnames';
import { ButtonProps } from './Button.types';

const Button: React.FC<ButtonProps> = ({
  onClick,
  arrowSide,
  label,
  dataCy,
  withBorder,
}) => {
  return (
    <button
      data-cy={dataCy}
      onClick={onClick}
      className={cn(
        'arrow-button',
        `arrow-button__${arrowSide}`,
        withBorder && 'arrow-button--border',
      )}
    >
      {label}
    </button>
  );
};

export default Button;
