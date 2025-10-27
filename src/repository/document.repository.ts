import { prisma } from "../utils/prisma";
import { Document } from "@prisma/client";
import { BaseRepository } from "./base.repository";

export interface CreateDocumentData {
  filename: string;
  data: string;
  idIntervention: string;
}

export interface UpdateDocumentData {
  filename?: string;
  data?: string;
  idIntervention?: string;
}

export class DocumentRepository extends BaseRepository<Document, CreateDocumentData, UpdateDocumentData> {
  constructor() {
    super(prisma.document, "Document");
  }

  protected getSelectFields() {
    return {
      id: true,
      filename: true,
      data: true,
      idIntervention: true,
      createdAt: true,
      updatedAt: true,
    };
  }
}
