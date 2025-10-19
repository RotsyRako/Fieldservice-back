"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
/**
 * Repository de base générique pour toutes les entités
 * Fournit les opérations CRUD de base
 */
class BaseRepository {
    constructor(model, modelName) {
        this.model = model;
        this.modelName = modelName;
    }
    /**
     * Crée une nouvelle entité
     */
    async create(data) {
        return await this.model.create({
            data,
            select: this.getSelectFields(),
        });
    }
    /**
     * Trouve une entité par son ID
     */
    async findById(id) {
        return await this.model.findUnique({
            where: { id },
            select: this.getSelectFields(),
        });
    }
    /**
     * Trouve toutes les entités avec pagination
     */
    async findAll(options = {}) {
        const { page = 1, limit = 10, orderBy = 'createdAt', orderDirection = 'desc' } = options;
        const skip = (page - 1) * limit;
        const take = limit;
        const [data, total] = await Promise.all([
            this.model.findMany({
                skip,
                take,
                select: this.getSelectFields(),
                orderBy: {
                    [orderBy]: orderDirection,
                },
            }),
            this.model.count(),
        ]);
        return {
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    /**
     * Met à jour une entité
     */
    async update(id, data) {
        return await this.model.update({
            where: { id },
            data,
            select: this.getSelectFields(),
        });
    }
    /**
     * Supprime une entité
     */
    async delete(id) {
        await this.model.delete({
            where: { id },
        });
    }
    /**
     * Compte le nombre total d'entités
     */
    async count() {
        return await this.model.count();
    }
    /**
     * Trouve une entité par un champ unique
     */
    async findByField(field, value) {
        return await this.model.findUnique({
            where: { [field]: value },
        });
    }
    /**
     * Trouve la première entité correspondant aux critères
     */
    async findFirst(where) {
        return await this.model.findFirst({
            where,
            select: this.getSelectFields(),
        });
    }
    /**
     * Trouve plusieurs entités correspondant aux critères
     */
    async findMany(where, options = {}) {
        const { page = 1, limit = 10, orderBy = 'createdAt', orderDirection = 'desc' } = options;
        const skip = (page - 1) * limit;
        const take = limit;
        return await this.model.findMany({
            where,
            skip,
            take,
            select: this.getSelectFields(),
            orderBy: {
                [orderBy]: orderDirection,
            },
        });
    }
    /**
     * Vérifie si une entité existe
     */
    async exists(id) {
        const entity = await this.model.findUnique({
            where: { id },
            select: { id: true },
        });
        return entity !== null;
    }
    /**
     * Vérifie si une entité existe par un champ
     */
    async existsByField(field, value) {
        const entity = await this.model.findFirst({
            where: { [field]: value },
            select: { id: true },
        });
        return entity !== null;
    }
    /**
     * Méthode pour gérer les erreurs Prisma
     */
    handlePrismaError(error) {
        if (error?.code === "P2002") {
            throw new Error("Contrainte unique violée");
        }
        if (error?.code === "P2025") {
            throw new Error("Enregistrement non trouvé");
        }
        if (error?.code === "P1001") {
            throw new Error("Erreur de connexion à la base de données");
        }
        throw error;
    }
}
exports.BaseRepository = BaseRepository;
