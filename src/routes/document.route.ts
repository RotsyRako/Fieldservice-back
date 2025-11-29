import { Router } from "express";
import { validate } from "../middleware/validate";
import { CreateDocumentSchema, UpdateDocumentSchema } from "../model/dto/document.dto";
import { documentController } from "../controller/document.controller";
import { authenticateToken, optionalAuth } from "../middleware/auth";

const router = Router();

// Routes publiques (avec authentification optionnelle)
router.get("/documents", optionalAuth, documentController.getAll);
router.get("/documents/count", optionalAuth, documentController.count);
router.get("/documents/search", optionalAuth, documentController.findByField);

// Routes nécessitant une authentification obligatoire
router.post("/documents", authenticateToken, validate(CreateDocumentSchema), documentController.createDocument);
router.get("/documents/:id", authenticateToken, documentController.getById);
router.get("/documents/interventions/:idIntervention", authenticateToken, documentController.getByInterventionId);
router.put("/documents/:id", authenticateToken, validate(UpdateDocumentSchema), documentController.update);
router.delete("/documents/:id", authenticateToken, documentController.delete);

export default router;
