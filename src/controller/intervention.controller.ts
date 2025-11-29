import { Request, Response } from "express";
import { CreateInterventionDTO } from "../model/dto/intervention.dto";
import { fail, ok } from "../utils/base_response.utils";
import { InterventionService } from "../service/intervention.service";
import { BaseController } from "./base.controller";
import { Intervention } from "@prisma/client";
import { CreateInterventionData, UpdateInterventionData } from "../repository/intervention.repository";
import { PaginationOptions } from "../repository/base.repository";

export class InterventionController extends BaseController<Intervention, CreateInterventionData, UpdateInterventionData> {
  private interventionService: InterventionService;

  constructor() {
    const interventionService = new InterventionService();
    super(interventionService);
    this.interventionService = interventionService;
  }

  /**
   * Crée une nouvelle intervention (override de la méthode create du BaseController)
   */
  createIntervention = async (req: Request, res: Response) => {
    try {
      const interventionData = req.body as CreateInterventionDTO;
      
      console.log("🔍 Données reçues:", interventionData);
      console.log("🔍 Utilisateur dans la requête:", (req as any).user);
      
      // Extraire l'ID utilisateur depuis le token JWT
      const userId = (req as any).user?.id;
      if (!userId) {
        console.log("❌ Aucun ID utilisateur trouvé dans le token");
        return res.status(401).json(fail("ID utilisateur non trouvé dans le token"));
      }
      
      console.log("✅ ID utilisateur trouvé:", userId);
      
      // Ajouter l'ID utilisateur aux données
      const interventionDataWithUser = {
        ...interventionData,
        userId: userId
      };
      
      console.log("🔍 Données avec utilisateur:", interventionDataWithUser);
      
      const result = await this.interventionService.createIntervention(interventionDataWithUser);

      if (!result.success) {
        const statusCode = this.getStatusCodeFromError(result.error);
        return res.status(statusCode).json(fail(result.message));
      }

      return res.status(201).json(ok(result.message, result.data));

    } catch (error: any) {
      console.error("❌ Erreur dans InterventionController.createIntervention:", error);
      return res.status(500).json(fail("Erreur serveur interne"));
    }
  };

  /**
   * Liste les interventions par ID utilisateur
   * GET /users/:userId/interventions
   */
  getByUserId = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      if (!userId) {
        return res.status(400).json(fail("Paramètre userId requis"));
      }

      const options: PaginationOptions = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        orderBy: (req.query.orderBy as string) || "createdAt",
        orderDirection: (req.query.orderDirection as "asc" | "desc") || "desc",
      };

      const result = await this.interventionService.findManyByUserId(userId, options);

      if (!result.success) {
        const statusCode = this.getStatusCodeFromError(result.error);
        return res.status(statusCode).json(fail(result.message));
      }

      return res.status(200).json(ok(result.message, result.data));
    } catch (error: any) {
      console.error("❌ Erreur dans InterventionController.getByUserId:", error);
      return res.status(500).json(fail("Erreur serveur interne"));
    }
  };

  /**
   * Liste les interventions de l'utilisateur authentifié
   * GET /interventions/me
   */
  getUserInterventions = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json(fail("Utilisateur non authentifié"));
      }

      const options: PaginationOptions = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        orderBy: (req.query.orderBy as string) || "createdAt",
        orderDirection: (req.query.orderDirection as "asc" | "desc") || "desc",
      };

      const result = await this.interventionService.findManyByUserId(userId, options);

      if (!result.success) {
        const statusCode = this.getStatusCodeFromError(result.error);
        return res.status(statusCode).json(fail(result.message));
      }

      return res.status(200).json(ok(result.message, result.data));
    } catch (error: any) {
      console.error("❌ Erreur dans InterventionController.getMine:", error);
      return res.status(500).json(fail("Erreur serveur interne"));
    }
  };

  /**
   * Synchronise les interventions avec leurs données associées
   * POST /interventions/sync
   */
  syncInterventions = async (req: Request, res: Response) => {
    try {
      const syncData = req.body;

      const result = await this.interventionService.syncInterventions(syncData);

      if (!result.success) {
        const statusCode = this.getStatusCodeFromError(result.error);
        return res.status(statusCode).json(fail(result.message));
      }

      // Retourner seulement les interventions si succès
      return res.status(200).json(ok(result.message, result.data));
    } catch (error: any) {
      console.error("❌ Erreur dans InterventionController.syncInterventions:", error);
      return res.status(500).json(fail("Erreur serveur interne"));
    }
  };
}

// Export des instances pour les routes
export const interventionController = new InterventionController();
