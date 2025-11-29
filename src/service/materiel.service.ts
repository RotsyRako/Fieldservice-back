import { MaterielRepository, CreateMaterielData, UpdateMaterielData } from "../repository/materiel.repository";
import { CreateMaterielDTO } from "../model/dto/materiel.dto";
import { BaseService, ServiceResponse } from "./base.service";
import { Materiel } from "@prisma/client";
import { PaginationOptions } from "../repository/base.repository";

export class MaterielService extends BaseService<Materiel, CreateMaterielData, UpdateMaterielData> {
  private materielRepository: MaterielRepository;

  constructor() {
    const materielRepository = new MaterielRepository();
    super(materielRepository);
    this.materielRepository = materielRepository;
  }

  /**
   * Crée un nouveau matériel avec validation métier
   */
  async createMateriel(materielData: CreateMaterielDTO): Promise<ServiceResponse> {
    try {
      const materielDataToCreate: CreateMaterielData = {
        name: materielData.name.trim(),
        quantity: materielData.quantity,
        idIntervention: materielData.idIntervention,
      };

      const result = await this.create(materielDataToCreate);
      return result;

    } catch (error: any) {
      return this.handleError(error, "Erreur lors de la création du matériel");
    }
  }

  /**
   * Récupère les matériels par intervention avec pagination
   */
  async findManyByInterventionId(idIntervention: string, options: PaginationOptions = {}): Promise<ServiceResponse<Materiel[]>> {
    try {
      const data = await this.materielRepository.findMany({ idIntervention }, options);
      return {
        success: true,
        data,
        message: "Matériels récupérés avec succès",
      };
    } catch (error: any) {
      return this.handleError(error, "Erreur lors de la récupération des matériels par intervention");
    }
  }

  /**
   * Validation métier avant création
   */
  protected async validateCreate(data: CreateMaterielData): Promise<void> {
    // Validation du nom
    if (!data.name || data.name.trim().length === 0) {
      throw new Error("Le nom du matériel est requis");
    }

    // Validation de la quantité
    if (!data.quantity || data.quantity < 1) {
      throw new Error("La quantité doit être un entier positif");
    }

    // Validation de l'intervention
    if (!data.idIntervention) {
      throw new Error("L'ID intervention est requis");
    }

    // Vérifier que l'intervention existe
    const { prisma } = await import("../utils/prisma");
    const intervention = await prisma.intervention.findUnique({
      where: { id: data.idIntervention },
      select: { id: true }
    });

    if (!intervention) {
      throw new Error("L'intervention spécifiée n'existe pas");
    }
  }

  /**
   * Validation métier avant mise à jour
   */
  protected async validateUpdate(id: string, data: UpdateMaterielData): Promise<void> {
    // Validation du nom si fourni
    if (data.name && data.name.trim().length === 0) {
      throw new Error("Le nom du matériel ne peut pas être vide");
    }

    // Validation de la quantité si fournie
    if (data.quantity !== undefined && data.quantity < 1) {
      throw new Error("La quantité doit être un entier positif");
    }

    // Validation de l'intervention si fournie
    if (data.idIntervention && !data.idIntervention) {
      throw new Error("L'ID intervention ne peut pas être vide");
    }
  }

  /**
   * Validation métier avant suppression
   */
  protected async validateDelete(id: string): Promise<void> {
    // Ici on pourrait ajouter des validations spécifiques
    // Par exemple : vérifier que le matériel n'est pas en cours d'utilisation
    // Pour l'instant, on permet la suppression
  }
}
