import { InterventionRepository, CreateInterventionData, UpdateInterventionData } from "../repository/intervention.repository";
import { CreateInterventionDTO } from "../model/dto/intervention.dto";
import { BaseService, ServiceResponse } from "./base.service";
import { Intervention } from "@prisma/client";

export class InterventionService extends BaseService<Intervention, CreateInterventionData, UpdateInterventionData> {
  private interventionRepository: InterventionRepository;

  constructor() {
    const interventionRepository = new InterventionRepository();
    super(interventionRepository);
    this.interventionRepository = interventionRepository;
  }

  /**
   * Crée une nouvelle intervention avec validation métier
   */
  async createIntervention(interventionData: CreateInterventionDTO & { userId: string }): Promise<ServiceResponse> {
    try {
      if (!interventionData.userId) {
        return {
          success: false,
          message: "L'ID utilisateur est requis",
          error: "MISSING_USER_ID"
        };
      }

      const interventionDataToCreate: CreateInterventionData = {
        titre: interventionData.titre.trim(),
        dateStart: interventionData.dateStart.trim(),
        dateEnd: interventionData.dateEnd.trim(),
        status: interventionData.status,
        priority: interventionData.priority.trim(),
        customer: interventionData.customer.trim(),
        long: interventionData.long,
        lat: interventionData.lat,
        distance: interventionData.distance,
        description: interventionData.description.trim(),
        userId: interventionData.userId,
      };

      const result = await this.create(interventionDataToCreate);
      return result;

    } catch (error: any) {
      return this.handleError(error, "Erreur lors de la création de l'intervention");
    }
  }

  /**
   * Validation métier avant création
   */
  protected async validateCreate(data: CreateInterventionData): Promise<void> {
    // Validation du titre
    if (!data.titre || data.titre.trim().length === 0) {
      throw new Error("Le titre est requis");
    }

    // Validation des dates
    if (!data.dateStart || data.dateStart.trim().length === 0) {
      throw new Error("La date de début est requise");
    }
    if (!data.dateEnd || data.dateEnd.trim().length === 0) {
      throw new Error("La date de fin est requise");
    }

    // Validation du statut
    if (data.status < 0) {
      throw new Error("Le statut doit être un entier positif");
    }

    // Validation de la priorité
    if (!data.priority || data.priority.trim().length === 0) {
      throw new Error("La priorité est requise");
    }

    // Validation du client
    if (!data.customer || data.customer.trim().length === 0) {
      throw new Error("Le client est requis");
    }

    // Validation des coordonnées
    if (data.long < -180 || data.long > 180) {
      throw new Error("La longitude doit être entre -180 et 180");
    }
    if (data.lat < -90 || data.lat > 90) {
      throw new Error("La latitude doit être entre -90 et 90");
    }

    // Validation de la distance
    if (data.distance < 0) {
      throw new Error("La distance doit être positive");
    }

    // Validation de la description
    if (!data.description || data.description.trim().length === 0) {
      throw new Error("La description est requise");
    }

    // Validation de l'utilisateur
    if (!data.userId) {
      throw new Error("L'ID utilisateur est requis");
    }
  }

  /**
   * Validation métier avant mise à jour
   */
  protected async validateUpdate(id: string, data: UpdateInterventionData): Promise<void> {
    // Validation du titre si fourni
    if (data.titre && data.titre.trim().length === 0) {
      throw new Error("Le titre ne peut pas être vide");
    }

    // Validation des dates si fournies
    if (data.dateStart && data.dateStart.trim().length === 0) {
      throw new Error("La date de début ne peut pas être vide");
    }
    if (data.dateEnd && data.dateEnd.trim().length === 0) {
      throw new Error("La date de fin ne peut pas être vide");
    }

    // Validation du statut si fourni
    if (data.status !== undefined && data.status < 0) {
      throw new Error("Le statut doit être un entier positif");
    }

    // Validation de la priorité si fournie
    if (data.priority && data.priority.trim().length === 0) {
      throw new Error("La priorité ne peut pas être vide");
    }

    // Validation du client si fourni
    if (data.customer && data.customer.trim().length === 0) {
      throw new Error("Le client ne peut pas être vide");
    }

    // Validation des coordonnées si fournies
    if (data.long !== undefined && (data.long < -180 || data.long > 180)) {
      throw new Error("La longitude doit être entre -180 et 180");
    }
    if (data.lat !== undefined && (data.lat < -90 || data.lat > 90)) {
      throw new Error("La latitude doit être entre -90 et 90");
    }

    // Validation de la distance si fournie
    if (data.distance !== undefined && data.distance < 0) {
      throw new Error("La distance doit être positive");
    }

    // Validation de la description si fournie
    if (data.description && data.description.trim().length === 0) {
      throw new Error("La description ne peut pas être vide");
    }
  }

  /**
   * Validation métier avant suppression
   */
  protected async validateDelete(id: string): Promise<void> {
    // Ici on pourrait ajouter des validations spécifiques
    // Par exemple : vérifier que l'intervention n'a pas de matériels en cours d'utilisation
    // Pour l'instant, on permet la suppression (les matériels seront supprimés en cascade)
  }
}
