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
exports.MaterielService = void 0;
const materiel_repository_1 = require("../repository/materiel.repository");
const base_service_1 = require("./base.service");
class MaterielService extends base_service_1.BaseService {
    constructor() {
        const materielRepository = new materiel_repository_1.MaterielRepository();
        super(materielRepository);
        this.materielRepository = materielRepository;
    }
    /**
     * Crée un nouveau matériel avec validation métier
     */
    async createMateriel(materielData) {
        try {
            const materielDataToCreate = {
                name: materielData.name.trim(),
                quantity: materielData.quantity,
                idIntervention: materielData.idIntervention,
            };
            const result = await this.create(materielDataToCreate);
            return result;
        }
        catch (error) {
            return this.handleError(error, "Erreur lors de la création du matériel");
        }
    }
    /**
     * Récupère les matériels par intervention avec pagination
     */
    async findManyByInterventionId(idIntervention, options = {}) {
        try {
            const data = await this.materielRepository.findMany({ idIntervention }, options);
            return {
                success: true,
                data,
                message: "Matériels récupérés avec succès",
            };
        }
        catch (error) {
            return this.handleError(error, "Erreur lors de la récupération des matériels par intervention");
        }
    }
    /**
     * Validation métier avant création
     */
    async validateCreate(data) {
        // Validation du nom
        if (!data.name || data.name.trim().length === 0) {
            throw new Error("Le nom du matériel est requis");
        }
        // Validation de la quantité
        if (!data.quantity || data.quantity < 1) {
            throw new Error("La quantité doit être un entier positif");
        }
        // Validation de l'intervention
        if (!data.idIntervention) {
            throw new Error("L'ID intervention est requis");
        }
        // Vérifier que l'intervention existe
        const { prisma } = await Promise.resolve().then(() => __importStar(require("../utils/prisma")));
        const intervention = await prisma.intervention.findUnique({
            where: { id: data.idIntervention },
            select: { id: true }
        });
        if (!intervention) {
            throw new Error("L'intervention spécifiée n'existe pas");
        }
    }
    /**
     * Validation métier avant mise à jour
     */
    async validateUpdate(id, data) {
        // Validation du nom si fourni
        if (data.name && data.name.trim().length === 0) {
            throw new Error("Le nom du matériel ne peut pas être vide");
        }
        // Validation de la quantité si fournie
        if (data.quantity !== undefined && data.quantity < 1) {
            throw new Error("La quantité doit être un entier positif");
        }
        // Validation de l'intervention si fournie
        if (data.idIntervention && !data.idIntervention) {
            throw new Error("L'ID intervention ne peut pas être vide");
        }
    }
    /**
     * Validation métier avant suppression
     */
    async validateDelete(id) {
        // Ici on pourrait ajouter des validations spécifiques
        // Par exemple : vérifier que le matériel n'est pas en cours d'utilisation
        // Pour l'instant, on permet la suppression
    }
}
exports.MaterielService = MaterielService;
