"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_1 = require("../middleware/validate");
const intervention_dto_1 = require("../model/dto/intervention.dto");
const sync_dto_1 = require("../model/dto/sync.dto");
const intervention_controller_1 = require("../controller/intervention.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Routes publiques (avec authentification optionnelle)
router.get("/interventions", auth_1.optionalAuth, intervention_controller_1.interventionController.getAll);
router.get("/interventions/count", auth_1.optionalAuth, intervention_controller_1.interventionController.count);
router.get("/interventions/search", auth_1.optionalAuth, intervention_controller_1.interventionController.findByField);
router.get("/interventions/users/:userId", auth_1.authenticateToken, intervention_controller_1.interventionController.getByUserId);
// Routes nécessitant une authentification obligatoire
router.post("/interventions", auth_1.authenticateToken, (0, validate_1.validate)(intervention_dto_1.CreateInterventionSchema), intervention_controller_1.interventionController.createIntervention);
router.post("/interventions/sync", auth_1.authenticateToken, (0, validate_1.validate)(sync_dto_1.SyncInterventionSchema), intervention_controller_1.interventionController.syncInterventions);
router.get("/interventions/:id", auth_1.authenticateToken, intervention_controller_1.interventionController.getById);
router.put("/interventions/:id", auth_1.authenticateToken, (0, validate_1.validate)(intervention_dto_1.UpdateInterventionSchema), intervention_controller_1.interventionController.update);
router.delete("/interventions/:id", auth_1.authenticateToken, intervention_controller_1.interventionController.delete);
exports.default = router;
