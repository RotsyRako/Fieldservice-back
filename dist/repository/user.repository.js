"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const prisma_1 = require("../utils/prisma");
const base_repository_1 = require("./base.repository");
class UserRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(prisma_1.prisma.user, "User");
    }
    /**
     * Définit les champs à sélectionner pour les requêtes
     */
    getSelectFields() {
        return {
            id: true,
            email: true,
            name: true,
            token: true,
            createdAt: true,
        };
    }
    /**
     * Trouve un utilisateur par son email (avec mot de passe pour l'authentification)
     */
    async findByEmail(email) {
        return await prisma_1.prisma.user.findUnique({
            where: { email: email.toLowerCase().trim() },
        });
    }
    /**
     * Vérifie si un email existe déjà
     */
    async emailExists(email) {
        return await this.existsByField("email", email.toLowerCase().trim());
    }
    /**
     * Trouve un utilisateur par son email (sans mot de passe)
     */
    async findByEmailSafe(email) {
        return await this.findFirst({ email: email.toLowerCase().trim() });
    }
}
exports.UserRepository = UserRepository;
