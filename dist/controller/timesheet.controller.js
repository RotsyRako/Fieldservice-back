"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timesheetController = exports.TimesheetController = void 0;
const base_response_utils_1 = require("../utils/base_response.utils");
const timesheet_service_1 = require("../service/timesheet.service");
const base_controller_1 = require("./base.controller");
class TimesheetController extends base_controller_1.BaseController {
    constructor() {
        const timesheetService = new timesheet_service_1.TimesheetService();
        super(timesheetService);
        /**
         * Crée un nouveau timesheet (override de la méthode create du BaseController)
         */
        this.createTimesheet = async (req, res) => {
            try {
                const timesheetData = req.body;
                const result = await this.timesheetService.createTimesheet(timesheetData);
                if (!result.success) {
                    const statusCode = this.getStatusCodeFromError(result.error);
                    return res.status(statusCode).json((0, base_response_utils_1.fail)(result.message));
                }
                return res.status(201).json((0, base_response_utils_1.ok)(result.message, result.data));
            }
            catch (error) {
                console.error("❌ Erreur dans TimesheetController.createTimesheet:", error);
                return res.status(500).json((0, base_response_utils_1.fail)("Erreur serveur interne"));
            }
        };
        this.timesheetService = timesheetService;
    }
}
exports.TimesheetController = TimesheetController;
// Export des instances pour les routes
exports.timesheetController = new TimesheetController();
