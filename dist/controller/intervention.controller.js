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
        this.interventionService = interventionService;
    }
}
exports.InterventionController = InterventionController;
// Export des instances pour les routes
exports.interventionController = new InterventionController();
