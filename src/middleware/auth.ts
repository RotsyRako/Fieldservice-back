import { Request, Response, NextFunction } from "express";
import { fail } from "../utils/base_response.utils";
import { JWTUtils, JWTPayload } from "../utils/jwt.utils";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    iat?: number;
    exp?: number;
  };
}

/**
 * Middleware d'authentification par token JWT
 * Vérifie le token JWT dans l'en-tête Authorization
 */
export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("🔍 [AUTH] Début de l'authentification");
    console.log("🔍 [AUTH] Headers reçus:", req.headers);
    console.log("🔍 [AUTH] Body reçu:", req.body);
    console.log("🔍 [AUTH] Query params:", req.query);

    let token: string | undefined;

    // Récupérer le token depuis l'en-tête Authorization
    const authHeader = req.headers.authorization;
    console.log("🔍 [AUTH] Authorization header:", authHeader);
    
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
      console.log("🔍 [AUTH] Token extrait du header:", token);
    }

    // Récupérer le token depuis le body (pour les requêtes POST)
    if (!token && req.body?.token) {
      token = req.body.token;
      console.log("🔍 [AUTH] Token extrait du body:", token);
    }

    // Récupérer le token depuis les query parameters
    if (!token && req.query?.token) {
      token = req.query.token as string;
      console.log("🔍 [AUTH] Token extrait des query params:", token);
    }

    console.log("🔍 [AUTH] Token final:", token);

    if (!token) {
      console.log("❌ [AUTH] Aucun token trouvé");
      return res.status(401).json(fail("Token d'authentification requis"));
    }

    console.log("🔍 [AUTH] Vérification du token...");
    // Vérifier et décoder le token JWT
    const userPayload = JWTUtils.verifyToken(token);
    console.log("✅ [AUTH] Token valide, utilisateur:", userPayload);

    // Ajouter l'utilisateur à la requête
    req.user = userPayload;
    console.log("✅ [AUTH] Authentification réussie, passage au middleware suivant");
    next();

  } catch (error: any) {
    console.error("❌ [AUTH] Erreur dans le middleware d'authentification:", error);
    
    if (error.message === "Token invalide ou expiré") {
      return res.status(401).json(fail("Token invalide ou expiré"));
    }
    
    return res.status(500).json(fail("Erreur d'authentification"));
  }
};

/**
 * Middleware d'authentification optionnelle
 * Ajoute l'utilisateur à la requête s'il est authentifié, sinon continue sans erreur
 */
export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }

    if (!token && req.body?.token) {
      token = req.body.token;
    }

    if (!token && req.query?.token) {
      token = req.query.token as string;
    }

    if (token) {
      try {
        const userPayload = JWTUtils.verifyToken(token);
        req.user = userPayload;
      } catch (error) {
        // Token invalide, mais on continue sans erreur pour l'auth optionnelle
        console.log("Token invalide dans l'auth optionnelle:", error);
      }
    }

    next();

  } catch (error: any) {
    console.error("Erreur dans le middleware d'authentification optionnelle:", error);
    // Continue même en cas d'erreur pour l'auth optionnelle
    next();
  }
};

/**
 * Middleware de vérification des rôles (pour futures extensions)
 */
export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json(fail("Authentification requise"));
    }

    // Pour l'instant, tous les utilisateurs ont le même rôle
    // À étendre quand vous ajouterez un système de rôles
    next();
  };
};
