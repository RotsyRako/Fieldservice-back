import { Router } from "express";
import { estimateInterventionController } from "../controller/estimateIntervention.controller";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// Route pour estimer le temps d'une intervention
// POST /api/interventions/:id/estimate
router.post(
  "/interventions/:id/estimate",
  authenticateToken,
  estimateInterventionController.estimateIntervention
);

export default router;

