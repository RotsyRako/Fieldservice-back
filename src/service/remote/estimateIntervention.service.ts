import { EstimateInterventionRepository, InterventionCompleteData, EstimationResponse } from "../../repository/remote/estimateIntervention.repository";
import { ServiceResponse } from "../base.service";
import { prisma } from "../../utils/prisma";

/**
 * Service pour l'estimation d'intervention avec Gemini Pro
 * Gère la logique métier et la récupération des données d'intervention
 */
export class EstimateInterventionService {
  private estimateInterventionRepository: EstimateInterventionRepository;

  constructor() {
    this.estimateInterventionRepository = new EstimateInterventionRepository();
  }

  /**
   * Estime le temps nécessaire pour une intervention
   * @param interventionId - ID de l'intervention à estimer
   * @returns Estimation avec temps, raisonnement et confiance
   */
  async estimateInterventionTime(
    interventionId: string
  ): Promise<ServiceResponse<EstimationResponse>> {
    try {
      // Récupérer l'intervention avec toutes ses relations
      const interventionData = await this.getInterventionCompleteData(interventionId);

      if (!interventionData) {
        return {
          success: false,
          message: `Intervention avec l'ID ${interventionId} non trouvée`,
          error: "INTERVENTION_NOT_FOUND",
        };
      }

      // Appeler le repository pour obtenir l'estimation
      const estimation = await this.estimateInterventionRepository.estimateInterventionTime(
        interventionData
      );

      return {
        success: true,
        data: estimation,
        message: "Estimation générée avec succès",
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  /**
   * Récupère toutes les données d'une intervention avec ses relations
   */
  private async getInterventionCompleteData(
    interventionId: string
  ): Promise<InterventionCompleteData | null> {
    try {
      const intervention = await prisma.intervention.findUnique({
        where: { id: interventionId },
        include: {
          materiels: true,
          timesheets: true,
          images: true,
          documents: true,
          comments: true,
          signatures: true,
        },
      });

      if (!intervention) {
        return null;
      }

      return {
        intervention: {
          id: intervention.id,
          titre: intervention.titre,
          dateStart: intervention.dateStart,
          dateEnd: intervention.dateEnd,
          status: intervention.status,
          priority: intervention.priority,
          customer: intervention.customer,
          long: intervention.long,
          lat: intervention.lat,
          distance: intervention.distance,
          description: intervention.description,
          userId: intervention.userId,
          createdAt: intervention.createdAt,
          updatedAt: intervention.updatedAt,
        },
        materiels: intervention.materiels.map((m) => ({
          name: m.name,
          quantity: m.quantity,
        })),
        timesheets: intervention.timesheets.map((t) => ({
          description: t.description,
          timeAllocated: t.timeAllocated,
          date: t.date,
        })),
        images: intervention.images.map((img) => ({
          filename: img.filename,
        })),
        documents: intervention.documents.map((doc) => ({
          filename: doc.filename,
        })),
        comments: intervention.comments.map((comment) => ({
          message: comment.message,
          date: comment.date,
        })),
        signatures: intervention.signatures.map((sig) => ({
          filename: sig.filename,
        })),
      };
    } catch (error: any) {
      throw new Error(`Erreur lors de la récupération des données d'intervention: ${error.message}`);
    }
  }

  /**
   * Gère les erreurs spécifiques
   */
  private handleError(error: any): ServiceResponse {
    console.error("Erreur EstimateInterventionService:", error);

    // Erreur de configuration (clé API manquante)
    if (error?.message?.includes("GEMINI_KEY") || error?.message?.includes("credentials")) {
      return {
        success: false,
        message: "Erreur de configuration Gemini API. Vérifiez que GEMINI_KEY est définie dans votre .env",
        error: "GEMINI_CONFIG_ERROR",
      };
    }

    // Erreur d'API Gemini
    if (error?.message?.includes("Gemini") || error?.message?.includes("API")) {
      return {
        success: false,
        message: error.message || "Erreur lors de l'appel à l'API Gemini",
        error: "GEMINI_API_ERROR",
      };
    }

    // Erreur de parsing
    if (error?.message?.includes("parser") || error?.message?.includes("parse")) {
      return {
        success: false,
        message: "Erreur lors du traitement de la réponse de Gemini",
        error: "GEMINI_PARSE_ERROR",
      };
    }

    // Erreur de base de données
    if (error?.message?.includes("database") || error?.message?.includes("prisma")) {
      return {
        success: false,
        message: "Erreur lors de la récupération des données d'intervention",
        error: "DATABASE_ERROR",
      };
    }

    // Erreur générique
    return {
      success: false,
      message: error?.message || "Erreur lors de l'estimation de l'intervention",
      error: "ESTIMATION_ERROR",
    };
  }
}

