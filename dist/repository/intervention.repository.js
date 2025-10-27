"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterventionRepository = void 0;
const prisma_1 = require("../utils/prisma");
const base_repository_1 = require("./base.repository");
class InterventionRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(prisma_1.prisma.intervention, "Intervention");
    }
    /**
     * Définit les champs à sélectionner pour les requêtes
     */
    getSelectFields() {
        return {
            id: true,
            titre: true,
            dateStart: true,
            dateEnd: true,
            status: true,
            priority: true,
            customer: true,
            long: true,
            lat: true,
            distance: true,
            description: true,
            userId: true,
            createdAt: true,
            updatedAt: true,
        };
    }
}
exports.InterventionRepository = InterventionRepository;
