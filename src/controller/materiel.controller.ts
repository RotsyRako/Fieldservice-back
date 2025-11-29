import { Request, Response } from "express";
import { CreateMaterielDTO } from "../model/dto/materiel.dto";
import { fail, ok } from "../utils/base_response.utils";
import { MaterielService } from "../service/materiel.service";
import { BaseController } from "./base.controller";
import { Materiel } from "@prisma/client";
import { CreateMaterielData, UpdateMaterielData } from "../repository/materiel.repository";
import { PaginationOptions } from "../repository/base.repository";

export class MaterielController extends BaseController<Materiel, CreateMaterielData, UpdateMaterielData> {
  private materielService: MaterielService;

  constructor() {
    const materielService = new MaterielService();
    super(materielService);
    this.materielService = materielService;
  }

  /**
   * Crée un nouveau matériel (override de la méthode create du BaseController)
   */
  createMateriel = async (req: Request, res: Response) => {
    try {
      const materielData = req.body as CreateMaterielDTO;
      const result = await this.materielService.createMateriel(materielData);

      if (!result.success) {
        const statusCode = this.getStatusCodeFromError(result.error);
        return res.status(statusCode).json(fail(result.message));
      }

      return res.status(201).json(ok(result.message, result.data));

    } catch (error: any) {
      console.error("❌ Erreur dans MaterielController.createMateriel:", error);
      return res.status(500).json(fail("Erreur serveur interne"));
    }
  };

  /**
   * Liste les matériels par ID d'intervention
   * GET /materiels/interventions/:idIntervention
   */
  getByInterventionId = async (req: Request, res: Response) => {
    try {
      const { idIntervention } = req.params;
      if (!idIntervention) {
        return res.status(400).json(fail("Paramètre idIntervention requis"));
      }

      const options: PaginationOptions = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        orderBy: (req.query.orderBy as string) || "createdAt",
        orderDirection: (req.query.orderDirection as "asc" | "desc") || "desc",
      };

      const result = await this.materielService.findManyByInterventionId(idIntervention, options);

      if (!result.success) {
        const statusCode = this.getStatusCodeFromError(result.error);
        return res.status(statusCode).json(fail(result.message));
      }

      return res.status(200).json(ok(result.message, result.data));
    } catch (error: any) {
      console.error("❌ Erreur dans MaterielController.getByInterventionId:", error);
      return res.status(500).json(fail("Erreur serveur interne"));
    }
  };
}

// Export des instances pour les routes
export const materielController = new MaterielController();
