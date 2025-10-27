"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimesheetRepository = void 0;
const prisma_1 = require("../utils/prisma");
const base_repository_1 = require("./base.repository");
class TimesheetRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(prisma_1.prisma.timesheet, "Timesheet");
    }
    /**
     * Définit les champs à sélectionner pour les requêtes
     */
    getSelectFields() {
        return {
            id: true,
            description: true,
            timeAllocated: true,
            date: true,
            idIntervention: true,
            createdAt: true,
            updatedAt: true,
        };
    }
}
exports.TimesheetRepository = TimesheetRepository;
