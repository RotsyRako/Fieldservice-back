import { Router } from "express";
import { validate } from "../middleware/validate";
import { CreateUserSchema, LoginSchema, UpdateUserSchema } from "../model/dto/user.dto";
import { userController } from "../controller/user.controller";
import { authenticateToken, optionalAuth } from "../middleware/auth";

const router = Router();

// Routes publiques
router.post("/users", validate(CreateUserSchema), userController.createUser);
router.post("/auth/login", validate(LoginSchema), userController.authenticateUser);

// Routes protégées par authentification
router.get("/users", optionalAuth, userController.getAll);
router.get("/users/count", optionalAuth, userController.count);
router.get("/users/search", optionalAuth, userController.findByField);

// Routes nécessitant une authentification obligatoire
router.get("/users/:id", authenticateToken, userController.getById);
router.get("/users/email/:email", authenticateToken, userController.getUserByEmail);
router.put("/users/:id", authenticateToken, validate(UpdateUserSchema), userController.updateUser);
router.delete("/users/:id", authenticateToken, userController.delete);

export default router;
