import { Request, Response } from "express";
import { CreateSignatureDTO } from "../model/dto/signature.dto";
import { fail, ok } from "../utils/base_response.utils";
import { SignatureService } from "../service/signature.service";
import { BaseController } from "./base.controller";
import { Signature } from "@prisma/client";
import { CreateSignatureData, UpdateSignatureData } from "../repository/signature.repository";

export class SignatureController extends BaseController<Signature, CreateSignatureData, UpdateSignatureData> {
  private signatureService: SignatureService;

  constructor() {
    const signatureService = new SignatureService();
    super(signatureService);
    this.signatureService = signatureService;
  }

  createSignature = async (req: Request, res: Response) => {
    try {
      const signatureData = req.body as CreateSignatureDTO;
      const result = await this.signatureService.createSignature(signatureData);

      if (!result.success) {
        const statusCode = this.getStatusCodeFromError(result.error);
        return res.status(statusCode).json(fail(result.message));
      }

      return res.status(201).json(ok(result.message, result.data));

    } catch (error: any) {
      console.error("❌ Erreur dans SignatureController.createSignature:", error);
      return res.status(500).json(fail("Erreur serveur interne"));
    }
  };
}

export const signatureController = new SignatureController();
