import React from 'react';
import './StyleGuide.scss';

export const orangeColor = () => {
  return `
      --o-300: #fcb35b;
      --o-200: #ffc681;
      --o-100: #f08300;
    `;
};

export const grayScaleColorVariations = () => {
  return `
      --gs-800: #2A313C;
      --gs-700: #3D4757;
      --gs-600: #58667B;
      --gs-500: #718096;
      --gs-300: #A0AEC0;
      --gs-200: #CBD5E0;
      --gs-100: #F9F9F9;
      --gs-50: #FEFEFE;
      --gs-0: #FFFFFF;
    `;
};

export const fonts = () => {
  return `
      --font-a-1: normal normal 500 20px/28px 'Inter', sans-serif;
      --font-a-2: normal normal 500 14px/20px 'Inter', sans-serif;
      --font-a-3: normal normal 500 12px/18px 'Inter', sans-serif;

      --font-b-1: normal normal 400 16px/24px 'Inter', sans-serif;
      --font-b-2: normal normal 400 12px/20px 'Inter', sans-serif;

      --font-c-1: normal normal 600 14px/20px 'Inter', sans-serif;
      --font-c-2: normal normal 600 12px/18px 'Inter', sans-serif;
      --font-c-3: normal normal 600 10px/16px 'Inter', sans-serif;
    `;
};

/**
 * New colors and styling
 * Refer to: https://www.figma.com/file/Ckxbd5Tdg2nda5yFp3TuZH/Dashboard?node-id=2850%3A6279
 */
const Styleguide = () => {
  const minifyCssString = (css: string) => {
    return css.replace(/\n/g, '').replace(/\s\s+/g, ' ');
  };

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: minifyCssString(`:root {
          ${grayScaleColorVariations()}
          ${orangeColor()}
          ${fonts()}
            --spacing: 8px;
          }
        `),
      }}
    />
  );
};

export default Styleguide;
