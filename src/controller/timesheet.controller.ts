import { Request, Response } from "express";
import { CreateTimesheetDTO } from "../model/dto/timesheet.dto";
import { fail, ok } from "../utils/base_response.utils";
import { TimesheetService } from "../service/timesheet.service";
import { BaseController } from "./base.controller";
import { Timesheet } from "@prisma/client";
import { CreateTimesheetData, UpdateTimesheetData } from "../repository/timesheet.repository";

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
}

// Export des instances pour les routes
export const timesheetController = new TimesheetController();
