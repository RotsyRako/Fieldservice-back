import { Router } from "express";
import { validate } from "../middleware/validate";
import { CreateInterventionSchema, UpdateInterventionSchema } from "../model/dto/intervention.dto";
import { SyncInterventionSchema } from "../model/dto/sync.dto";
import { interventionController } from "../controller/intervention.controller";
import { authenticateToken, optionalAuth } from "../middleware/auth";

const router = Router();

// Routes publiques (avec authentification optionnelle)
router.get("/interventions", optionalAuth, interventionController.getAll);
router.get("/interventions/count", optionalAuth, interventionController.count);
router.get("/interventions/search", optionalAuth, interventionController.findByField);
router.get("/interventions/users/:userId", authenticateToken, interventionController.getByUserId);

// Routes nécessitant une authentification obligatoire
router.post("/interventions", authenticateToken, validate(CreateInterventionSchema), interventionController.createIntervention);
router.post("/interventions/sync", authenticateToken, validate(SyncInterventionSchema), interventionController.syncInterventions);
router.get("/interventions/:id", authenticateToken, interventionController.getById);
router.put("/interventions/:id", authenticateToken, validate(UpdateInterventionSchema), interventionController.update);
router.delete("/interventions/:id", authenticateToken, interventionController.delete);

export default router;
