"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageController = exports.ImageController = void 0;
const base_response_utils_1 = require("../utils/base_response.utils");
const image_service_1 = require("../service/image.service");
const base_controller_1 = require("./base.controller");
class ImageController extends base_controller_1.BaseController {
    constructor() {
        const imageService = new image_service_1.ImageService();
        super(imageService);
        this.createImage = async (req, res) => {
            try {
                const imageData = req.body;
                const result = await this.imageService.createImage(imageData);
                if (!result.success) {
                    const statusCode = this.getStatusCodeFromError(result.error);
                    return res.status(statusCode).json((0, base_response_utils_1.fail)(result.message));
                }
                return res.status(201).json((0, base_response_utils_1.ok)(result.message, result.data));
            }
            catch (error) {
                console.error("❌ Erreur dans ImageController.createImage:", error);
                return res.status(500).json((0, base_response_utils_1.fail)("Erreur serveur interne"));
            }
        };
        /**
         * Liste les images par ID d'intervention
         * GET /images/interventions/:idIntervention
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
                const result = await this.imageService.findManyByInterventionId(idIntervention, options);
                if (!result.success) {
                    const statusCode = this.getStatusCodeFromError(result.error);
                    return res.status(statusCode).json((0, base_response_utils_1.fail)(result.message));
                }
                return res.status(200).json((0, base_response_utils_1.ok)(result.message, result.data));
            }
            catch (error) {
                console.error("❌ Erreur dans ImageController.getByInterventionId:", error);
                return res.status(500).json((0, base_response_utils_1.fail)("Erreur serveur interne"));
            }
        };
        this.imageService = imageService;
    }
}
exports.ImageController = ImageController;
exports.imageController = new ImageController();
