import { Request, Response } from "express";
import { CreateImageDTO } from "../model/dto/image.dto";
import { fail, ok } from "../utils/base_response.utils";
import { ImageService } from "../service/image.service";
import { BaseController } from "./base.controller";
import { Image } from "@prisma/client";
import { CreateImageData, UpdateImageData } from "../repository/image.repository";
import { PaginationOptions } from "../repository/base.repository";

export class ImageController extends BaseController<Image, CreateImageData, UpdateImageData> {
  private imageService: ImageService;

  constructor() {
    const imageService = new ImageService();
    super(imageService);
    this.imageService = imageService;
  }

  createImage = async (req: Request, res: Response) => {
    try {
      const imageData = req.body as CreateImageDTO;
      const result = await this.imageService.createImage(imageData);

      if (!result.success) {
        const statusCode = this.getStatusCodeFromError(result.error);
        return res.status(statusCode).json(fail(result.message));
      }

      return res.status(201).json(ok(result.message, result.data));

    } catch (error: any) {
      console.error("❌ Erreur dans ImageController.createImage:", error);
      return res.status(500).json(fail("Erreur serveur interne"));
    }
  };

  /**
   * Liste les images par ID d'intervention
   * GET /images/interventions/:idIntervention
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

      const result = await this.imageService.findManyByInterventionId(idIntervention, options);

      if (!result.success) {
        const statusCode = this.getStatusCodeFromError(result.error);
        return res.status(statusCode).json(fail(result.message));
      }

      return res.status(200).json(ok(result.message, result.data));
    } catch (error: any) {
      console.error("❌ Erreur dans ImageController.getByInterventionId:", error);
      return res.status(500).json(fail("Erreur serveur interne"));
    }
  };
}

export const imageController = new ImageController();
