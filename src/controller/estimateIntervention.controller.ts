import { Request, Response } from "express";
import { EstimateInterventionService } from "../service/remote/estimateIntervention.service";
import { fail, ok } from "../utils/base_response.utils";

/**
 * Contrôleur pour l'estimation d'intervention avec Gemini Pro
 */
export class EstimateInterventionController {
  private estimateInterventionService: EstimateInterventionService;

  constructor() {
    this.estimateInterventionService = new EstimateInterventionService();
  }

  /**
   * Estime le temps nécessaire pour une intervention
   * POST /api/interventions/:id/estimate
   * @param req - Request avec l'ID de l'intervention dans les paramètres
   * @param res - Response
   */
  estimateIntervention = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      // Validation de l'ID
      if (!id) {
        return res.status(400).json(fail("L'ID de l'intervention est requis"));
      }

      // Appeler le service
      const result = await this.estimateInterventionService.estimateInterventionTime(id);

      if (!result.success) {
        const statusCode = this.getStatusCodeFromError(result.error);
        return res.status(statusCode).json(fail(result.message));
      }

      return res.status(200).json(ok(result.message, result.data));
    } catch (error: any) {
      console.error("❌ Erreur dans EstimateInterventionController.estimateIntervention:", error);
      return res.status(500).json(fail("Erreur serveur interne"));
    }
  };

  /**
   * Convertit les codes d'erreur en codes de statut HTTP
   */
  private getStatusCodeFromError(error?: string): number {
    switch (error) {
      case "INTERVENTION_NOT_FOUND":
        return 404;
      case "GEMINI_CONFIG_ERROR":
        return 500;
      case "GEMINI_API_ERROR":
        return 502;
      case "GEMINI_PARSE_ERROR":
        return 502;
      case "DATABASE_ERROR":
        return 500;
      default:
        return 400;
    }
  }
}

export const estimateInterventionController = new EstimateInterventionController();

