import { prisma } from "../utils/prisma";
import { Image } from "@prisma/client";
import { BaseRepository } from "./base.repository";

export interface CreateImageData {
  filename: string;
  data: string;
  idIntervention: string;
}

export interface UpdateImageData {
  filename?: string;
  data?: string;
  idIntervention?: string;
}

export class ImageRepository extends BaseRepository<Image, CreateImageData, UpdateImageData> {
  constructor() {
    super(prisma.image, "Image");
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
