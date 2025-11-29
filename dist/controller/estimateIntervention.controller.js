"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.estimateInterventionController = exports.EstimateInterventionController = void 0;
const estimateIntervention_service_1 = require("../service/remote/estimateIntervention.service");
const base_response_utils_1 = require("../utils/base_response.utils");
/**
 * Contrôleur pour l'estimation d'intervention avec Gemini Pro
 */
class EstimateInterventionController {
    constructor() {
        /**
         * Estime le temps nécessaire pour une intervention
         * POST /api/interventions/:id/estimate
         * @param req - Request avec l'ID de l'intervention dans les paramètres
         * @param res - Response
         */
        this.estimateIntervention = async (req, res) => {
            try {
                const { id } = req.params;
                // Validation de l'ID
                if (!id) {
                    return res.status(400).json((0, base_response_utils_1.fail)("L'ID de l'intervention est requis"));
                }
                // Appeler le service
                const result = await this.estimateInterventionService.estimateInterventionTime(id);
                if (!result.success) {
                    const statusCode = this.getStatusCodeFromError(result.error);
                    return res.status(statusCode).json((0, base_response_utils_1.fail)(result.message));
                }
                return res.status(200).json((0, base_response_utils_1.ok)(result.message, result.data));
            }
            catch (error) {
                console.error("❌ Erreur dans EstimateInterventionController.estimateIntervention:", error);
                return res.status(500).json((0, base_response_utils_1.fail)("Erreur serveur interne"));
            }
        };
        this.estimateInterventionService = new estimateIntervention_service_1.EstimateInterventionService();
    }
    /**
     * Convertit les codes d'erreur en codes de statut HTTP
     */
    getStatusCodeFromError(error) {
        switch (error) {
            case "INTERVENTION_NOT_FOUND":
                return 404;
            case "GEMINI_CONFIG_ERROR":
                return 500;
            case "GEMINI_API_ERROR":
                return 502;
            case "GEMINI_PARSE_ERROR":
                return 502;
            case "DATABASE_ERROR":
                return 500;
            default:
                return 400;
        }
    }
}
exports.EstimateInterventionController = EstimateInterventionController;
exports.estimateInterventionController = new EstimateInterventionController();
