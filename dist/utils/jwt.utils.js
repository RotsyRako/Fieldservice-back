"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTUtils = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
/**
 * Utilitaire pour la gestion des tokens JWT
 */
class JWTUtils {
    /**
     * Génère un token JWT avec les données utilisateur
     */
    static generateToken(user) {
        const payload = {
            id: user.id,
            email: user.email,
            name: user.name,
        };
        return jsonwebtoken_1.default.sign(payload, this.JWT_SECRET, {
            expiresIn: this.JWT_EXPIRES_IN,
        });
    }
    /**
     * Génère une paire de tokens (access + refresh)
     */
    static generateTokenPair(user) {
        const accessToken = this.generateToken(user);
        // Refresh token avec une durée plus longue
        const refreshToken = jsonwebtoken_1.default.sign({ id: user.id, type: 'refresh' }, this.JWT_SECRET, { expiresIn: '30d' });
        return {
            accessToken,
            refreshToken,
        };
    }
    /**
     * Vérifie et décode un token JWT
     */
    static verifyToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, this.JWT_SECRET);
            return decoded;
        }
        catch (error) {
            throw new Error("Token invalide ou expiré");
        }
    }
    /**
     * Décode un token sans vérification (pour debug)
     */
    static decodeToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.decode(token);
            return decoded;
        }
        catch (error) {
            return null;
        }
    }
    /**
     * Vérifie si un token est expiré
     */
    static isTokenExpired(token) {
        try {
            const decoded = jsonwebtoken_1.default.decode(token);
            if (!decoded.exp)
                return true;
            const currentTime = Math.floor(Date.now() / 1000);
            return decoded.exp < currentTime;
        }
        catch (error) {
            return true;
        }
    }
    /**
     * Extrait les données utilisateur d'un token valide
     */
    static getUserFromToken(token) {
        const payload = this.verifyToken(token);
        return {
            id: payload.id,
            email: payload.email,
            name: payload.name,
            token: null, // Le token JWT remplace le token en base
            createdAt: new Date(), // On ne stocke pas la date dans le JWT
        };
    }
    /**
     * Rafraîchit un token (génère un nouveau token avec les mêmes données)
     */
    static refreshToken(refreshToken, user) {
        try {
            const decoded = jsonwebtoken_1.default.verify(refreshToken, this.JWT_SECRET);
            if (decoded.type !== 'refresh' || decoded.id !== user.id) {
                throw new Error("Refresh token invalide");
            }
            return this.generateToken(user);
        }
        catch (error) {
            throw new Error("Refresh token invalide ou expiré");
        }
    }
}
exports.JWTUtils = JWTUtils;
JWTUtils.JWT_SECRET = config_1.config.jwt.secret;
JWTUtils.JWT_EXPIRES_IN = config_1.config.jwt.expiresIn;
