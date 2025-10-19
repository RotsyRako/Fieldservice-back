"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = exports.UserController = void 0;
const base_response_utils_1 = require("../utils/base_response.utils");
const user_service_1 = require("../service/user.service");
const base_controller_1 = require("./base.controller");
class UserController extends base_controller_1.BaseController {
    constructor() {
        const userService = new user_service_1.UserService();
        super(userService);
        /**
         * Crée un nouvel utilisateur (override de la méthode create du BaseController)
         */
        this.createUser = async (req, res) => {
            try {
                const userData = req.body;
                const result = await this.userService.createUser(userData);
                if (!result.success) {
                    const statusCode = this.getStatusCodeFromError(result.error);
                    return res.status(statusCode).json((0, base_response_utils_1.fail)(result.message));
                }
                return res.status(201).json((0, base_response_utils_1.ok)(result.message, result.data));
            }
            catch (error) {
                console.error("❌ Erreur dans UserController.createUser:", error);
                return res.status(500).json((0, base_response_utils_1.fail)("Erreur serveur interne"));
            }
        };
        /**
         * Authentifie un utilisateur
         */
        this.authenticateUser = async (req, res) => {
            try {
                const { email, password } = req.body;
                const result = await this.userService.authenticateUser(email, password);
                if (!result.success) {
                    const statusCode = this.getStatusCodeFromError(result.error);
                    return res.status(statusCode).json((0, base_response_utils_1.fail)(result.message));
                }
                return res.status(200).json((0, base_response_utils_1.ok)(result.message, result.data));
            }
            catch (error) {
                console.error("❌ Erreur dans UserController.authenticateUser:", error);
                return res.status(500).json((0, base_response_utils_1.fail)("Erreur serveur interne"));
            }
        };
        /**
         * Récupère un utilisateur par son email
         */
        this.getUserByEmail = async (req, res) => {
            try {
                const { email } = req.params;
                const result = await this.userService.getUserByEmail(email);
                if (!result.success) {
                    const statusCode = this.getStatusCodeFromError(result.error);
                    return res.status(statusCode).json((0, base_response_utils_1.fail)(result.message));
                }
                return res.status(200).json((0, base_response_utils_1.ok)(result.message, result.data));
            }
            catch (error) {
                console.error("❌ Erreur dans UserController.getUserByEmail:", error);
                return res.status(500).json((0, base_response_utils_1.fail)("Erreur serveur interne"));
            }
        };
        /**
         * Met à jour un utilisateur (override de la méthode update du BaseController)
         */
        this.updateUser = async (req, res) => {
            try {
                const { id } = req.params;
                const updateData = req.body;
                const result = await this.userService.updateUser(id, updateData);
                if (!result.success) {
                    const statusCode = this.getStatusCodeFromError(result.error);
                    return res.status(statusCode).json((0, base_response_utils_1.fail)(result.message));
                }
                return res.status(200).json((0, base_response_utils_1.ok)(result.message, result.data));
            }
            catch (error) {
                console.error("❌ Erreur dans UserController.updateUser:", error);
                return res.status(500).json((0, base_response_utils_1.fail)("Erreur serveur interne"));
            }
        };
        this.userService = userService;
    }
    /**
     * Convertit les codes d'erreur en codes de statut HTTP
     * Override de la méthode du BaseController pour ajouter les erreurs spécifiques aux utilisateurs
     */
    getStatusCodeFromError(error) {
        switch (error) {
            case "EMAIL_ALREADY_EXISTS":
                return 409;
            case "INVALID_CREDENTIALS":
                return 401;
            case "INVALID_TOKEN":
                return 401;
            case "TOKEN_GENERATION_FAILED":
                return 500;
            case "USER_NOT_FOUND":
                return 404;
            default:
                return super.getStatusCodeFromError(error);
        }
    }
}
exports.UserController = UserController;
// Export des instances pour les routes
exports.userController = new UserController();
