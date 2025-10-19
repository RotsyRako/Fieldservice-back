import bcrypt from "bcrypt";
import { UserRepository, CreateUserData, UpdateUserData } from "../repository/user.repository";
import { CreateUserDTO } from "../model/dto/user.dto";
import { BaseService, ServiceResponse } from "./base.service";
import { User } from "@prisma/client";
import { JWTUtils } from "../utils/jwt.utils";

export class UserService extends BaseService<User, CreateUserData, UpdateUserData> {
  private userRepository: UserRepository;

  constructor() {
    const userRepository = new UserRepository();
    super(userRepository);
    this.userRepository = userRepository;
  }

  /**
   * Crée un nouvel utilisateur avec validation métier
   * Override de la méthode create du BaseService
   */
  async createUser(userData: CreateUserDTO): Promise<ServiceResponse> {
    try {
      const { email, password, name } = userData;

      // Validation métier : vérifier l'unicité de l'email
      const emailExists = await this.userRepository.emailExists(email);
      if (emailExists) {
        return {
          success: false,
          message: "Email déjà utilisé",
          error: "EMAIL_ALREADY_EXISTS"
        };
      }

      // Hachage du mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Création de l'utilisateur (sans token en base, on utilisera JWT)
      const userDataToCreate: CreateUserData = {
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        name: name.trim(),
        token: null, // Plus besoin de token en base avec JWT
      };

      const result = await this.create(userDataToCreate);
      
      if (result.success && result.data) {
        // Générer le token JWT avec les données utilisateur
        const jwtToken = JWTUtils.generateToken(result.data);
        
        return {
          success: true,
          data: {
            user: result.data,
            token: jwtToken
          },
          message: "Utilisateur créé avec succès"
        };
      }
      
      return result;

    } catch (error: any) {
      return this.handleError(error, "Erreur lors de la création de l'utilisateur");
    }
  }

  /**
   * Authentifie un utilisateur (vérifie email + mot de passe)
   */
  async authenticateUser(email: string, password: string): Promise<ServiceResponse> {
    try {
      const user = await this.userRepository.findByEmail(email);
      
      if (!user) {
        return {
          success: false,
          message: "Email ou mot de passe incorrect",
          error: "INVALID_CREDENTIALS"
        };
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return {
          success: false,
          message: "Email ou mot de passe incorrect",
          error: "INVALID_CREDENTIALS"
        };
      }

      // Retourner sans le mot de passe
      const { password: _, ...userWithoutPassword } = user;

      // Générer le token JWT avec les données utilisateur
      const jwtToken = JWTUtils.generateToken(userWithoutPassword);

      return {
        success: true,
        data: {
          user: userWithoutPassword,
          token: jwtToken
        },
        message: "Authentification réussie"
      };

    } catch (error: any) {
      return this.handleError(error, "Erreur lors de l'authentification");
    }
  }

  /**
   * Trouve un utilisateur par son email (sans mot de passe)
   */
  async getUserByEmail(email: string): Promise<ServiceResponse> {
    try {
      const user = await this.userRepository.findByEmailSafe(email);
      
      if (!user) {
        return {
          success: false,
          message: "Utilisateur non trouvé",
          error: "USER_NOT_FOUND"
        };
      }

      return {
        success: true,
        data: user,
        message: "Utilisateur trouvé"
      };

    } catch (error: any) {
      return this.handleError(error, "Erreur lors de la récupération de l'utilisateur");
    }
  }


  /**
   * Met à jour un utilisateur avec validation métier
   * Override de la méthode update du BaseService
   */
  async updateUser(id: string, updateData: Partial<UpdateUserData>): Promise<ServiceResponse> {
    try {
      // Si l'email est modifié, vérifier l'unicité
      if (updateData.email) {
        const existingUser = await this.userRepository.findById(id);
        if (existingUser && updateData.email !== existingUser.email) {
          const emailExists = await this.userRepository.emailExists(updateData.email);
          if (emailExists) {
            return {
              success: false,
              message: "Email déjà utilisé",
              error: "EMAIL_ALREADY_EXISTS"
            };
          }
          updateData.email = updateData.email.toLowerCase().trim();
        }
      }

      // Si le mot de passe est modifié, le hasher
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
      }

      // Normaliser le nom s'il est modifié
      if (updateData.name) {
        updateData.name = updateData.name.trim();
      }

      const result = await this.update(id, updateData);
      return result;

    } catch (error: any) {
      return this.handleError(error, "Erreur lors de la mise à jour de l'utilisateur");
    }
  }

  /**
   * Validation métier avant création
   */
  protected async validateCreate(data: CreateUserData): Promise<void> {
    // Validation de l'email
    if (!data.email || !data.email.includes('@')) {
      throw new Error("Email invalide");
    }

    // Validation du mot de passe
    if (!data.password || data.password.length < 6) {
      throw new Error("Le mot de passe doit avoir au moins 6 caractères");
    }

    // Validation du nom
    if (!data.name || data.name.trim().length === 0) {
      throw new Error("Le nom est requis");
    }

    // Plus besoin de valider le token avec JWT
  }

  /**
   * Validation métier avant mise à jour
   */
  protected async validateUpdate(id: string, data: UpdateUserData): Promise<void> {
    // Validation de l'email si fourni
    if (data.email && !data.email.includes('@')) {
      throw new Error("Email invalide");
    }

    // Validation du mot de passe si fourni
    if (data.password && data.password.length < 6) {
      throw new Error("Le mot de passe doit avoir au moins 6 caractères");
    }

    // Validation du nom si fourni
    if (data.name && data.name.trim().length === 0) {
      throw new Error("Le nom ne peut pas être vide");
    }
  }

  /**
   * Validation métier avant suppression
   */
  protected async validateDelete(id: string): Promise<void> {
    // Ici on pourrait ajouter des validations spécifiques
    // Par exemple : vérifier que l'utilisateur n'a pas de données liées
    // Pour l'instant, on permet la suppression
  }
}