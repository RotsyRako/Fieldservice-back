import { DocumentRepository, CreateDocumentData, UpdateDocumentData } from "../repository/document.repository";
import { CreateDocumentDTO } from "../model/dto/document.dto";
import { BaseService, ServiceResponse } from "./base.service";
import { Document } from "@prisma/client";
import { PaginationOptions } from "../repository/base.repository";

export class DocumentService extends BaseService<Document, CreateDocumentData, UpdateDocumentData> {
  private documentRepository: DocumentRepository;

  constructor() {
    const documentRepository = new DocumentRepository();
    super(documentRepository);
    this.documentRepository = documentRepository;
  }

  async createDocument(documentData: CreateDocumentDTO): Promise<ServiceResponse> {
    try {
      const documentDataToCreate: CreateDocumentData = {
        filename: documentData.filename.trim(),
        data: documentData.data,
        idIntervention: documentData.idIntervention,
      };

      const result = await this.create(documentDataToCreate);
      return result;

    } catch (error: any) {
      return this.handleError(error, "Erreur lors de la création du document");
    }
  }

  /**
   * Récupère les documents par intervention avec pagination
   */
  async findManyByInterventionId(idIntervention: string, options: PaginationOptions = {}): Promise<ServiceResponse<Document[]>> {
    try {
      const data = await this.documentRepository.findMany({ idIntervention }, options);
      return {
        success: true,
        data,
        message: "Documents récupérés avec succès",
      };
    } catch (error: any) {
      return this.handleError(error, "Erreur lors de la récupération des documents par intervention");
    }
  }

  protected async validateCreate(data: CreateDocumentData): Promise<void> {
    if (!data.filename || data.filename.trim().length === 0) {
      throw new Error("Le nom de fichier est requis");
    }

    if (!data.data || data.data.trim().length === 0) {
      throw new Error("Les données du document sont requises");
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

  protected async validateUpdate(id: string, data: UpdateDocumentData): Promise<void> {
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
