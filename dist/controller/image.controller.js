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
        this.imageService = imageService;
    }
}
exports.ImageController = ImageController;
exports.imageController = new ImageController();
