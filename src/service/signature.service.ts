import { SignatureRepository, CreateSignatureData, UpdateSignatureData } from "../repository/signature.repository";
import { CreateSignatureDTO } from "../model/dto/signature.dto";
import { BaseService, ServiceResponse } from "./base.service";
import { Signature } from "@prisma/client";
import { PaginationOptions } from "../repository/base.repository";

export class SignatureService extends BaseService<Signature, CreateSignatureData, UpdateSignatureData> {
  private signatureRepository: SignatureRepository;

  constructor() {
    const signatureRepository = new SignatureRepository();
    super(signatureRepository);
    this.signatureRepository = signatureRepository;
  }

  async createSignature(signatureData: CreateSignatureDTO): Promise<ServiceResponse> {
    try {
      const signatureDataToCreate: CreateSignatureData = {
        filename: signatureData.filename.trim(),
        data: signatureData.data,
        idIntervention: signatureData.idIntervention,
      };

      const result = await this.create(signatureDataToCreate);
      return result;

    } catch (error: any) {
      return this.handleError(error, "Erreur lors de la création de la signature");
    }
  }

  /**
   * Récupère les signatures par intervention avec pagination
   */
  async findManyByInterventionId(idIntervention: string, options: PaginationOptions = {}): Promise<ServiceResponse<Signature[]>> {
    try {
      const data = await this.signatureRepository.findMany({ idIntervention }, options);
      return {
        success: true,
        data,
        message: "Signatures récupérées avec succès",
      };
    } catch (error: any) {
      return this.handleError(error, "Erreur lors de la récupération des signatures par intervention");
    }
  }

  protected async validateCreate(data: CreateSignatureData): Promise<void> {
    if (!data.filename || data.filename.trim().length === 0) {
      throw new Error("Le nom de fichier est requis");
    }

    if (!data.data || data.data.trim().length === 0) {
      throw new Error("Les données de la signature sont requises");
    }

    if (!data.idIntervention) {
      throw new Error("L'ID intervention est requis");
    }

    const { prisma } = await import("../utils/prisma");
    const intervention = await prisma.intervention.findUnique({
      where: { id: data.idIntervention },
      select: { id: true }
    });

    if (!intervention) {
      throw new Error("L'intervention spécifiée n'existe pas");
    }
  }

  protected async validateUpdate(id: string, data: UpdateSignatureData): Promise<void> {
    if (data.filename && data.filename.trim().length === 0) {
      throw new Error("Le nom de fichier ne peut pas être vide");
    }

    if (data.data && data.data.trim().length === 0) {
      throw new Error("Les données ne peuvent pas être vides");
    }
  }

  protected async validateDelete(id: string): Promise<void> {
    // Pas de validation spéciale pour la suppression
  }
}
