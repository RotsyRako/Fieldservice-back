import { Router } from "express";
import { validate } from "../middleware/validate";
import { CreateSignatureSchema, UpdateSignatureSchema } from "../model/dto/signature.dto";
import { signatureController } from "../controller/signature.controller";
import { authenticateToken, optionalAuth } from "../middleware/auth";

const router = Router();

// Routes publiques (avec authentification optionnelle)
router.get("/signatures", optionalAuth, signatureController.getAll);
router.get("/signatures/count", optionalAuth, signatureController.count);
router.get("/signatures/search", optionalAuth, signatureController.findByField);

// Routes nécessitant une authentification obligatoire
router.post("/signatures", authenticateToken, validate(CreateSignatureSchema), signatureController.createSignature);
router.get("/signatures/:id", authenticateToken, signatureController.getById);
router.put("/signatures/:id", authenticateToken, validate(UpdateSignatureSchema), signatureController.update);
router.delete("/signatures/:id", authenticateToken, signatureController.delete);

export default router;
