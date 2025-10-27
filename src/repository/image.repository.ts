import { prisma } from "../utils/prisma";
import { Image } from "@prisma/client";
import { BaseRepository } from "./base.repository";

export interface CreateImageData {
  ic: number;
  filename: string;
  data: string;
  idIntervention: string;
}

export interface UpdateImageData {
  ic?: number;
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
      ic: true,
      filename: true,
      data: true,
      idIntervention: true,
      createdAt: true,
      updatedAt: true,
    };
  }
}
