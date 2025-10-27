"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_1 = require("../middleware/validate");
const timesheet_dto_1 = require("../model/dto/timesheet.dto");
const timesheet_controller_1 = require("../controller/timesheet.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Routes publiques (avec authentification optionnelle)
router.get("/timesheets", auth_1.optionalAuth, timesheet_controller_1.timesheetController.getAll);
router.get("/timesheets/count", auth_1.optionalAuth, timesheet_controller_1.timesheetController.count);
router.get("/timesheets/search", auth_1.optionalAuth, timesheet_controller_1.timesheetController.findByField);
// Routes nécessitant une authentification obligatoire
router.post("/timesheets", auth_1.authenticateToken, (0, validate_1.validate)(timesheet_dto_1.CreateTimesheetSchema), timesheet_controller_1.timesheetController.createTimesheet);
router.get("/timesheets/:id", auth_1.authenticateToken, timesheet_controller_1.timesheetController.getById);
router.put("/timesheets/:id", auth_1.authenticateToken, (0, validate_1.validate)(timesheet_dto_1.UpdateTimesheetSchema), timesheet_controller_1.timesheetController.update);
router.delete("/timesheets/:id", auth_1.authenticateToken, timesheet_controller_1.timesheetController.delete);
exports.default = router;
