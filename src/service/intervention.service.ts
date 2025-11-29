import { InterventionRepository, CreateInterventionData, UpdateInterventionData } from "../repository/intervention.repository";
import { CreateInterventionDTO } from "../model/dto/intervention.dto";
import { BaseService, ServiceResponse } from "./base.service";
import { Intervention } from "@prisma/client";
import { PaginationOptions } from "../repository/base.repository";
import { SyncInterventionDTO, InterventionSyncItem } from "../model/dto/sync.dto";
import { MaterielRepository, CreateMaterielData, UpdateMaterielData } from "../repository/materiel.repository";
import { TimesheetRepository, CreateTimesheetData, UpdateTimesheetData } from "../repository/timesheet.repository";
import { ImageRepository, CreateImageData, UpdateImageData } from "../repository/image.repository";
import { DocumentRepository, CreateDocumentData, UpdateDocumentData } from "../repository/document.repository";
import { CommentRepository, CreateCommentData, UpdateCommentData } from "../repository/comment.repository";
import { SignatureRepository, CreateSignatureData, UpdateSignatureData } from "../repository/signature.repository";
import { prisma } from "../utils/prisma";

export class InterventionService extends BaseService<Intervention, CreateInterventionData, UpdateInterventionData> {
  private interventionRepository: InterventionRepository;
  private materielRepository: MaterielRepository;
  private timesheetRepository: TimesheetRepository;
  private imageRepository: ImageRepository;
  private documentRepository: DocumentRepository;
  private commentRepository: CommentRepository;
  private signatureRepository: SignatureRepository;

  constructor() {
    const interventionRepository = new InterventionRepository();
    super(interventionRepository);
    this.interventionRepository = interventionRepository;
    this.materielRepository = new MaterielRepository();
    this.timesheetRepository = new TimesheetRepository();
    this.imageRepository = new ImageRepository();
    this.documentRepository = new DocumentRepository();
    this.commentRepository = new CommentRepository();
    this.signatureRepository = new SignatureRepository();
  }

  /**
   * Crée une nouvelle intervention avec validation métier
   */
  async createIntervention(interventionData: CreateInterventionDTO & { userId: string }): Promise<ServiceResponse> {
    try {
      if (!interventionData.userId) {
        return {
          success: false,
          message: "L'ID utilisateur est requis",
          error: "MISSING_USER_ID"
        };
      }

      const interventionDataToCreate: CreateInterventionData = {
        titre: interventionData.titre.trim(),
        dateStart: interventionData.dateStart.trim(),
        dateEnd: interventionData.dateEnd.trim(),
        status: interventionData.status,
        priority: interventionData.priority.trim(),
        customer: interventionData.customer.trim(),
        long: interventionData.long,
        lat: interventionData.lat,
        distance: interventionData.distance,
        description: interventionData.description.trim(),
        userId: interventionData.userId,
      };

      const result = await this.create(interventionDataToCreate);
      return result;

    } catch (error: any) {
      return this.handleError(error, "Erreur lors de la création de l'intervention");
    }
  }

  /**
   * Récupère les interventions par utilisateur avec pagination
   */
  async findManyByUserId(userId: string, options: PaginationOptions = {}): Promise<ServiceResponse<Intervention[]>> {
    try {
      const data = await this.interventionRepository.findMany({ userId }, options);
      return {
        success: true,
        data,
        message: "Interventions récupérées avec succès",
      };
    } catch (error: any) {
      return this.handleError(error, "Erreur lors de la récupération des interventions par utilisateur");
    }
  }

  /**
   * Validation métier avant création
   */
  protected async validateCreate(data: CreateInterventionData): Promise<void> {
    // Validation du titre
    if (!data.titre || data.titre.trim().length === 0) {
      throw new Error("Le titre est requis");
    }

    // Validation des dates
    if (!data.dateStart || data.dateStart.trim().length === 0) {
      throw new Error("La date de début est requise");
    }
    if (!data.dateEnd || data.dateEnd.trim().length === 0) {
      throw new Error("La date de fin est requise");
    }

    // Validation du statut
    if (data.status < 0) {
      throw new Error("Le statut doit être un entier positif");
    }

    // Validation de la priorité
    if (!data.priority || data.priority.trim().length === 0) {
      throw new Error("La priorité est requise");
    }

    // Validation du client
    if (!data.customer || data.customer.trim().length === 0) {
      throw new Error("Le client est requis");
    }

    // Validation des coordonnées
    if (data.long < -180 || data.long > 180) {
      throw new Error("La longitude doit être entre -180 et 180");
    }
    if (data.lat < -90 || data.lat > 90) {
      throw new Error("La latitude doit être entre -90 et 90");
    }

    // Validation de la distance
    if (data.distance < 0) {
      throw new Error("La distance doit être positive");
    }

    // Validation de la description
    if (!data.description || data.description.trim().length === 0) {
      throw new Error("La description est requise");
    }

    // Validation de l'utilisateur
    if (!data.userId) {
      throw new Error("L'ID utilisateur est requis");
    }
  }

  /**
   * Validation métier avant mise à jour
   */
  protected async validateUpdate(id: string, data: UpdateInterventionData): Promise<void> {
    // Validation du titre si fourni
    if (data.titre && data.titre.trim().length === 0) {
      throw new Error("Le titre ne peut pas être vide");
    }

    // Validation des dates si fournies
    if (data.dateStart && data.dateStart.trim().length === 0) {
      throw new Error("La date de début ne peut pas être vide");
    }
    if (data.dateEnd && data.dateEnd.trim().length === 0) {
      throw new Error("La date de fin ne peut pas être vide");
    }

    // Validation du statut si fourni
    if (data.status !== undefined && data.status < 0) {
      throw new Error("Le statut doit être un entier positif");
    }

    // Validation de la priorité si fournie
    if (data.priority && data.priority.trim().length === 0) {
      throw new Error("La priorité ne peut pas être vide");
    }

    // Validation du client si fourni
    if (data.customer && data.customer.trim().length === 0) {
      throw new Error("Le client ne peut pas être vide");
    }

    // Validation des coordonnées si fournies
    if (data.long !== undefined && (data.long < -180 || data.long > 180)) {
      throw new Error("La longitude doit être entre -180 et 180");
    }
    if (data.lat !== undefined && (data.lat < -90 || data.lat > 90)) {
      throw new Error("La latitude doit être entre -90 et 90");
    }

    // Validation de la distance si fournie
    if (data.distance !== undefined && data.distance < 0) {
      throw new Error("La distance doit être positive");
    }

    // Validation de la description si fournie
    if (data.description && data.description.trim().length === 0) {
      throw new Error("La description ne peut pas être vide");
    }
  }

  /**
   * Validation métier avant suppression
   */
  protected async validateDelete(id: string): Promise<void> {
    // Ici on pourrait ajouter des validations spécifiques
    // Par exemple : vérifier que l'intervention n'a pas de matériels en cours d'utilisation
    // Pour l'instant, on permet la suppression (les matériels seront supprimés en cascade)
  }

  /**
   * Synchronise les interventions avec leurs données associées
   * Met à jour le statut et crée/met à jour les matériels, timesheets, images, documents, comments et signatures
   */
  async syncInterventions(syncData: SyncInterventionDTO): Promise<ServiceResponse<Intervention[]>> {
    try {
      const syncedInterventions: Intervention[] = [];

      // Traiter chaque intervention dans le tableau
      for (const item of syncData.data) {
        // Vérifier que l'intervention existe
        const intervention = await this.interventionRepository.findById(item.id);
        if (!intervention) {
          return {
            success: false,
            message: `Intervention avec l'ID ${item.id} non trouvée`,
            error: "INTERVENTION_NOT_FOUND"
          };
        }

        // Mettre à jour le statut de l'intervention
        await this.interventionRepository.update(item.id, { status: item.status });

        // Synchroniser les matériels
        if (item.materials && item.materials.length > 0) {
          for (const materiel of item.materials) {
            const createData: CreateMaterielData = {
              name: materiel.name,
              quantity: materiel.quantity,
              idIntervention: item.id,
            };
            const updateData: UpdateMaterielData = {
              name: materiel.name,
              quantity: materiel.quantity,
            };

            // Utiliser upsert pour créer ou mettre à jour selon si l'ID existe
            await this.materielRepository.upsert(materiel.id ?? undefined, createData, updateData);
          }
        }

        // Synchroniser les timesheets
        if (item.timesheets && item.timesheets.length > 0) {
          for (const timesheet of item.timesheets) {
            const createData: CreateTimesheetData = {
              description: timesheet.description,
              timeAllocated: timesheet.timeAllocated,
              date: timesheet.date,
              idIntervention: item.id,
            };
            const updateData: UpdateTimesheetData = {
              description: timesheet.description,
              timeAllocated: timesheet.timeAllocated,
              date: timesheet.date,
            };

            // Utiliser upsert pour créer ou mettre à jour selon si l'ID existe
            await this.timesheetRepository.upsert(timesheet.id ?? undefined, createData, updateData);
          }
        }

        // Synchroniser les images
        if (item.images && item.images.length > 0) {
          for (const image of item.images) {
            const createData: CreateImageData = {
              filename: image.filename,
              data: image.data,
              idIntervention: item.id,
            };
            const updateData: UpdateImageData = {
              filename: image.filename,
              data: image.data,
            };

            // Utiliser upsert pour créer ou mettre à jour selon si l'ID existe
            await this.imageRepository.upsert(image.id ?? undefined, createData, updateData);
          }
        }

        // Synchroniser les documents
        if (item.documents && item.documents.length > 0) {
          for (const document of item.documents) {
            const createData: CreateDocumentData = {
              filename: document.filename,
              data: document.data,
              idIntervention: item.id,
            };
            const updateData: UpdateDocumentData = {
              filename: document.filename,
              data: document.data,
            };

            // Utiliser upsert pour créer ou mettre à jour selon si l'ID existe
            await this.documentRepository.upsert(document.id ?? undefined, createData, updateData);
          }
        }

        // Synchroniser les commentaires
        if (item.comments && item.comments.length > 0) {
          for (const comment of item.comments) {
            const createData: CreateCommentData = {
              message: comment.message,
              date: comment.date,
              attachmentFilename: comment.attachmentFilename || null,
              attachmentData: comment.attachmentData || null,
              idIntervention: item.id,
            };
            const updateData: UpdateCommentData = {
              message: comment.message,
              date: comment.date,
              attachmentFilename: comment.attachmentFilename || null,
              attachmentData: comment.attachmentData || null,
            };

            // Utiliser upsert pour créer ou mettre à jour selon si l'ID existe
            await this.commentRepository.upsert(comment.id ?? undefined, createData, updateData);
          }
        }

        // Synchroniser la signature (une seule par intervention)
        if (item.signature) {
          const createData: CreateSignatureData = {
            filename: item.signature.filename,
            data: item.signature.data,
            idIntervention: item.id,
          };
          const updateData: UpdateSignatureData = {
            filename: item.signature.filename,
            data: item.signature.data,
          };

          // Supprimer toutes les autres signatures pour cette intervention (une seule signature autorisée)
          const existingSignatures = await prisma.signature.findMany({
            where: { 
              idIntervention: item.id,
              ...(item.signature.id ? { id: { not: item.signature.id } } : {})
            },
          });
          for (const sig of existingSignatures) {
            await this.signatureRepository.delete(sig.id);
          }

          // Utiliser upsert pour créer ou mettre à jour selon si l'ID existe
          await this.signatureRepository.upsert(item.signature.id ?? undefined, createData, updateData);
        }

        // Récupérer l'intervention complète avec toutes ses relations
        const completeIntervention = await prisma.intervention.findUnique({
          where: { id: item.id },
          include: {
            materiels: true,
            timesheets: true,
            images: true,
            documents: true,
            comments: true,
            signatures: true,
          },
        });

        if (completeIntervention) {
          syncedInterventions.push(completeIntervention);
        }
      }

      return {
        success: true,
        data: syncedInterventions,
        message: `${syncedInterventions.length} intervention(s) synchronisée(s) avec succès`,
      };
    } catch (error: any) {
      return this.handleError(error, "Erreur lors de la synchronisation des interventions");
    }
  }
}
