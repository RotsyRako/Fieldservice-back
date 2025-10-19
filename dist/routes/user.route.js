"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_1 = require("../middleware/validate");
const user_dto_1 = require("../model/dto/user.dto");
const user_controller_1 = require("../controller/user.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Routes publiques
router.post("/users", (0, validate_1.validate)(user_dto_1.CreateUserSchema), user_controller_1.userController.createUser);
router.post("/auth/login", (0, validate_1.validate)(user_dto_1.LoginSchema), user_controller_1.userController.authenticateUser);
// Routes protégées par authentification
router.get("/users", auth_1.optionalAuth, user_controller_1.userController.getAll);
router.get("/users/count", auth_1.optionalAuth, user_controller_1.userController.count);
router.get("/users/search", auth_1.optionalAuth, user_controller_1.userController.findByField);
// Routes nécessitant une authentification obligatoire
router.get("/users/:id", auth_1.authenticateToken, user_controller_1.userController.getById);
router.get("/users/email/:email", auth_1.authenticateToken, user_controller_1.userController.getUserByEmail);
router.put("/users/:id", auth_1.authenticateToken, (0, validate_1.validate)(user_dto_1.UpdateUserSchema), user_controller_1.userController.updateUser);
router.delete("/users/:id", auth_1.authenticateToken, user_controller_1.userController.delete);
exports.default = router;
