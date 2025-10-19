import { Request, Response } from "express";
import { CreateInterventionDTO } from "../model/dto/intervention.dto";
import { fail, ok } from "../utils/base_response.utils";
import { InterventionService } from "../service/intervention.service";
import { BaseController } from "./base.controller";
import { Intervention } from "@prisma/client";
import { CreateInterventionData, UpdateInterventionData } from "../repository/intervention.repository";

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
      const result = await this.interventionService.createIntervention(interventionData);

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
}

// Export des instances pour les routes
export const interventionController = new InterventionController();
