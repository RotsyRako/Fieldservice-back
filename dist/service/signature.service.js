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
exports.SignatureService = void 0;
const signature_repository_1 = require("../repository/signature.repository");
const base_service_1 = require("./base.service");
class SignatureService extends base_service_1.BaseService {
    constructor() {
        const signatureRepository = new signature_repository_1.SignatureRepository();
        super(signatureRepository);
        this.signatureRepository = signatureRepository;
    }
    async createSignature(signatureData) {
        try {
            const signatureDataToCreate = {
                filename: signatureData.filename.trim(),
                data: signatureData.data,
                idIntervention: signatureData.idIntervention,
            };
            const result = await this.create(signatureDataToCreate);
            return result;
        }
        catch (error) {
            return this.handleError(error, "Erreur lors de la création de la signature");
        }
    }
    /**
     * Récupère les signatures par intervention avec pagination
     */
    async findManyByInterventionId(idIntervention, options = {}) {
        try {
            const data = await this.signatureRepository.findMany({ idIntervention }, options);
            return {
                success: true,
                data,
                message: "Signatures récupérées avec succès",
            };
        }
        catch (error) {
            return this.handleError(error, "Erreur lors de la récupération des signatures par intervention");
        }
    }
    async validateCreate(data) {
        if (!data.filename || data.filename.trim().length === 0) {
            throw new Error("Le nom de fichier est requis");
        }
        if (!data.data || data.data.trim().length === 0) {
            throw new Error("Les données de la signature sont requises");
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
exports.SignatureService = SignatureService;
