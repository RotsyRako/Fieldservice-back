import { Router } from "express";
import { validate } from "../middleware/validate";
import { CreateMaterielSchema, UpdateMaterielSchema } from "../model/dto/materiel.dto";
import { materielController } from "../controller/materiel.controller";
import { authenticateToken, optionalAuth } from "../middleware/auth";

const router = Router();

// Routes publiques (avec authentification optionnelle)
router.get("/materiels", optionalAuth, materielController.getAll);
router.get("/materiels/count", optionalAuth, materielController.count);
router.get("/materiels/search", optionalAuth, materielController.findByField);

// Routes nécessitant une authentification obligatoire
router.post("/materiels", authenticateToken, validate(CreateMaterielSchema), materielController.createMateriel);
router.get("/materiels/:id", authenticateToken, materielController.getById);
router.get("/materiels/interventions/:idIntervention", authenticateToken, materielController.getByInterventionId);
router.put("/materiels/:id", authenticateToken, validate(UpdateMaterielSchema), materielController.update);
router.delete("/materiels/:id", authenticateToken, materielController.delete);

export default router;
