import { prisma } from "../utils/prisma";
import { Timesheet } from "@prisma/client";
import { BaseRepository } from "./base.repository";

export interface CreateTimesheetData {
  description: string;
  timeAllocated: number;
  date: string;
  idIntervention: string;
}

export interface UpdateTimesheetData {
  description?: string;
  timeAllocated?: number;
  date?: string;
  idIntervention?: string;
}

export class TimesheetRepository extends BaseRepository<Timesheet, CreateTimesheetData, UpdateTimesheetData> {
  constructor() {
    super(prisma.timesheet, "Timesheet");
  }

  /**
   * Définit les champs à sélectionner pour les requêtes
   */
  protected getSelectFields() {
    return {
      id: true,
      description: true,
      timeAllocated: true,
      date: true,
      idIntervention: true,
      createdAt: true,
      updatedAt: true,
    };
  }
}
