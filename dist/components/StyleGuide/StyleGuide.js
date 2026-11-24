"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _jsxruntime = require('react/jsx-runtime');
const blueColor = () => {
  return `
      --b-100: #bcdaff;
      --b-200: #139bff;
    `;
};
const grayScaleColorVariations = () => {
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
const fonts = () => {
  return `
      --font-a-1: normal normal 500 20px/28px 'Inter', sans-serif;
      --font-a-2: normal normal 500 14px/20px 'Inter', sans-serif;
      --font-a-3: normal normal 500 12px/18px 'Inter', sans-serif;
      --font-a-4: normal normal 500 12px/14px 'Inter', sans-serif;

      --font-b-1: normal normal 400 16px/24px 'Inter', sans-serif;
      --font-b-2: normal normal 400 12px/20px 'Inter', sans-serif;

      --font-c-1: normal normal 600 14px/20px 'Inter', sans-serif;
      --font-c-2: normal normal 600 12px/18px 'Inter', sans-serif;
      --font-c-3: normal normal 600 10px/16px 'Inter', sans-serif;
    `;
};
const Styleguide = () => {
  const minifyCssString = (css) => {
    return css.replace(/\n/g, "").replace(/\s\s+/g, " ");
  };
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "style",
    {
      dangerouslySetInnerHTML: {
        __html: minifyCssString(`:root {
          ${grayScaleColorVariations()}
          ${blueColor()}
          ${fonts()}
            --spacing: 8px;
          }
        `)
      }
    }
  );
};
var StyleGuide_default = Styleguide;





exports.blueColor = blueColor; exports.default = StyleGuide_default; exports.fonts = fonts; exports.grayScaleColorVariations = grayScaleColorVariations;
