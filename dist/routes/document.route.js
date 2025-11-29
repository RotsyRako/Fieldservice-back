"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_1 = require("../middleware/validate");
const document_dto_1 = require("../model/dto/document.dto");
const document_controller_1 = require("../controller/document.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Routes publiques (avec authentification optionnelle)
router.get("/documents", auth_1.optionalAuth, document_controller_1.documentController.getAll);
router.get("/documents/count", auth_1.optionalAuth, document_controller_1.documentController.count);
router.get("/documents/search", auth_1.optionalAuth, document_controller_1.documentController.findByField);
// Routes nécessitant une authentification obligatoire
router.post("/documents", auth_1.authenticateToken, (0, validate_1.validate)(document_dto_1.CreateDocumentSchema), document_controller_1.documentController.createDocument);
router.get("/documents/:id", auth_1.authenticateToken, document_controller_1.documentController.getById);
router.get("/documents/interventions/:idIntervention", auth_1.authenticateToken, document_controller_1.documentController.getByInterventionId);
router.put("/documents/:id", auth_1.authenticateToken, (0, validate_1.validate)(document_dto_1.UpdateDocumentSchema), document_controller_1.documentController.update);
router.delete("/documents/:id", auth_1.authenticateToken, document_controller_1.documentController.delete);
exports.default = router;
