import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { config } from "./config";

export interface JWTPayload {
  id: string;
  email: string;
  name: string;
  iat?: number;
  exp?: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/**
 * Utilitaire pour la gestion des tokens JWT
 */
export class JWTUtils {
  private static readonly JWT_SECRET = config.jwt.secret;
  private static readonly JWT_EXPIRES_IN = config.jwt.expiresIn;

  /**
   * Génère un token JWT avec les données utilisateur
   */
  static generateToken(user: Omit<User, 'password'>): string {
    const payload: JWTPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN,
    } as jwt.SignOptions);
  }

  /**
   * Génère une paire de tokens (access + refresh)
   */
  static generateTokenPair(user: Omit<User, 'password'>): TokenPair {
    const accessToken = this.generateToken(user);
    
    // Refresh token avec une durée plus longue
    const refreshToken = jwt.sign(
      { id: user.id, type: 'refresh' },
      this.JWT_SECRET,
      { expiresIn: '30d' }
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Vérifie et décode un token JWT
   */
  static verifyToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as JWTPayload;
      return decoded;
    } catch (error) {
      throw new Error("Token invalide ou expiré");
    }
  }

  /**
   * Décode un token sans vérification (pour debug)
   */
  static decodeToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.decode(token) as JWTPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }

  /**
   * Vérifie si un token est expiré
   */
  static isTokenExpired(token: string): boolean {
    try {
      const decoded = jwt.decode(token) as JWTPayload;
      if (!decoded.exp) return true;
      
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  /**
   * Extrait les données utilisateur d'un token valide
   */
  static getUserFromToken(token: string): Omit<User, 'password'> {
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
  static refreshToken(refreshToken: string, user: Omit<User, 'password'>): string {
    try {
      const decoded = jwt.verify(refreshToken, this.JWT_SECRET) as any;
      
      if (decoded.type !== 'refresh' || decoded.id !== user.id) {
        throw new Error("Refresh token invalide");
      }

      return this.generateToken(user);
    } catch (error) {
      throw new Error("Refresh token invalide ou expiré");
    }
  }
}
