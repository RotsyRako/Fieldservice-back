"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const estimateIntervention_controller_1 = require("../controller/estimateIntervention.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Route pour estimer le temps d'une intervention
// POST /api/interventions/:id/estimate
router.post("/interventions/:id/estimate", auth_1.authenticateToken, estimateIntervention_controller_1.estimateInterventionController.estimateIntervention);
exports.default = router;
