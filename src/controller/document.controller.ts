import { Request, Response } from "express";
import { CreateDocumentDTO } from "../model/dto/document.dto";
import { fail, ok } from "../utils/base_response.utils";
import { DocumentService } from "../service/document.service";
import { BaseController } from "./base.controller";
import { Document } from "@prisma/client";
import { CreateDocumentData, UpdateDocumentData } from "../repository/document.repository";
import { PaginationOptions } from "../repository/base.repository";

export class DocumentController extends BaseController<Document, CreateDocumentData, UpdateDocumentData> {
  private documentService: DocumentService;

  constructor() {
    const documentService = new DocumentService();
    super(documentService);
    this.documentService = documentService;
  }

  createDocument = async (req: Request, res: Response) => {
    try {
      const documentData = req.body as CreateDocumentDTO;
      const result = await this.documentService.createDocument(documentData);

      if (!result.success) {
        const statusCode = this.getStatusCodeFromError(result.error);
        return res.status(statusCode).json(fail(result.message));
      }

      return res.status(201).json(ok(result.message, result.data));

    } catch (error: any) {
      console.error("❌ Erreur dans DocumentController.createDocument:", error);
      return res.status(500).json(fail("Erreur serveur interne"));
    }
  };

  /**
   * Liste les documents par ID d'intervention
   * GET /documents/interventions/:idIntervention
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

      const result = await this.documentService.findManyByInterventionId(idIntervention, options);

      if (!result.success) {
        const statusCode = this.getStatusCodeFromError(result.error);
        return res.status(statusCode).json(fail(result.message));
      }

      return res.status(200).json(ok(result.message, result.data));
    } catch (error: any) {
      console.error("❌ Erreur dans DocumentController.getByInterventionId:", error);
      return res.status(500).json(fail("Erreur serveur interne"));
    }
  };
}

export const documentController = new DocumentController();
