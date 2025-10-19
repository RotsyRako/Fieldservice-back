"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_repository_1 = require("../repository/user.repository");
const base_service_1 = require("./base.service");
const jwt_utils_1 = require("../utils/jwt.utils");
class UserService extends base_service_1.BaseService {
    constructor() {
        const userRepository = new user_repository_1.UserRepository();
        super(userRepository);
        this.userRepository = userRepository;
    }
    /**
     * Crée un nouvel utilisateur avec validation métier
     * Override de la méthode create du BaseService
     */
    async createUser(userData) {
        try {
            const { email, password, name } = userData;
            // Validation métier : vérifier l'unicité de l'email
            const emailExists = await this.userRepository.emailExists(email);
            if (emailExists) {
                return {
                    success: false,
                    message: "Email déjà utilisé",
                    error: "EMAIL_ALREADY_EXISTS"
                };
            }
            // Hachage du mot de passe
            const hashedPassword = await bcrypt_1.default.hash(password, 10);
            // Création de l'utilisateur (sans token en base, on utilisera JWT)
            const userDataToCreate = {
                email: email.toLowerCase().trim(),
                password: hashedPassword,
                name: name.trim(),
                token: null, // Plus besoin de token en base avec JWT
            };
            const result = await this.create(userDataToCreate);
            if (result.success && result.data) {
                // Générer le token JWT avec les données utilisateur
                const jwtToken = jwt_utils_1.JWTUtils.generateToken(result.data);
                return {
                    success: true,
                    data: {
                        user: result.data,
                        token: jwtToken
                    },
                    message: "Utilisateur créé avec succès"
                };
            }
            return result;
        }
        catch (error) {
            return this.handleError(error, "Erreur lors de la création de l'utilisateur");
        }
    }
    /**
     * Authentifie un utilisateur (vérifie email + mot de passe)
     */
    async authenticateUser(email, password) {
        try {
            const user = await this.userRepository.findByEmail(email);
            if (!user) {
                return {
                    success: false,
                    message: "Email ou mot de passe incorrect",
                    error: "INVALID_CREDENTIALS"
                };
            }
            const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                return {
                    success: false,
                    message: "Email ou mot de passe incorrect",
                    error: "INVALID_CREDENTIALS"
                };
            }
            // Retourner sans le mot de passe
            const { password: _, ...userWithoutPassword } = user;
            // Générer le token JWT avec les données utilisateur
            const jwtToken = jwt_utils_1.JWTUtils.generateToken(userWithoutPassword);
            return {
                success: true,
                data: {
                    user: userWithoutPassword,
                    token: jwtToken
                },
                message: "Authentification réussie"
            };
        }
        catch (error) {
            return this.handleError(error, "Erreur lors de l'authentification");
        }
    }
    /**
     * Trouve un utilisateur par son email (sans mot de passe)
     */
    async getUserByEmail(email) {
        try {
            const user = await this.userRepository.findByEmailSafe(email);
            if (!user) {
                return {
                    success: false,
                    message: "Utilisateur non trouvé",
                    error: "USER_NOT_FOUND"
                };
            }
            return {
                success: true,
                data: user,
                message: "Utilisateur trouvé"
            };
        }
        catch (error) {
            return this.handleError(error, "Erreur lors de la récupération de l'utilisateur");
        }
    }
    /**
     * Met à jour un utilisateur avec validation métier
     * Override de la méthode update du BaseService
     */
    async updateUser(id, updateData) {
        try {
            // Si l'email est modifié, vérifier l'unicité
            if (updateData.email) {
                const existingUser = await this.userRepository.findById(id);
                if (existingUser && updateData.email !== existingUser.email) {
                    const emailExists = await this.userRepository.emailExists(updateData.email);
                    if (emailExists) {
                        return {
                            success: false,
                            message: "Email déjà utilisé",
                            error: "EMAIL_ALREADY_EXISTS"
                        };
                    }
                    updateData.email = updateData.email.toLowerCase().trim();
                }
            }
            // Si le mot de passe est modifié, le hasher
            if (updateData.password) {
                updateData.password = await bcrypt_1.default.hash(updateData.password, 10);
            }
            // Normaliser le nom s'il est modifié
            if (updateData.name) {
                updateData.name = updateData.name.trim();
            }
            const result = await this.update(id, updateData);
            return result;
        }
        catch (error) {
            return this.handleError(error, "Erreur lors de la mise à jour de l'utilisateur");
        }
    }
    /**
     * Validation métier avant création
     */
    async validateCreate(data) {
        // Validation de l'email
        if (!data.email || !data.email.includes('@')) {
            throw new Error("Email invalide");
        }
        // Validation du mot de passe
        if (!data.password || data.password.length < 6) {
            throw new Error("Le mot de passe doit avoir au moins 6 caractères");
        }
        // Validation du nom
        if (!data.name || data.name.trim().length === 0) {
            throw new Error("Le nom est requis");
        }
        // Plus besoin de valider le token avec JWT
    }
    /**
     * Validation métier avant mise à jour
     */
    async validateUpdate(id, data) {
        // Validation de l'email si fourni
        if (data.email && !data.email.includes('@')) {
            throw new Error("Email invalide");
        }
        // Validation du mot de passe si fourni
        if (data.password && data.password.length < 6) {
            throw new Error("Le mot de passe doit avoir au moins 6 caractères");
        }
        // Validation du nom si fourni
        if (data.name && data.name.trim().length === 0) {
            throw new Error("Le nom ne peut pas être vide");
        }
    }
    /**
     * Validation métier avant suppression
     */
    async validateDelete(id) {
        // Ici on pourrait ajouter des validations spécifiques
        // Par exemple : vérifier que l'utilisateur n'a pas de données liées
        // Pour l'instant, on permet la suppression
    }
}
exports.UserService = UserService;
