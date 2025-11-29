import { ImageRepository, CreateImageData, UpdateImageData } from "../repository/image.repository";
import { CreateImageDTO } from "../model/dto/image.dto";
import { BaseService, ServiceResponse } from "./base.service";
import { Image } from "@prisma/client";
import { PaginationOptions } from "../repository/base.repository";

export class ImageService extends BaseService<Image, CreateImageData, UpdateImageData> {
  private imageRepository: ImageRepository;

  constructor() {
    const imageRepository = new ImageRepository();
    super(imageRepository);
    this.imageRepository = imageRepository;
  }

  async createImage(imageData: CreateImageDTO): Promise<ServiceResponse> {
    try {
      const imageDataToCreate: CreateImageData = {
        filename: imageData.filename.trim(),
        data: imageData.data,
        idIntervention: imageData.idIntervention,
      };

      const result = await this.create(imageDataToCreate);
      return result;

    } catch (error: any) {
      return this.handleError(error, "Erreur lors de la création de l'image");
    }
  }

  /**
   * Récupère les images par intervention avec pagination
   */
  async findManyByInterventionId(idIntervention: string, options: PaginationOptions = {}): Promise<ServiceResponse<Image[]>> {
    try {
      const data = await this.imageRepository.findMany({ idIntervention }, options);
      return {
        success: true,
        data,
        message: "Images récupérées avec succès",
      };
    } catch (error: any) {
      return this.handleError(error, "Erreur lors de la récupération des images par intervention");
    }
  }

  protected async validateCreate(data: CreateImageData): Promise<void> {
    if (!data.filename || data.filename.trim().length === 0) {
      throw new Error("Le nom de fichier est requis");
    }

    if (!data.data || data.data.trim().length === 0) {
      throw new Error("Les données de l'image sont requises");
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

  protected async validateUpdate(id: string, data: UpdateImageData): Promise<void> {
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
