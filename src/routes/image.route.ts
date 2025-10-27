import { Router } from "express";
import { validate } from "../middleware/validate";
import { CreateImageSchema, UpdateImageSchema } from "../model/dto/image.dto";
import { imageController } from "../controller/image.controller";
import { authenticateToken, optionalAuth } from "../middleware/auth";

const router = Router();

// Routes publiques (avec authentification optionnelle)
router.get("/images", optionalAuth, imageController.getAll);
router.get("/images/count", optionalAuth, imageController.count);
router.get("/images/search", optionalAuth, imageController.findByField);

// Routes nécessitant une authentification obligatoire
router.post("/images", authenticateToken, validate(CreateImageSchema), imageController.createImage);
router.get("/images/:id", authenticateToken, imageController.getById);
router.put("/images/:id", authenticateToken, validate(UpdateImageSchema), imageController.update);
router.delete("/images/:id", authenticateToken, imageController.delete);

export default router;
