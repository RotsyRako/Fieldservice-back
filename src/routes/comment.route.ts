import { Router } from "express";
import { validate } from "../middleware/validate";
import { CreateCommentSchema, UpdateCommentSchema } from "../model/dto/comment.dto";
import { commentController } from "../controller/comment.controller";
import { authenticateToken, optionalAuth } from "../middleware/auth";

const router = Router();

// Routes publiques (avec authentification optionnelle)
router.get("/comments", optionalAuth, commentController.getAll);
router.get("/comments/count", optionalAuth, commentController.count);
router.get("/comments/search", optionalAuth, commentController.findByField);

// Routes nécessitant une authentification obligatoire
router.post("/comments", authenticateToken, validate(CreateCommentSchema), commentController.createComment);
router.get("/comments/:id", authenticateToken, commentController.getById);
router.get("/comments/interventions/:idIntervention", authenticateToken, commentController.getByInterventionId);
router.put("/comments/:id", authenticateToken, validate(UpdateCommentSchema), commentController.update);
router.delete("/comments/:id", authenticateToken, commentController.delete);

export default router;
