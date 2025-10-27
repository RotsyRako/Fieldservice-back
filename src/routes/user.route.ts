import { Router } from "express";
import { validate } from "../middleware/validate";
import { CreateUserSchema, LoginSchema, UpdateUserSchema } from "../model/dto/user.dto";
import { userController } from "../controller/user.controller";
import { authenticateToken, optionalAuth } from "../middleware/auth";

const router = Router();

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Créer un nouvel utilisateur
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 */
router.post("/users", validate(CreateUserSchema), userController.createUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authentifier un utilisateur
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 */
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
