import { prisma } from "../utils/prisma";
import { User } from "@prisma/client";
import { BaseRepository } from "./base.repository";

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
  token: string | null;
}

export interface UpdateUserData {
  email?: string;
  password?: string;
  name?: string;
  token?: string;
}

export class UserRepository extends BaseRepository<User, CreateUserData, UpdateUserData> {
  constructor() {
    super(prisma.user, "User");
  }

  /**
   * Définit les champs à sélectionner pour les requêtes
   */
  protected getSelectFields() {
    return {
      id: true,
      email: true,
      name: true,
      token: true,
      createdAt: true,
    };
  }

  /**
   * Trouve un utilisateur par son email (avec mot de passe pour l'authentification)
   */
  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
  }

  /**
   * Vérifie si un email existe déjà
   */
  async emailExists(email: string): Promise<boolean> {
    return await this.existsByField("email", email.toLowerCase().trim());
  }

  /**
   * Trouve un utilisateur par son email (sans mot de passe)
   */
  async findByEmailSafe(email: string): Promise<Omit<User, 'password'> | null> {
    return await this.findFirst({ email: email.toLowerCase().trim() });
  }
}
