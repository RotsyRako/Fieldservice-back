"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interventionController = exports.InterventionController = void 0;
const base_response_utils_1 = require("../utils/base_response.utils");
const intervention_service_1 = require("../service/intervention.service");
const base_controller_1 = require("./base.controller");
class InterventionController extends base_controller_1.BaseController {
    constructor() {
        const interventionService = new intervention_service_1.InterventionService();
        super(interventionService);
        /**
         * Crée une nouvelle intervention (override de la méthode create du BaseController)
         */
        this.createIntervention = async (req, res) => {
            try {
                const interventionData = req.body;
                console.log("🔍 Données reçues:", interventionData);
                console.log("🔍 Utilisateur dans la requête:", req.user);
                // Extraire l'ID utilisateur depuis le token JWT
                const userId = req.user?.id;
                if (!userId) {
                    console.log("❌ Aucun ID utilisateur trouvé dans le token");
                    return res.status(401).json((0, base_response_utils_1.fail)("ID utilisateur non trouvé dans le token"));
                }
                console.log("✅ ID utilisateur trouvé:", userId);
                // Ajouter l'ID utilisateur aux données
                const interventionDataWithUser = {
                    ...interventionData,
                    userId: userId
                };
                console.log("🔍 Données avec utilisateur:", interventionDataWithUser);
                const result = await this.interventionService.createIntervention(interventionDataWithUser);
                if (!result.success) {
                    const statusCode = this.getStatusCodeFromError(result.error);
                    return res.status(statusCode).json((0, base_response_utils_1.fail)(result.message));
                }
                return res.status(201).json((0, base_response_utils_1.ok)(result.message, result.data));
            }
            catch (error) {
                console.error("❌ Erreur dans InterventionController.createIntervention:", error);
                return res.status(500).json((0, base_response_utils_1.fail)("Erreur serveur interne"));
            }
        };
        /**
         * Liste les interventions par ID utilisateur
         * GET /users/:userId/interventions
         */
        this.getByUserId = async (req, res) => {
            try {
                const { userId } = req.params;
                if (!userId) {
                    return res.status(400).json((0, base_response_utils_1.fail)("Paramètre userId requis"));
                }
                const options = {
                    page: parseInt(req.query.page) || 1,
                    limit: parseInt(req.query.limit) || 10,
                    orderBy: req.query.orderBy || "createdAt",
                    orderDirection: req.query.orderDirection || "desc",
                };
                const result = await this.interventionService.findManyByUserId(userId, options);
                if (!result.success) {
                    const statusCode = this.getStatusCodeFromError(result.error);
                    return res.status(statusCode).json((0, base_response_utils_1.fail)(result.message));
                }
                return res.status(200).json((0, base_response_utils_1.ok)(result.message, result.data));
            }
            catch (error) {
                console.error("❌ Erreur dans InterventionController.getByUserId:", error);
                return res.status(500).json((0, base_response_utils_1.fail)("Erreur serveur interne"));
            }
        };
        /**
         * Liste les interventions de l'utilisateur authentifié
         * GET /interventions/me
         */
        this.getUserInterventions = async (req, res) => {
            try {
                const userId = req.user?.id;
                if (!userId) {
                    return res.status(401).json((0, base_response_utils_1.fail)("Utilisateur non authentifié"));
                }
                const options = {
                    page: parseInt(req.query.page) || 1,
                    limit: parseInt(req.query.limit) || 10,
                    orderBy: req.query.orderBy || "createdAt",
                    orderDirection: req.query.orderDirection || "desc",
                };
                const result = await this.interventionService.findManyByUserId(userId, options);
                if (!result.success) {
                    const statusCode = this.getStatusCodeFromError(result.error);
                    return res.status(statusCode).json((0, base_response_utils_1.fail)(result.message));
                }
                return res.status(200).json((0, base_response_utils_1.ok)(result.message, result.data));
            }
            catch (error) {
                console.error("❌ Erreur dans InterventionController.getMine:", error);
                return res.status(500).json((0, base_response_utils_1.fail)("Erreur serveur interne"));
            }
        };
        /**
         * Synchronise les interventions avec leurs données associées
         * POST /interventions/sync
         */
        this.syncInterventions = async (req, res) => {
            try {
                const syncData = req.body;
                const result = await this.interventionService.syncInterventions(syncData);
                if (!result.success) {
                    const statusCode = this.getStatusCodeFromError(result.error);
                    return res.status(statusCode).json((0, base_response_utils_1.fail)(result.message));
                }
                // Retourner seulement les interventions si succès
                return res.status(200).json((0, base_response_utils_1.ok)(result.message, result.data));
            }
            catch (error) {
                console.error("❌ Erreur dans InterventionController.syncInterventions:", error);
                return res.status(500).json((0, base_response_utils_1.fail)("Erreur serveur interne"));
            }
        };
        this.interventionService = interventionService;
    }
}
exports.InterventionController = InterventionController;
// Export des instances pour les routes
exports.interventionController = new InterventionController();
