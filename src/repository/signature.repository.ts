import { prisma } from "../utils/prisma";
import { Signature } from "@prisma/client";
import { BaseRepository } from "./base.repository";

export interface CreateSignatureData {
  filename: string;
  data: string;
  idIntervention: string;
}

export interface UpdateSignatureData {
  filename?: string;
  data?: string;
  idIntervention?: string;
}

export class SignatureRepository extends BaseRepository<Signature, CreateSignatureData, UpdateSignatureData> {
  constructor() {
    super(prisma.signature, "Signature");
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
