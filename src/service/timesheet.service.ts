import { TimesheetRepository, CreateTimesheetData, UpdateTimesheetData } from "../repository/timesheet.repository";
import { CreateTimesheetDTO } from "../model/dto/timesheet.dto";
import { BaseService, ServiceResponse } from "./base.service";
import { Timesheet } from "@prisma/client";

export class TimesheetService extends BaseService<Timesheet, CreateTimesheetData, UpdateTimesheetData> {
  private timesheetRepository: TimesheetRepository;

  constructor() {
    const timesheetRepository = new TimesheetRepository();
    super(timesheetRepository);
    this.timesheetRepository = timesheetRepository;
  }

  /**
   * Crée un nouveau timesheet avec validation métier
   */
  async createTimesheet(timesheetData: CreateTimesheetDTO): Promise<ServiceResponse> {
    try {
      const timesheetDataToCreate: CreateTimesheetData = {
        description: timesheetData.description.trim(),
        timeAllocated: timesheetData.timeAllocated,
        date: timesheetData.date,
        idIntervention: timesheetData.idIntervention,
      };

      const result = await this.create(timesheetDataToCreate);
      return result;

    } catch (error: any) {
      return this.handleError(error, "Erreur lors de la création du timesheet");
    }
  }

  /**
   * Validation métier avant création
   */
  protected async validateCreate(data: CreateTimesheetData): Promise<void> {
    // Validation de la description
    if (!data.description || data.description.trim().length === 0) {
      throw new Error("La description est requise");
    }

    // Validation du temps alloué
    if (!data.timeAllocated || data.timeAllocated <= 0) {
      throw new Error("Le temps alloué doit être un nombre positif");
    }

    // Validation de la date
    if (!data.date) {
      throw new Error("La date est requise");
    }

    // Validation du format de date (dd/mm/YYYY)
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(data.date)) {
      throw new Error("Le format de date doit être dd/mm/YYYY");
    }

    // Validation de l'intervention
    if (!data.idIntervention) {
      throw new Error("L'ID intervention est requis");
    }

    // Vérifier que l'intervention existe
    const { prisma } = await import("../utils/prisma");
    const intervention = await prisma.intervention.findUnique({
      where: { id: data.idIntervention },
      select: { id: true }
    });

    if (!intervention) {
      throw new Error("L'intervention spécifiée n'existe pas");
    }
  }

  /**
   * Validation métier avant mise à jour
   */
  protected async validateUpdate(id: string, data: UpdateTimesheetData): Promise<void> {
    // Validation de la description si fournie
    if (data.description && data.description.trim().length === 0) {
      throw new Error("La description ne peut pas être vide");
    }

    // Validation du temps alloué si fourni
    if (data.timeAllocated !== undefined && data.timeAllocated <= 0) {
      throw new Error("Le temps alloué doit être un nombre positif");
    }

    // Validation de la date si fournie
    if (data.date) {
      const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
      if (!dateRegex.test(data.date)) {
        throw new Error("Le format de date doit être dd/mm/YYYY");
      }
    }

    // Validation de l'intervention si fournie
    if (data.idIntervention && !data.idIntervention) {
      throw new Error("L'ID intervention ne peut pas être vide");
    }
  }

  /**
   * Validation métier avant suppression
   */
  protected async validateDelete(id: string): Promise<void> {
    // Ici on pourrait ajouter des validations spécifiques
    // Par exemple : vérifier que le timesheet n'est pas verrouillé
    // Pour l'instant, on permet la suppression
  }
}
