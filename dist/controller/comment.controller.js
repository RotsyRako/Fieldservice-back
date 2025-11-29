"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentController = exports.CommentController = void 0;
const base_response_utils_1 = require("../utils/base_response.utils");
const comment_service_1 = require("../service/comment.service");
const base_controller_1 = require("./base.controller");
class CommentController extends base_controller_1.BaseController {
    constructor() {
        const commentService = new comment_service_1.CommentService();
        super(commentService);
        this.createComment = async (req, res) => {
            try {
                console.log("📝 [CONTROLLER] CommentController.createComment - Début");
                console.log("📝 [CONTROLLER] Body reçu:", JSON.stringify(req.body, null, 2));
                console.log("📝 [CONTROLLER] Type de body:", typeof req.body);
                console.log("📝 [CONTROLLER] Clés du body:", Object.keys(req.body || {}));
                const commentData = req.body;
                console.log("📝 [CONTROLLER] CommentData après cast:", JSON.stringify(commentData, null, 2));
                console.log("📝 [CONTROLLER] Appel du service...");
                const result = await this.commentService.createComment(commentData);
                console.log("📝 [CONTROLLER] Résultat du service:", JSON.stringify(result, null, 2));
                if (!result.success) {
                    console.log("❌ [CONTROLLER] Échec du service:", result.message);
                    const statusCode = this.getStatusCodeFromError(result.error);
                    return res.status(statusCode).json((0, base_response_utils_1.fail)(result.message));
                }
                console.log("✅ [CONTROLLER] Succès, retour de la réponse");
                return res.status(201).json((0, base_response_utils_1.ok)(result.message, result.data));
            }
            catch (error) {
                console.error("❌ [CONTROLLER] Erreur dans CommentController.createComment:", error);
                return res.status(500).json((0, base_response_utils_1.fail)("Erreur serveur interne"));
            }
        };
        /**
         * Liste les commentaires par ID d'intervention
         * GET /comments/interventions/:idIntervention
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
                const result = await this.commentService.findManyByInterventionId(idIntervention, options);
                if (!result.success) {
                    const statusCode = this.getStatusCodeFromError(result.error);
                    return res.status(statusCode).json((0, base_response_utils_1.fail)(result.message));
                }
                return res.status(200).json((0, base_response_utils_1.ok)(result.message, result.data));
            }
            catch (error) {
                console.error("❌ Erreur dans CommentController.getByInterventionId:", error);
                return res.status(500).json((0, base_response_utils_1.fail)("Erreur serveur interne"));
            }
        };
        this.commentService = commentService;
    }
}
exports.CommentController = CommentController;
exports.commentController = new CommentController();
