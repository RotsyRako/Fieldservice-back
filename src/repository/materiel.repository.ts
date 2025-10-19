import { prisma } from "../utils/prisma";
import { Materiel } from "@prisma/client";
import { BaseRepository } from "./base.repository";

export interface CreateMaterielData {
  name: string;
  quantity: number;
  idIntervention: string;
}

export interface UpdateMaterielData {
  name?: string;
  quantity?: number;
  idIntervention?: string;
}

export class MaterielRepository extends BaseRepository<Materiel, CreateMaterielData, UpdateMaterielData> {
  constructor() {
    super(prisma.materiel, "Materiel");
  }

  /**
   * Définit les champs à sélectionner pour les requêtes
   */
  protected getSelectFields() {
    return {
      id: true,
      name: true,
      quantity: true,
      idIntervention: true,
      createdAt: true,
      updatedAt: true,
    };
  }
}
