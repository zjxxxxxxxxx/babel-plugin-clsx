define("input", ["require", "exports", "../../../react/jsx-runtime"], function (require, exports, jsx_runtime_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    (0, jsx_runtime_1.jsx)("div", { className: "c1 c2" });
    (0, jsx_runtime_1.jsx)("div", { className: 'c1 c2' });
    (0, jsx_runtime_1.jsx)("div", { className: ['c1', 'c2'] });
    (0, jsx_runtime_1.jsx)("div", { className: ['c1', ['c2']] });
    (0, jsx_runtime_1.jsx)("div", { className: { c1: true, c2: true } });
    (0, jsx_runtime_1.jsx)("div", { className: ['c1', { c2: true }] });
});
