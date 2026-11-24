import React from 'react';

declare const blueColor: () => string;
declare const grayScaleColorVariations: () => string;
declare const fonts: () => string;
/**
 * New colors and styling
 * Refer to: https://www.figma.com/file/Ckxbd5Tdg2nda5yFp3TuZH/Dashboard?node-id=2850%3A6279
 */
declare const Styleguide: () => React.JSX.Element;

export { blueColor, Styleguide as default, fonts, grayScaleColorVariations };
