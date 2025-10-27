"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentController = exports.DocumentController = void 0;
const base_response_utils_1 = require("../utils/base_response.utils");
const document_service_1 = require("../service/document.service");
const base_controller_1 = require("./base.controller");
class DocumentController extends base_controller_1.BaseController {
    constructor() {
        const documentService = new document_service_1.DocumentService();
        super(documentService);
        this.createDocument = async (req, res) => {
            try {
                const documentData = req.body;
                const result = await this.documentService.createDocument(documentData);
                if (!result.success) {
                    const statusCode = this.getStatusCodeFromError(result.error);
                    return res.status(statusCode).json((0, base_response_utils_1.fail)(result.message));
                }
                return res.status(201).json((0, base_response_utils_1.ok)(result.message, result.data));
            }
            catch (error) {
                console.error("❌ Erreur dans DocumentController.createDocument:", error);
                return res.status(500).json((0, base_response_utils_1.fail)("Erreur serveur interne"));
            }
        };
        this.documentService = documentService;
    }
}
exports.DocumentController = DocumentController;
exports.documentController = new DocumentController();
