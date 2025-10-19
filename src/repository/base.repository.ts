import { prisma } from "../utils/prisma";
import { Prisma } from "@prisma/client";

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateData<T> {
  [key: string]: any;
}

export interface UpdateData<T> {
  [key: string]: any;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Repository de base générique pour toutes les entités
 * Fournit les opérations CRUD de base
 */
export abstract class BaseRepository<T extends BaseEntity, CreateInput, UpdateInput> {
  protected model: any;
  protected modelName: string;

  constructor(model: any, modelName: string) {
    this.model = model;
    this.modelName = modelName;
  }

  /**
   * Crée une nouvelle entité
   */
  async create(data: CreateInput): Promise<Omit<T, 'password'>> {
    return await this.model.create({
      data,
      select: this.getSelectFields(),
    });
  }

  /**
   * Trouve une entité par son ID
   */
  async findById(id: string): Promise<Omit<T, 'password'> | null> {
    return await this.model.findUnique({
      where: { id },
      select: this.getSelectFields(),
    });
  }

  /**
   * Trouve toutes les entités avec pagination
   */
  async findAll(options: PaginationOptions = {}): Promise<PaginatedResult<Omit<T, 'password'>>> {
    const {
      page = 1,
      limit = 10,
      orderBy = 'createdAt',
      orderDirection = 'desc'
    } = options;

    const skip = (page - 1) * limit;
    const take = limit;

    const [data, total] = await Promise.all([
      this.model.findMany({
        skip,
        take,
        select: this.getSelectFields(),
        orderBy: {
          [orderBy]: orderDirection,
        },
      }),
      this.model.count(),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Met à jour une entité
   */
  async update(id: string, data: UpdateInput): Promise<Omit<T, 'password'>> {
    return await this.model.update({
      where: { id },
      data,
      select: this.getSelectFields(),
    });
  }

  /**
   * Supprime une entité
   */
  async delete(id: string): Promise<void> {
    await this.model.delete({
      where: { id },
    });
  }

  /**
   * Compte le nombre total d'entités
   */
  async count(): Promise<number> {
    return await this.model.count();
  }

  /**
   * Trouve une entité par un champ unique
   */
  async findByField(field: string, value: any): Promise<T | null> {
    return await this.model.findUnique({
      where: { [field]: value },
    });
  }

  /**
   * Trouve la première entité correspondant aux critères
   */
  async findFirst(where: any): Promise<Omit<T, 'password'> | null> {
    return await this.model.findFirst({
      where,
      select: this.getSelectFields(),
    });
  }

  /**
   * Trouve plusieurs entités correspondant aux critères
   */
  async findMany(where: any, options: PaginationOptions = {}): Promise<Omit<T, 'password'>[]> {
    const {
      page = 1,
      limit = 10,
      orderBy = 'createdAt',
      orderDirection = 'desc'
    } = options;

    const skip = (page - 1) * limit;
    const take = limit;

    return await this.model.findMany({
      where,
      skip,
      take,
      select: this.getSelectFields(),
      orderBy: {
        [orderBy]: orderDirection,
      },
    });
  }

  /**
   * Vérifie si une entité existe
   */
  async exists(id: string): Promise<boolean> {
    const entity = await this.model.findUnique({
      where: { id },
      select: { id: true },
    });
    return entity !== null;
  }

  /**
   * Vérifie si une entité existe par un champ
   */
  async existsByField(field: string, value: any): Promise<boolean> {
    const entity = await this.model.findFirst({
      where: { [field]: value },
      select: { id: true },
    });
    return entity !== null;
  }

  /**
   * Méthode abstraite pour définir les champs à sélectionner
   * Doit être implémentée par chaque repository spécifique
   */
  protected abstract getSelectFields(): any;

  /**
   * Méthode pour gérer les erreurs Prisma
   */
  protected handlePrismaError(error: any): never {
    if (error?.code === "P2002") {
      throw new Error("Contrainte unique violée");
    }
    if (error?.code === "P2025") {
      throw new Error("Enregistrement non trouvé");
    }
    if (error?.code === "P1001") {
      throw new Error("Erreur de connexion à la base de données");
    }
    throw error;
  }
}
