"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fail = exports.ok = void 0;
const ok = (message, data) => ({
    message,
    success: true,
    data,
});
exports.ok = ok;
const fail = (message) => ({
    message,
    success: false,
});
exports.fail = fail;
