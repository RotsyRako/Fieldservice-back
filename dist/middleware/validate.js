"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const base_response_utils_1 = require("../utils/base_response.utils");
const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        const msg = result.error.issues.map(e => e.message).join("; ");
        return res.status(400).json((0, base_response_utils_1.fail)(msg));
    }
    req.body = result.data; // données validées
    next();
};
exports.validate = validate;
