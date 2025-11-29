"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recognizeImageController = exports.RecognizeImageController = void 0;
const recognizeImage_service_1 = require("../service/remote/recognizeImage.service");
const base_response_utils_1 = require("../utils/base_response.utils");
/**
 * Contrôleur pour la reconnaissance d'image avec Google Cloud Vision API
 * Spécialisé pour la reconnaissance de matériel et d'outils
 */
class RecognizeImageController {
    constructor() {
        /**
         * Effectue une reconnaissance d'image pour identifier du matériel/outils
         * POST /api/recognize-image
         * Body: { image: base64 string }
         */
        this.recognizeImage = async (req, res) => {
            try {
                const { image } = req.body;
                // Validation de l'image
                if (!image) {
                    return res.status(400).json((0, base_response_utils_1.fail)("Le champ 'image' est requis (format base64)"));
                }
                // Convertir l'image base64 en buffer
                let imageBuffer;
                try {
                    // Supprimer le préfixe data:image/...;base64, si présent
                    const base64Data = image.includes(",") ? image.split(",")[1] : image;
                    imageBuffer = Buffer.from(base64Data, "base64");
                }
                catch (error) {
                    return res.status(400).json((0, base_response_utils_1.fail)("Format d'image base64 invalide"));
                }
                // Appeler le service
                const result = await this.recognizeImageService.recognizeImage(imageBuffer);
                if (!result.success) {
                    const statusCode = this.getStatusCodeFromError(result.error);
                    return res.status(statusCode).json((0, base_response_utils_1.fail)(result.message));
                }
                return res.status(200).json((0, base_response_utils_1.ok)(result.message, result.data));
            }
            catch (error) {
                console.error("❌ Erreur dans RecognizeImageController.recognizeImage:", error);
                return res.status(500).json((0, base_response_utils_1.fail)("Erreur serveur interne"));
            }
        };
        /**
         * Effectue une reconnaissance d'image depuis un fichier uploadé
         * POST /api/recognize-image-upload
         * Form-data: { image: File }
         */
        this.recognizeImageUpload = async (req, res) => {
            try {
                const file = req.file;
                // Validation du fichier
                if (!file) {
                    return res.status(400).json((0, base_response_utils_1.fail)("Aucun fichier image fourni"));
                }
                // Validation du type MIME
                const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
                if (!allowedMimeTypes.includes(file.mimetype)) {
                    return res.status(400).json((0, base_response_utils_1.fail)(`Type de fichier non supporté. Types supportés: ${allowedMimeTypes.join(", ")}`));
                }
                // Appeler le service avec le buffer du fichier
                const result = await this.recognizeImageService.recognizeImage(file.buffer);
                if (!result.success) {
                    const statusCode = this.getStatusCodeFromError(result.error);
                    return res.status(statusCode).json((0, base_response_utils_1.fail)(result.message));
                }
                return res.status(200).json((0, base_response_utils_1.ok)(result.message, result.data));
            }
            catch (error) {
                console.error("❌ Erreur dans RecognizeImageController.recognizeImageUpload:", error);
                return res.status(500).json((0, base_response_utils_1.fail)("Erreur serveur interne"));
            }
        };
        this.recognizeImageService = new recognizeImage_service_1.RecognizeImageService();
    }
    /**
     * Convertit les codes d'erreur en codes de statut HTTP
     */
    getStatusCodeFromError(error) {
        switch (error) {
            case "GOOGLE_CLOUD_AUTH_ERROR":
                return 401;
            case "GOOGLE_CLOUD_QUOTA_EXCEEDED":
                return 429;
            case "GOOGLE_CLOUD_UNAVAILABLE":
                return 503;
            case "GOOGLE_CLOUD_TIMEOUT":
                return 504;
            case "GOOGLE_CLOUD_CONFIG_ERROR":
                return 500;
            case "INVALID_IMAGE_FORMAT":
            case "INVALID_IMAGE_BUFFER":
                return 400;
            case "IMAGE_TOO_LARGE":
                return 413;
            default:
                return 400;
        }
    }
}
exports.RecognizeImageController = RecognizeImageController;
exports.recognizeImageController = new RecognizeImageController();
