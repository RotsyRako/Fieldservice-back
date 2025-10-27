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
exports.TimesheetService = void 0;
const timesheet_repository_1 = require("../repository/timesheet.repository");
const base_service_1 = require("./base.service");
class TimesheetService extends base_service_1.BaseService {
    constructor() {
        const timesheetRepository = new timesheet_repository_1.TimesheetRepository();
        super(timesheetRepository);
        this.timesheetRepository = timesheetRepository;
    }
    /**
     * Crée un nouveau timesheet avec validation métier
     */
    async createTimesheet(timesheetData) {
        try {
            const timesheetDataToCreate = {
                description: timesheetData.description.trim(),
                timeAllocated: timesheetData.timeAllocated,
                date: timesheetData.date,
                idIntervention: timesheetData.idIntervention,
            };
            const result = await this.create(timesheetDataToCreate);
            return result;
        }
        catch (error) {
            return this.handleError(error, "Erreur lors de la création du timesheet");
        }
    }
    /**
     * Validation métier avant création
     */
    async validateCreate(data) {
        // Validation de la description
        if (!data.description || data.description.trim().length === 0) {
            throw new Error("La description est requise");
        }
        // Validation du temps alloué
        if (!data.timeAllocated || data.timeAllocated <= 0) {
            throw new Error("Le temps alloué doit être un nombre positif");
        }
        // Validation de la date
        if (!data.date) {
            throw new Error("La date est requise");
        }
        // Validation du format de date (dd/mm/YYYY)
        const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!dateRegex.test(data.date)) {
            throw new Error("Le format de date doit être dd/mm/YYYY");
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
        // Validation de la description si fournie
        if (data.description && data.description.trim().length === 0) {
            throw new Error("La description ne peut pas être vide");
        }
        // Validation du temps alloué si fourni
        if (data.timeAllocated !== undefined && data.timeAllocated <= 0) {
            throw new Error("Le temps alloué doit être un nombre positif");
        }
        // Validation de la date si fournie
        if (data.date) {
            const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
            if (!dateRegex.test(data.date)) {
                throw new Error("Le format de date doit être dd/mm/YYYY");
            }
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
        // Par exemple : vérifier que le timesheet n'est pas verrouillé
        // Pour l'instant, on permet la suppression
    }
}
exports.TimesheetService = TimesheetService;
