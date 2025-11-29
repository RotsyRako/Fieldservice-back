import { Request, Response } from "express";
import { CreateCommentDTO } from "../model/dto/comment.dto";
import { fail, ok } from "../utils/base_response.utils";
import { CommentService } from "../service/comment.service";
import { BaseController } from "./base.controller";
import { Comment } from "@prisma/client";
import { CreateCommentData, UpdateCommentData } from "../repository/comment.repository";
import { PaginationOptions } from "../repository/base.repository";

export class CommentController extends BaseController<Comment, CreateCommentData, UpdateCommentData> {
  private commentService: CommentService;

  constructor() {
    const commentService = new CommentService();
    super(commentService);
    this.commentService = commentService;
  }

  createComment = async (req: Request, res: Response) => {
    try {
      console.log("📝 [CONTROLLER] CommentController.createComment - Début");
      console.log("📝 [CONTROLLER] Body reçu:", JSON.stringify(req.body, null, 2));
      console.log("📝 [CONTROLLER] Type de body:", typeof req.body);
      console.log("📝 [CONTROLLER] Clés du body:", Object.keys(req.body || {}));
      
      const commentData = req.body as CreateCommentDTO;
      console.log("📝 [CONTROLLER] CommentData après cast:", JSON.stringify(commentData, null, 2));
      
      console.log("📝 [CONTROLLER] Appel du service...");
      const result = await this.commentService.createComment(commentData);
      console.log("📝 [CONTROLLER] Résultat du service:", JSON.stringify(result, null, 2));

      if (!result.success) {
        console.log("❌ [CONTROLLER] Échec du service:", result.message);
        const statusCode = this.getStatusCodeFromError(result.error);
        return res.status(statusCode).json(fail(result.message));
      }

      console.log("✅ [CONTROLLER] Succès, retour de la réponse");
      return res.status(201).json(ok(result.message, result.data));

    } catch (error: any) {
      console.error("❌ [CONTROLLER] Erreur dans CommentController.createComment:", error);
      return res.status(500).json(fail("Erreur serveur interne"));
    }
  };

  /**
   * Liste les commentaires par ID d'intervention
   * GET /comments/interventions/:idIntervention
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

      const result = await this.commentService.findManyByInterventionId(idIntervention, options);

      if (!result.success) {
        const statusCode = this.getStatusCodeFromError(result.error);
        return res.status(statusCode).json(fail(result.message));
      }

      return res.status(200).json(ok(result.message, result.data));
    } catch (error: any) {
      console.error("❌ Erreur dans CommentController.getByInterventionId:", error);
      return res.status(500).json(fail("Erreur serveur interne"));
    }
  };
}

export const commentController = new CommentController();
