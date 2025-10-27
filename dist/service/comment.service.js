"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
const comment_repository_1 = require("../repository/comment.repository");
const base_service_1 = require("./base.service");
class CommentService extends base_service_1.BaseService {
    constructor() {
        const commentRepository = new comment_repository_1.CommentRepository();
        super(commentRepository);
        this.commentRepository = commentRepository;
    }
    async createComment(commentData) {
        try {
            console.log("📝 CommentService.createComment - Données reçues:", commentData);
            const commentDataToCreate = {
                message: commentData.message,
                date: commentData.date,
                attachmentFilename: commentData.attachmentFilename || null,
                attachmentData: commentData.attachmentData || null,
                idIntervention: commentData.idIntervention,
            };
            console.log("📝 CommentService.createComment - Données à créer:", commentDataToCreate);
            const result = await this.create(commentDataToCreate);
            return result;
        }
        catch (error) {
            console.error("❌ Erreur dans CommentService.createComment:", error);
            return this.handleError(error, "Erreur lors de la création du commentaire");
        }
    }
    async validateCreate(data) {
        if (!data.message || data.message.trim().length === 0) {
            throw new Error("Le message est requis");
        }
        if (!data.idIntervention) {
            throw new Error("L'ID intervention est requis");
        }
        const { prisma } = await Promise.resolve().then(() => __importStar(require("../utils/prisma")));
        const intervention = await prisma.intervention.findUnique({
            where: { id: data.idIntervention },
            select: { id: true }
        });
        if (!intervention) {
            throw new Error("L'intervention spécifiée n'existe pas");
        }
    }
    async validateUpdate(id, data) {
        if (data.message && data.message.trim().length === 0) {
            throw new Error("Le message ne peut pas être vide");
        }
        if (data.idIntervention) {
            const { prisma } = await Promise.resolve().then(() => __importStar(require("../utils/prisma")));
            const intervention = await prisma.intervention.findUnique({
                where: { id: data.idIntervention },
                select: { id: true }
            });
            if (!intervention) {
                throw new Error("L'intervention spécifiée n'existe pas");
            }
        }
    }
    async validateDelete(id) {
        // Pas de validation spéciale pour la suppression
    }
}
exports.CommentService = CommentService;
