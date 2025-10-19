"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
const base_response_utils_1 = require("../utils/base_response.utils");
/**
 * Contrôleur de base générique pour toutes les entités
 * Fournit les opérations HTTP de base
 */
class BaseController {
    constructor(service) {
        /**
         * Crée une nouvelle entité
         * POST /entities
         */
        this.create = async (req, res) => {
            try {
                const data = req.body;
                const result = await this.service.create(data);
                if (!result.success) {
                    const statusCode = this.getStatusCodeFromError(result.error);
                    return res.status(statusCode).json((0, base_response_utils_1.fail)(result.message));
                }
                return res.status(201).json((0, base_response_utils_1.ok)(result.message, result.data));
            }
            catch (error) {
                console.error(`Erreur dans ${this.constructor.name}.create:`, error);
                return res.status(500).json((0, base_response_utils_1.fail)("Erreur serveur interne"));
            }
        };
        /**
         * Récupère une entité par son ID
         * GET /entities/:id
         */
        this.getById = async (req, res) => {
            try {
                const { id } = req.params;
                const result = await this.service.getById(id);
                if (!result.success) {
                    const statusCode = this.getStatusCodeFromError(result.error);
                    return res.status(statusCode).json((0, base_response_utils_1.fail)(result.message));
                }
                return res.status(200).json((0, base_response_utils_1.ok)(result.message, result.data));
            }
            catch (error) {
                console.error(`Erreur dans ${this.constructor.name}.getById:`, error);
                return res.status(500).json((0, base_response_utils_1.fail)("Erreur serveur interne"));
            }
        };
        /**
         * Récupère toutes les entités avec pagination
         * GET /entities?page=1&limit=10
         */
        this.getAll = async (req, res) => {
            try {
                const options = {
                    page: parseInt(req.query.page) || 1,
                    limit: parseInt(req.query.limit) || 10,
                    orderBy: req.query.orderBy || 'createdAt',
                    orderDirection: req.query.orderDirection || 'desc',
                };
                const result = await this.service.getAll(options);
                if (!result.success) {
                    return res.status(500).json((0, base_response_utils_1.fail)(result.message));
                }
                return res.status(200).json((0, base_response_utils_1.ok)(result.message, result.data));
            }
            catch (error) {
                console.error(`Erreur dans ${this.constructor.name}.getAll:`, error);
                return res.status(500).json((0, base_response_utils_1.fail)("Erreur serveur interne"));
            }
        };
        /**
         * Met à jour une entité
         * PUT /entities/:id
         */
        this.update = async (req, res) => {
            try {
                const { id } = req.params;
                const data = req.body;
                const result = await this.service.update(id, data);
                if (!result.success) {
                    const statusCode = this.getStatusCodeFromError(result.error);
                    return res.status(statusCode).json((0, base_response_utils_1.fail)(result.message));
                }
                return res.status(200).json((0, base_response_utils_1.ok)(result.message, result.data));
            }
            catch (error) {
                console.error(`Erreur dans ${this.constructor.name}.update:`, error);
                return res.status(500).json((0, base_response_utils_1.fail)("Erreur serveur interne"));
            }
        };
        /**
         * Supprime une entité
         * DELETE /entities/:id
         */
        this.delete = async (req, res) => {
            try {
                const { id } = req.params;
                const result = await this.service.delete(id);
                if (!result.success) {
                    const statusCode = this.getStatusCodeFromError(result.error);
                    return res.status(statusCode).json((0, base_response_utils_1.fail)(result.message));
                }
                return res.status(200).json((0, base_response_utils_1.ok)(result.message));
            }
            catch (error) {
                console.error(`Erreur dans ${this.constructor.name}.delete:`, error);
                return res.status(500).json((0, base_response_utils_1.fail)("Erreur serveur interne"));
            }
        };
        /**
         * Compte le nombre total d'entités
         * GET /entities/count
         */
        this.count = async (req, res) => {
            try {
                const result = await this.service.count();
                if (!result.success) {
                    return res.status(500).json((0, base_response_utils_1.fail)(result.message));
                }
                return res.status(200).json((0, base_response_utils_1.ok)(result.message, result.data));
            }
            catch (error) {
                console.error(`Erreur dans ${this.constructor.name}.count:`, error);
                return res.status(500).json((0, base_response_utils_1.fail)("Erreur serveur interne"));
            }
        };
        /**
         * Trouve une entité par un champ
         * GET /entities/search?field=email&value=test@example.com
         */
        this.findByField = async (req, res) => {
            try {
                const { field, value } = req.query;
                if (!field || !value) {
                    return res.status(400).json((0, base_response_utils_1.fail)("Paramètres field et value requis"));
                }
                const result = await this.service.findByField(field, value);
                if (!result.success) {
                    const statusCode = this.getStatusCodeFromError(result.error);
                    return res.status(statusCode).json((0, base_response_utils_1.fail)(result.message));
                }
                return res.status(200).json((0, base_response_utils_1.ok)(result.message, result.data));
            }
            catch (error) {
                console.error(`Erreur dans ${this.constructor.name}.findByField:`, error);
                return res.status(500).json((0, base_response_utils_1.fail)("Erreur serveur interne"));
            }
        };
        this.service = service;
    }
    /**
     * Convertit les codes d'erreur en codes de statut HTTP
     * Peut être surchargé par les contrôleurs spécifiques
     */
    getStatusCodeFromError(error) {
        switch (error) {
            case "ENTITY_NOT_FOUND":
            case "RECORD_NOT_FOUND":
                return 404;
            case "UNIQUE_CONSTRAINT_VIOLATION":
                return 409;
            case "VALIDATION_ERROR":
                return 400;
            case "DATABASE_CONNECTION_ERROR":
                return 503;
            case "UNAUTHORIZED":
                return 401;
            case "FORBIDDEN":
                return 403;
            default:
                return 400;
        }
    }
}
exports.BaseController = BaseController;
