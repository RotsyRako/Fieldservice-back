import { prisma } from "../utils/prisma";
import { Intervention } from "@prisma/client";
import { BaseRepository } from "./base.repository";

export interface CreateInterventionData {
  titre: string;
  dateStart: string;
  dateEnd: string;
  status: number;
  priority: string;
  customer: string;
  long: number;
  lat: number;
  distance: number;
  description: string;
  userId: string;
}

export interface UpdateInterventionData {
  titre?: string;
  dateStart?: string;
  dateEnd?: string;
  status?: number;
  priority?: string;
  customer?: string;
  long?: number;
  lat?: number;
  distance?: number;
  description?: string;
  userId?: string;
}

export class InterventionRepository extends BaseRepository<Intervention, CreateInterventionData, UpdateInterventionData> {
  constructor() {
    super(prisma.intervention, "Intervention");
  }

  /**
   * Définit les champs à sélectionner pour les requêtes
   */
  protected getSelectFields() {
    return {
      id: true,
      titre: true,
      dateStart: true,
      dateEnd: true,
      status: true,
      priority: true,
      customer: true,
      long: true,
      lat: true,
      distance: true,
      description: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
    };
  }
}
