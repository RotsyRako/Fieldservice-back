"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_1 = require("../middleware/validate");
const signature_dto_1 = require("../model/dto/signature.dto");
const signature_controller_1 = require("../controller/signature.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Routes publiques (avec authentification optionnelle)
router.get("/signatures", auth_1.optionalAuth, signature_controller_1.signatureController.getAll);
router.get("/signatures/count", auth_1.optionalAuth, signature_controller_1.signatureController.count);
router.get("/signatures/search", auth_1.optionalAuth, signature_controller_1.signatureController.findByField);
// Routes nécessitant une authentification obligatoire
router.post("/signatures", auth_1.authenticateToken, (0, validate_1.validate)(signature_dto_1.CreateSignatureSchema), signature_controller_1.signatureController.createSignature);
router.get("/signatures/:id", auth_1.authenticateToken, signature_controller_1.signatureController.getById);
router.get("/signatures/interventions/:idIntervention", auth_1.authenticateToken, signature_controller_1.signatureController.getByInterventionId);
router.put("/signatures/:id", auth_1.authenticateToken, (0, validate_1.validate)(signature_dto_1.UpdateSignatureSchema), signature_controller_1.signatureController.update);
router.delete("/signatures/:id", auth_1.authenticateToken, signature_controller_1.signatureController.delete);
exports.default = router;
