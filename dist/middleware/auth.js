"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.optionalAuth = exports.authenticateToken = void 0;
const base_response_utils_1 = require("../utils/base_response.utils");
const jwt_utils_1 = require("../utils/jwt.utils");
/**
 * Middleware d'authentification par token JWT
 * Vérifie le token JWT dans l'en-tête Authorization
 */
const authenticateToken = async (req, res, next) => {
    try {
        let token;
        // Récupérer le token depuis l'en-tête Authorization
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        }
        // Récupérer le token depuis le body (pour les requêtes POST)
        if (!token && req.body?.token) {
            token = req.body.token;
        }
        // Récupérer le token depuis les query parameters
        if (!token && req.query?.token) {
            token = req.query.token;
        }
        if (!token) {
            return res.status(401).json((0, base_response_utils_1.fail)("Token d'authentification requis"));
        }
        // Vérifier et décoder le token JWT
        const userPayload = jwt_utils_1.JWTUtils.verifyToken(token);
        // Ajouter l'utilisateur à la requête
        req.user = userPayload;
        next();
    }
    catch (error) {
        console.error("Erreur dans le middleware d'authentification:", error);
        if (error.message === "Token invalide ou expiré") {
            return res.status(401).json((0, base_response_utils_1.fail)("Token invalide ou expiré"));
        }
        return res.status(500).json((0, base_response_utils_1.fail)("Erreur d'authentification"));
    }
};
exports.authenticateToken = authenticateToken;
/**
 * Middleware d'authentification optionnelle
 * Ajoute l'utilisateur à la requête s'il est authentifié, sinon continue sans erreur
 */
const optionalAuth = async (req, res, next) => {
    try {
        let token;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        }
        if (!token && req.body?.token) {
            token = req.body.token;
        }
        if (!token && req.query?.token) {
            token = req.query.token;
        }
        if (token) {
            try {
                const userPayload = jwt_utils_1.JWTUtils.verifyToken(token);
                req.user = userPayload;
            }
            catch (error) {
                // Token invalide, mais on continue sans erreur pour l'auth optionnelle
                console.log("Token invalide dans l'auth optionnelle:", error);
            }
        }
        next();
    }
    catch (error) {
        console.error("Erreur dans le middleware d'authentification optionnelle:", error);
        // Continue même en cas d'erreur pour l'auth optionnelle
        next();
    }
};
exports.optionalAuth = optionalAuth;
/**
 * Middleware de vérification des rôles (pour futures extensions)
 */
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json((0, base_response_utils_1.fail)("Authentification requise"));
        }
        // Pour l'instant, tous les utilisateurs ont le même rôle
        // À étendre quand vous ajouterez un système de rôles
        next();
    };
};
exports.requireRole = requireRole;
