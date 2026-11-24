"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _jsxruntime = require('react/jsx-runtime');
var _classnames = require('classnames'); var _classnames2 = _interopRequireDefault(_classnames);
const Button = ({
  onClick,
  arrowSide,
  label,
  dataCy,
  withBorder
}) => {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "button",
    {
      "data-cy": dataCy,
      onClick,
      className: _classnames2.default.call(void 0, 
        "arrow-button",
        `arrow-button__${arrowSide}`,
        withBorder && "arrow-button--border"
      ),
      children: label
    }
  );
};
var Button_default = Button;


exports.default = Button_default;
