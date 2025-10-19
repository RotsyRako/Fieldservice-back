"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const assert_1 = require("assert");
const errorHandler = (err, _req, res, _next) => {
    console.error(err);
    return res.status(500).json((0, assert_1.fail)("Erreur interne"));
};
exports.errorHandler = errorHandler;
