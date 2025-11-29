"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signatureController = exports.SignatureController = void 0;
const base_response_utils_1 = require("../utils/base_response.utils");
const signature_service_1 = require("../service/signature.service");
const base_controller_1 = require("./base.controller");
class SignatureController extends base_controller_1.BaseController {
    constructor() {
        const signatureService = new signature_service_1.SignatureService();
        super(signatureService);
        this.createSignature = async (req, res) => {
            try {
                const signatureData = req.body;
                const result = await this.signatureService.createSignature(signatureData);
                if (!result.success) {
                    const statusCode = this.getStatusCodeFromError(result.error);
                    return res.status(statusCode).json((0, base_response_utils_1.fail)(result.message));
                }
                return res.status(201).json((0, base_response_utils_1.ok)(result.message, result.data));
            }
            catch (error) {
                console.error("❌ Erreur dans SignatureController.createSignature:", error);
                return res.status(500).json((0, base_response_utils_1.fail)("Erreur serveur interne"));
            }
        };
        /**
         * Liste les signatures par ID d'intervention
         * GET /signatures/interventions/:idIntervention
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
                const result = await this.signatureService.findManyByInterventionId(idIntervention, options);
                if (!result.success) {
                    const statusCode = this.getStatusCodeFromError(result.error);
                    return res.status(statusCode).json((0, base_response_utils_1.fail)(result.message));
                }
                return res.status(200).json((0, base_response_utils_1.ok)(result.message, result.data));
            }
            catch (error) {
                console.error("❌ Erreur dans SignatureController.getByInterventionId:", error);
                return res.status(500).json((0, base_response_utils_1.fail)("Erreur serveur interne"));
            }
        };
        this.signatureService = signatureService;
    }
}
exports.SignatureController = SignatureController;
exports.signatureController = new SignatureController();
