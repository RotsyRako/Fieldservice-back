import { prisma } from "../utils/prisma";
import { Comment } from "@prisma/client";
import { BaseRepository } from "./base.repository";

export interface CreateCommentData {
  message: string;
  date: string;
  attachmentFilename?: string | null;
  attachmentData?: string | null;
  idIntervention: string;
}

export interface UpdateCommentData {
  message?: string;
  date?: string;
  attachmentFilename?: string | null;
  attachmentData?: string | null;
  idIntervention?: string;
}

export class CommentRepository extends BaseRepository<Comment, CreateCommentData, UpdateCommentData> {
  constructor() {
    super(prisma.comment, "Comment");
  }

  protected getSelectFields() {
    return {
      id: true,
      message: true,
      date: true,
      attachmentFilename: true,
      attachmentData: true,
      idIntervention: true,
      createdAt: true,
      updatedAt: true,
    };
  }
}
