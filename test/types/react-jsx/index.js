import { jsx as _jsx } from "../../../react/jsx-runtime";
_jsx("div", { className: "c1 c2" });
_jsx("div", { className: 'c1 c2' });
_jsx("div", { className: ['c1', 'c2'] });
_jsx("div", { className: ['c1', ['c2']] });
_jsx("div", { className: { c1: true, c2: true } });
_jsx("div", { className: ['c1', { c2: true }] });
