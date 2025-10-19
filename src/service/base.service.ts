import { BaseRepository, PaginationOptions, PaginatedResult } from "../repository/base.repository";
import { BaseEntity, CreateData, UpdateData } from "../repository/base.repository";

export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
  error?: string;
}

/**
 * Service de base générique pour toutes les entités
 * Fournit les opérations métier de base
 */
export abstract class BaseService<T extends BaseEntity, CreateInput, UpdateInput> {
  protected repository: BaseRepository<T, CreateInput, UpdateInput>;

  constructor(repository: BaseRepository<T, CreateInput, UpdateInput>) {
    this.repository = repository;
  }

  /**
   * Crée une nouvelle entité avec validation métier
   */
  async create(data: CreateInput): Promise<ServiceResponse<T>> {
    try {
      // Validation métier avant création
      await this.validateCreate(data);

      const entity = await this.repository.create(data);

      return {
        success: true,
        data: entity as T,
        message: "Entité créée avec succès"
      };

    } catch (error: any) {
      return this.handleError(error, "Erreur lors de la création");
    }
  }

  /**
   * Récupère une entité par son ID
   */
  async getById(id: string): Promise<ServiceResponse<T>> {
    try {
      const entity = await this.repository.findById(id);

      if (!entity) {
        return {
          success: false,
          message: "Entité non trouvée",
          error: "ENTITY_NOT_FOUND"
        };
      }

      return {
        success: true,
        data: entity as T,
        message: "Entité trouvée"
      };

    } catch (error: any) {
      return this.handleError(error, "Erreur lors de la récupération");
    }
  }

  /**
   * Récupère toutes les entités avec pagination
   */
  async getAll(options: PaginationOptions = {}): Promise<ServiceResponse<PaginatedResult<T>>> {
    try {
      const result = await this.repository.findAll(options);

      return {
        success: true,
        data: result as PaginatedResult<T>,
        message: "Entités récupérées avec succès"
      };

    } catch (error: any) {
      return this.handleError(error, "Erreur lors de la récupération des entités");
    }
  }

  /**
   * Met à jour une entité
   */
  async update(id: string, data: UpdateInput): Promise<ServiceResponse<T>> {
    try {
      // Vérifier que l'entité existe
      const exists = await this.repository.exists(id);
      if (!exists) {
        return {
          success: false,
          message: "Entité non trouvée",
          error: "ENTITY_NOT_FOUND"
        };
      }

      // Validation métier avant mise à jour
      await this.validateUpdate(id, data);

      const entity = await this.repository.update(id, data);

      return {
        success: true,
        data: entity as T,
        message: "Entité mise à jour avec succès"
      };

    } catch (error: any) {
      return this.handleError(error, "Erreur lors de la mise à jour");
    }
  }

  /**
   * Supprime une entité
   */
  async delete(id: string): Promise<ServiceResponse<void>> {
    try {
      // Vérifier que l'entité existe
      const exists = await this.repository.exists(id);
      if (!exists) {
        return {
          success: false,
          message: "Entité non trouvée",
          error: "ENTITY_NOT_FOUND"
        };
      }

      // Validation métier avant suppression
      await this.validateDelete(id);

      await this.repository.delete(id);

      return {
        success: true,
        message: "Entité supprimée avec succès"
      };

    } catch (error: any) {
      return this.handleError(error, "Erreur lors de la suppression");
    }
  }

  /**
   * Compte le nombre total d'entités
   */
  async count(): Promise<ServiceResponse<number>> {
    try {
      const total = await this.repository.count();

      return {
        success: true,
        data: total,
        message: "Nombre d'entités récupéré"
      };

    } catch (error: any) {
      return this.handleError(error, "Erreur lors du comptage");
    }
  }

  /**
   * Trouve une entité par un champ
   */
  async findByField(field: string, value: any): Promise<ServiceResponse<T>> {
    try {
      const entity = await this.repository.findByField(field, value);

      if (!entity) {
        return {
          success: false,
          message: "Entité non trouvée",
          error: "ENTITY_NOT_FOUND"
        };
      }

      return {
        success: true,
        data: entity as T,
        message: "Entité trouvée"
      };

    } catch (error: any) {
      return this.handleError(error, "Erreur lors de la recherche");
    }
  }

  /**
   * Méthodes abstraites à implémenter par chaque service spécifique
   */

  /**
   * Validation métier avant création
   */
  protected abstract validateCreate(data: CreateInput): Promise<void>;

  /**
   * Validation métier avant mise à jour
   */
  protected abstract validateUpdate(id: string, data: UpdateInput): Promise<void>;

  /**
   * Validation métier avant suppression
   */
  protected abstract validateDelete(id: string): Promise<void>;

  /**
   * Gestion centralisée des erreurs
   */
  protected handleError(error: any, defaultMessage: string): ServiceResponse {
    console.error(`Erreur dans ${this.constructor.name}:`, error);

    // Gestion des erreurs Prisma
    if (error?.code === "P2002") {
      return {
        success: false,
        message: "Contrainte unique violée",
        error: "UNIQUE_CONSTRAINT_VIOLATION"
      };
    }

    if (error?.code === "P2025") {
      return {
        success: false,
        message: "Enregistrement non trouvé",
        error: "RECORD_NOT_FOUND"
      };
    }

    if (error?.code === "P1001") {
      return {
        success: false,
        message: "Erreur de connexion à la base de données",
        error: "DATABASE_CONNECTION_ERROR"
      };
    }

    return {
      success: false,
      message: error?.message || defaultMessage,
      error: "UNKNOWN_ERROR"
    };
  }
}
