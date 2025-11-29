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
exports.DocumentService = void 0;
const document_repository_1 = require("../repository/document.repository");
const base_service_1 = require("./base.service");
class DocumentService extends base_service_1.BaseService {
    constructor() {
        const documentRepository = new document_repository_1.DocumentRepository();
        super(documentRepository);
        this.documentRepository = documentRepository;
    }
    async createDocument(documentData) {
        try {
            const documentDataToCreate = {
                filename: documentData.filename.trim(),
                data: documentData.data,
                idIntervention: documentData.idIntervention,
            };
            const result = await this.create(documentDataToCreate);
            return result;
        }
        catch (error) {
            return this.handleError(error, "Erreur lors de la création du document");
        }
    }
    /**
     * Récupère les documents par intervention avec pagination
     */
    async findManyByInterventionId(idIntervention, options = {}) {
        try {
            const data = await this.documentRepository.findMany({ idIntervention }, options);
            return {
                success: true,
                data,
                message: "Documents récupérés avec succès",
            };
        }
        catch (error) {
            return this.handleError(error, "Erreur lors de la récupération des documents par intervention");
        }
    }
    async validateCreate(data) {
        if (!data.filename || data.filename.trim().length === 0) {
            throw new Error("Le nom de fichier est requis");
        }
        if (!data.data || data.data.trim().length === 0) {
            throw new Error("Les données du document sont requises");
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
        if (data.filename && data.filename.trim().length === 0) {
            throw new Error("Le nom de fichier ne peut pas être vide");
        }
        if (data.data && data.data.trim().length === 0) {
            throw new Error("Les données ne peuvent pas être vides");
        }
    }
    async validateDelete(id) {
        // Pas de validation spéciale pour la suppression
    }
}
exports.DocumentService = DocumentService;
