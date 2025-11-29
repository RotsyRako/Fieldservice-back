"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.materielController = exports.MaterielController = void 0;
const base_response_utils_1 = require("../utils/base_response.utils");
const materiel_service_1 = require("../service/materiel.service");
const base_controller_1 = require("./base.controller");
class MaterielController extends base_controller_1.BaseController {
    constructor() {
        const materielService = new materiel_service_1.MaterielService();
        super(materielService);
        /**
         * Crée un nouveau matériel (override de la méthode create du BaseController)
         */
        this.createMateriel = async (req, res) => {
            try {
                const materielData = req.body;
                const result = await this.materielService.createMateriel(materielData);
                if (!result.success) {
                    const statusCode = this.getStatusCodeFromError(result.error);
                    return res.status(statusCode).json((0, base_response_utils_1.fail)(result.message));
                }
                return res.status(201).json((0, base_response_utils_1.ok)(result.message, result.data));
            }
            catch (error) {
                console.error("❌ Erreur dans MaterielController.createMateriel:", error);
                return res.status(500).json((0, base_response_utils_1.fail)("Erreur serveur interne"));
            }
        };
        /**
         * Liste les matériels par ID d'intervention
         * GET /materiels/interventions/:idIntervention
         */
        this.getByInterventionId = async (req, res) => {
            try {
                const { idIntervention } = req.params;
                if (!idIntervention) {
                    return res.status(400).json((0, base_response_utils_1.fail)("Paramètre idIntervention requis"));
                }
                const options = {
                    page: parseInt(req.query.page) || 1,
                    limit: parseInt(req.query.limit) || 10,
                    orderBy: req.query.orderBy || "createdAt",
                    orderDirection: req.query.orderDirection || "desc",
                };
                const result = await this.materielService.findManyByInterventionId(idIntervention, options);
                if (!result.success) {
                    const statusCode = this.getStatusCodeFromError(result.error);
                    return res.status(statusCode).json((0, base_response_utils_1.fail)(result.message));
                }
                return res.status(200).json((0, base_response_utils_1.ok)(result.message, result.data));
            }
            catch (error) {
                console.error("❌ Erreur dans MaterielController.getByInterventionId:", error);
                return res.status(500).json((0, base_response_utils_1.fail)("Erreur serveur interne"));
            }
        };
        this.materielService = materielService;
    }
}
exports.MaterielController = MaterielController;
// Export des instances pour les routes
exports.materielController = new MaterielController();
