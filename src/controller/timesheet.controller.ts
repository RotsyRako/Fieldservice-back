import { Request, Response } from "express";
import { CreateTimesheetDTO } from "../model/dto/timesheet.dto";
import { fail, ok } from "../utils/base_response.utils";
import { TimesheetService } from "../service/timesheet.service";
import { BaseController } from "./base.controller";
import { Timesheet } from "@prisma/client";
import { CreateTimesheetData, UpdateTimesheetData } from "../repository/timesheet.repository";
import { PaginationOptions } from "../repository/base.repository";

export class TimesheetController extends BaseController<Timesheet, CreateTimesheetData, UpdateTimesheetData> {
  private timesheetService: TimesheetService;

  constructor() {
    const timesheetService = new TimesheetService();
    super(timesheetService);
    this.timesheetService = timesheetService;
  }

  /**
   * Crée un nouveau timesheet (override de la méthode create du BaseController)
   */
  createTimesheet = async (req: Request, res: Response) => {
    try {
      const timesheetData = req.body as CreateTimesheetDTO;
      const result = await this.timesheetService.createTimesheet(timesheetData);

      if (!result.success) {
        const statusCode = this.getStatusCodeFromError(result.error);
        return res.status(statusCode).json(fail(result.message));
      }

      return res.status(201).json(ok(result.message, result.data));

    } catch (error: any) {
      console.error("❌ Erreur dans TimesheetController.createTimesheet:", error);
      return res.status(500).json(fail("Erreur serveur interne"));
    }
  };

  /**
   * Liste les timesheets par ID d'intervention
   * GET /timesheets/interventions/:idIntervention
   */
  getByInterventionId = async (req: Request, res: Response) => {
    try {
      const { idIntervention } = req.params;
      if (!idIntervention) {
        return res.status(400).json(fail("Paramètre idIntervention requis"));
      }

      const options: PaginationOptions = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        orderBy: (req.query.orderBy as string) || "createdAt",
        orderDirection: (req.query.orderDirection as "asc" | "desc") || "desc",
      };

      const result = await this.timesheetService.findManyByInterventionId(idIntervention, options);

      if (!result.success) {
        const statusCode = this.getStatusCodeFromError(result.error);
        return res.status(statusCode).json(fail(result.message));
      }

      return res.status(200).json(ok(result.message, result.data));
    } catch (error: any) {
      console.error("❌ Erreur dans TimesheetController.getByInterventionId:", error);
      return res.status(500).json(fail("Erreur serveur interne"));
    }
  };
}

// Export des instances pour les routes
export const timesheetController = new TimesheetController();
