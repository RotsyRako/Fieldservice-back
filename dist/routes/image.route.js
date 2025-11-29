"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_1 = require("../middleware/validate");
const image_dto_1 = require("../model/dto/image.dto");
const image_controller_1 = require("../controller/image.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Routes publiques (avec authentification optionnelle)
router.get("/images", auth_1.optionalAuth, image_controller_1.imageController.getAll);
router.get("/images/count", auth_1.optionalAuth, image_controller_1.imageController.count);
router.get("/images/search", auth_1.optionalAuth, image_controller_1.imageController.findByField);
// Routes nécessitant une authentification obligatoire
router.post("/images", auth_1.authenticateToken, (0, validate_1.validate)(image_dto_1.CreateImageSchema), image_controller_1.imageController.createImage);
router.get("/images/:id", auth_1.authenticateToken, image_controller_1.imageController.getById);
router.get("/images/interventions/:idIntervention", auth_1.authenticateToken, image_controller_1.imageController.getByInterventionId);
router.put("/images/:id", auth_1.authenticateToken, (0, validate_1.validate)(image_dto_1.UpdateImageSchema), image_controller_1.imageController.update);
router.delete("/images/:id", auth_1.authenticateToken, image_controller_1.imageController.delete);
exports.default = router;
