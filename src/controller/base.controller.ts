import { Request, Response } from "express";
import { BaseService, ServiceResponse } from "../service/base.service";
import { fail, ok } from "../utils/base_response.utils";
import { PaginationOptions, BaseEntity } from "../repository/base.repository";

/**
 * Contrôleur de base générique pour toutes les entités
 * Fournit les opérations HTTP de base
 */
export abstract class BaseController<T extends BaseEntity, CreateInput, UpdateInput> {
  protected service: BaseService<T, CreateInput, UpdateInput>;

  constructor(service: BaseService<T, CreateInput, UpdateInput>) {
    this.service = service;
  }

  /**
   * Crée une nouvelle entité
   * POST /entities
   */
  create = async (req: Request, res: Response) => {
    try {
      const data = req.body as CreateInput;
      const result = await this.service.create(data);

      if (!result.success) {
        const statusCode = this.getStatusCodeFromError(result.error);
        return res.status(statusCode).json(fail(result.message));
      }

      return res.status(201).json(ok(result.message, result.data));

    } catch (error: any) {
      console.error(`Erreur dans ${this.constructor.name}.create:`, error);
      return res.status(500).json(fail("Erreur serveur interne"));
    }
  };

  /**
   * Récupère une entité par son ID
   * GET /entities/:id
   */
  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await this.service.getById(id);

      if (!result.success) {
        const statusCode = this.getStatusCodeFromError(result.error);
        return res.status(statusCode).json(fail(result.message));
      }

      return res.status(200).json(ok(result.message, result.data));

    } catch (error: any) {
      console.error(`Erreur dans ${this.constructor.name}.getById:`, error);
      return res.status(500).json(fail("Erreur serveur interne"));
    }
  };

  /**
   * Récupère toutes les entités avec pagination
   * GET /entities?page=1&limit=10
   */
  getAll = async (req: Request, res: Response) => {
    try {
      const options: PaginationOptions = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        orderBy: req.query.orderBy as string || 'createdAt',
        orderDirection: (req.query.orderDirection as 'asc' | 'desc') || 'desc',
      };

      const result = await this.service.getAll(options);

      if (!result.success) {
        return res.status(500).json(fail(result.message));
      }

      return res.status(200).json(ok(result.message, result.data));

    } catch (error: any) {
      console.error(`Erreur dans ${this.constructor.name}.getAll:`, error);
      return res.status(500).json(fail("Erreur serveur interne"));
    }
  };

  /**
   * Met à jour une entité
   * PUT /entities/:id
   */
  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = req.body as UpdateInput;
      const result = await this.service.update(id, data);

      if (!result.success) {
        const statusCode = this.getStatusCodeFromError(result.error);
        return res.status(statusCode).json(fail(result.message));
      }

      return res.status(200).json(ok(result.message, result.data));

    } catch (error: any) {
      console.error(`Erreur dans ${this.constructor.name}.update:`, error);
      return res.status(500).json(fail("Erreur serveur interne"));
    }
  };

  /**
   * Supprime une entité
   * DELETE /entities/:id
   */
  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await this.service.delete(id);

      if (!result.success) {
        const statusCode = this.getStatusCodeFromError(result.error);
        return res.status(statusCode).json(fail(result.message));
      }

      return res.status(200).json(ok(result.message));

    } catch (error: any) {
      console.error(`Erreur dans ${this.constructor.name}.delete:`, error);
      return res.status(500).json(fail("Erreur serveur interne"));
    }
  };

  /**
   * Compte le nombre total d'entités
   * GET /entities/count
   */
  count = async (req: Request, res: Response) => {
    try {
      const result = await this.service.count();

      if (!result.success) {
        return res.status(500).json(fail(result.message));
      }

      return res.status(200).json(ok(result.message, result.data));

    } catch (error: any) {
      console.error(`Erreur dans ${this.constructor.name}.count:`, error);
      return res.status(500).json(fail("Erreur serveur interne"));
    }
  };

  /**
   * Trouve une entité par un champ
   * GET /entities/search?field=email&value=test@example.com
   */
  findByField = async (req: Request, res: Response) => {
    try {
      const { field, value } = req.query;

      if (!field || !value) {
        return res.status(400).json(fail("Paramètres field et value requis"));
      }

      const result = await this.service.findByField(field as string, value);

      if (!result.success) {
        const statusCode = this.getStatusCodeFromError(result.error);
        return res.status(statusCode).json(fail(result.message));
      }

      return res.status(200).json(ok(result.message, result.data));

    } catch (error: any) {
      console.error(`Erreur dans ${this.constructor.name}.findByField:`, error);
      return res.status(500).json(fail("Erreur serveur interne"));
    }
  };

  /**
   * Convertit les codes d'erreur en codes de statut HTTP
   * Peut être surchargé par les contrôleurs spécifiques
   */
  protected getStatusCodeFromError(error?: string): number {
    switch (error) {
      case "ENTITY_NOT_FOUND":
      case "RECORD_NOT_FOUND":
        return 404;
      case "UNIQUE_CONSTRAINT_VIOLATION":
        return 409;
      case "VALIDATION_ERROR":
        return 400;
      case "DATABASE_CONNECTION_ERROR":
        return 503;
      case "UNAUTHORIZED":
        return 401;
      case "FORBIDDEN":
        return 403;
      default:
        return 400;
    }
  }
}
