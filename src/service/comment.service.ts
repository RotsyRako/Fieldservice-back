import { CommentRepository, CreateCommentData, UpdateCommentData } from "../repository/comment.repository";
import { CreateCommentDTO } from "../model/dto/comment.dto";
import { BaseService, ServiceResponse } from "./base.service";
import { Comment } from "@prisma/client";

export class CommentService extends BaseService<Comment, CreateCommentData, UpdateCommentData> {
  private commentRepository: CommentRepository;

  constructor() {
    const commentRepository = new CommentRepository();
    super(commentRepository);
    this.commentRepository = commentRepository;
  }

  async createComment(commentData: CreateCommentDTO): Promise<ServiceResponse> {
    try {
      console.log("📝 CommentService.createComment - Données reçues:", commentData);
      
      const commentDataToCreate: CreateCommentData = {
        message: commentData.message,
        date: commentData.date,
        attachmentFilename: commentData.attachmentFilename || null,
        attachmentData: commentData.attachmentData || null,
        idIntervention: commentData.idIntervention,
      };

      console.log("📝 CommentService.createComment - Données à créer:", commentDataToCreate);

      const result = await this.create(commentDataToCreate);
      return result;

    } catch (error: any) {
      console.error("❌ Erreur dans CommentService.createComment:", error);
      return this.handleError(error, "Erreur lors de la création du commentaire");
    }
  }

  protected async validateCreate(data: CreateCommentData): Promise<void> {
    if (!data.message || data.message.trim().length === 0) {
      throw new Error("Le message est requis");
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

  protected async validateUpdate(id: string, data: UpdateCommentData): Promise<void> {
    if (data.message && data.message.trim().length === 0) {
      throw new Error("Le message ne peut pas être vide");
    }

    if (data.idIntervention) {
      const { prisma } = await import("../utils/prisma");
      const intervention = await prisma.intervention.findUnique({
        where: { id: data.idIntervention },
        select: { id: true }
      });

      if (!intervention) {
        throw new Error("L'intervention spécifiée n'existe pas");
      }
    }
  }

  protected async validateDelete(id: string): Promise<void> {
    // Pas de validation spéciale pour la suppression
  }
}
