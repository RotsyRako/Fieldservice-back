import { Router } from "express";
import { validate } from "../middleware/validate";
import { CreateTimesheetSchema, UpdateTimesheetSchema } from "../model/dto/timesheet.dto";
import { timesheetController } from "../controller/timesheet.controller";
import { authenticateToken, optionalAuth } from "../middleware/auth";

const router = Router();

// Routes publiques (avec authentification optionnelle)
router.get("/timesheets", optionalAuth, timesheetController.getAll);
router.get("/timesheets/count", optionalAuth, timesheetController.count);
router.get("/timesheets/search", optionalAuth, timesheetController.findByField);

// Routes nécessitant une authentification obligatoire
router.post("/timesheets", authenticateToken, validate(CreateTimesheetSchema), timesheetController.createTimesheet);
router.get("/timesheets/:id", authenticateToken, timesheetController.getById);
router.get("/timesheets/interventions/:idIntervention", authenticateToken, timesheetController.getByInterventionId);
router.put("/timesheets/:id", authenticateToken, validate(UpdateTimesheetSchema), timesheetController.update);
router.delete("/timesheets/:id", authenticateToken, timesheetController.delete);

export default router;
