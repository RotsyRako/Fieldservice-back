"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_1 = require("../middleware/validate");
const materiel_dto_1 = require("../model/dto/materiel.dto");
const materiel_controller_1 = require("../controller/materiel.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Routes publiques (avec authentification optionnelle)
router.get("/materiels", auth_1.optionalAuth, materiel_controller_1.materielController.getAll);
router.get("/materiels/count", auth_1.optionalAuth, materiel_controller_1.materielController.count);
router.get("/materiels/search", auth_1.optionalAuth, materiel_controller_1.materielController.findByField);
// Routes nécessitant une authentification obligatoire
router.post("/materiels", auth_1.authenticateToken, (0, validate_1.validate)(materiel_dto_1.CreateMaterielSchema), materiel_controller_1.materielController.createMateriel);
router.get("/materiels/:id", auth_1.authenticateToken, materiel_controller_1.materielController.getById);
router.put("/materiels/:id", auth_1.authenticateToken, (0, validate_1.validate)(materiel_dto_1.UpdateMaterielSchema), materiel_controller_1.materielController.update);
router.delete("/materiels/:id", auth_1.authenticateToken, materiel_controller_1.materielController.delete);
exports.default = router;
