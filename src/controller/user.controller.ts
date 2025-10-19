import { Request, Response } from "express";
import { CreateUserDTO } from "../model/dto/user.dto";
import { fail, ok } from "../utils/base_response.utils";
import { UserService } from "../service/user.service";
import { BaseController } from "./base.controller";
import { User } from "@prisma/client";
import { CreateUserData, UpdateUserData } from "../repository/user.repository";

export class UserController extends BaseController<User, CreateUserData, UpdateUserData> {
  private userService: UserService;

  constructor() {
    const userService = new UserService();
    super(userService);
    this.userService = userService;
  }

  /**
   * Crée un nouvel utilisateur (override de la méthode create du BaseController)
   */
  createUser = async (req: Request, res: Response) => {
    try {
      const userData = req.body as CreateUserDTO;
      const result = await this.userService.createUser(userData);

      if (!result.success) {
        const statusCode = this.getStatusCodeFromError(result.error);
        return res.status(statusCode).json(fail(result.message));
      }

      return res.status(201).json(ok(result.message, result.data));

    } catch (error: any) {
      console.error("❌ Erreur dans UserController.createUser:", error);
      return res.status(500).json(fail("Erreur serveur interne"));
    }
  };

  /**
   * Authentifie un utilisateur
   */
  authenticateUser = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const result = await this.userService.authenticateUser(email, password);

      if (!result.success) {
        const statusCode = this.getStatusCodeFromError(result.error);
        return res.status(statusCode).json(fail(result.message));
      }

      return res.status(200).json(ok(result.message, result.data));

    } catch (error: any) {
      console.error("❌ Erreur dans UserController.authenticateUser:", error);
      return res.status(500).json(fail("Erreur serveur interne"));
    }
  };

  /**
   * Récupère un utilisateur par son email
   */
  getUserByEmail = async (req: Request, res: Response) => {
    try {
      const { email } = req.params;
      const result = await this.userService.getUserByEmail(email);

      if (!result.success) {
        const statusCode = this.getStatusCodeFromError(result.error);
        return res.status(statusCode).json(fail(result.message));
      }

      return res.status(200).json(ok(result.message, result.data));

    } catch (error: any) {
      console.error("❌ Erreur dans UserController.getUserByEmail:", error);
      return res.status(500).json(fail("Erreur serveur interne"));
    }
  };


  /**
   * Met à jour un utilisateur (override de la méthode update du BaseController)
   */
  updateUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const result = await this.userService.updateUser(id, updateData);

      if (!result.success) {
        const statusCode = this.getStatusCodeFromError(result.error);
        return res.status(statusCode).json(fail(result.message));
      }

      return res.status(200).json(ok(result.message, result.data));

    } catch (error: any) {
      console.error("❌ Erreur dans UserController.updateUser:", error);
      return res.status(500).json(fail("Erreur serveur interne"));
    }
  };

  /**
   * Convertit les codes d'erreur en codes de statut HTTP
   * Override de la méthode du BaseController pour ajouter les erreurs spécifiques aux utilisateurs
   */
  protected getStatusCodeFromError(error?: string): number {
    switch (error) {
      case "EMAIL_ALREADY_EXISTS":
        return 409;
      case "INVALID_CREDENTIALS":
        return 401;
      case "INVALID_TOKEN":
        return 401;
      case "TOKEN_GENERATION_FAILED":
        return 500;
      case "USER_NOT_FOUND":
        return 404;
      default:
        return super.getStatusCodeFromError(error);
    }
  }
}

// Export des instances pour les routes
export const userController = new UserController();