"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaterielRepository = void 0;
const prisma_1 = require("../utils/prisma");
const base_repository_1 = require("./base.repository");
class MaterielRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(prisma_1.prisma.materiel, "Materiel");
    }
    /**
     * Définit les champs à sélectionner pour les requêtes
     */
    getSelectFields() {
        return {
            id: true,
            name: true,
            quantity: true,
            idIntervention: true,
            createdAt: true,
            updatedAt: true,
        };
    }
}
exports.MaterielRepository = MaterielRepository;
