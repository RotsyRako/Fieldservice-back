import { z } from "zod";

// Schémas pour les entités dans la synchronisation (id optionnel pour upsert, peut être null)
const MaterielSyncSchema = z.object({
  id: z.string().uuid().nullish(),
  name: z.string().min(1, "Le nom du matériel est requis"),
  quantity: z.number().int().min(1, "La quantité doit être un entier positif"),
}).passthrough(); // Permet les champs supplémentaires comme localId, createdAt, etc.

const TimesheetSyncSchema = z.object({
  id: z.string().uuid().nullish(),
  description: z.string().min(1, "La description est requise"),
  timeAllocated: z.number().positive("Le temps alloué doit être un nombre positif"),
  date: z.string().min(1, "La date est requise"),
}).passthrough(); // Permet les champs supplémentaires comme localId, idIntervention, createdAt, etc.

const ImageSyncSchema = z.object({
  id: z.string().uuid().nullish(),
  filename: z.string().min(1, "Le nom de fichier est requis"),
  data: z.string().min(1, "Les données sont requises"),
}).passthrough(); // Permet les champs supplémentaires comme localId, createdAt, etc.

const DocumentSyncSchema = z.object({
  id: z.string().uuid().nullish(),
  filename: z.string().min(1, "Le nom de fichier est requis"),
  data: z.string().min(1, "Les données sont requises"),
}).passthrough(); // Permet les champs supplémentaires comme localId, createdAt, etc.

const CommentSyncSchema = z.object({
  id: z.string().uuid().nullish(),
  message: z.string().min(1, "Le message est requis"),
  date: z.string().min(1, "La date est requise"),
  attachmentFilename: z.string().optional().nullable(),
  attachmentData: z.string().optional().nullable(),
}).passthrough(); // Permet les champs supplémentaires comme localId, createdAt, etc.

const SignatureSyncSchema = z.object({
  id: z.string().uuid().nullish(),
  filename: z.string().min(1, "Le nom de fichier est requis"),
  data: z.string().min(1, "Les données sont requises"),
}).passthrough(); // Permet les champs supplémentaires comme localId, idIntervention, createdAt, etc.

// Schéma pour un élément de synchronisation d'intervention
const InterventionSyncItemSchema = z.object({
  id: z.string().uuid("L'ID intervention doit être un UUID valide"),
  status: z.number().int().min(0, "Le statut doit être un entier positif"),
  materials: z.array(MaterielSyncSchema).optional().default([]),
  timesheets: z.array(TimesheetSyncSchema).optional().default([]),
  images: z.array(ImageSyncSchema).optional().default([]),
  documents: z.array(DocumentSyncSchema).optional().default([]),
  signature: SignatureSyncSchema.optional().nullable(),
  comments: z.array(CommentSyncSchema).optional().default([]),
});

// Schéma principal pour la synchronisation
export const SyncInterventionSchema = z.object({
  data: z.array(InterventionSyncItemSchema).min(1, "Au moins une intervention doit être fournie"),
});

export type SyncInterventionDTO = z.infer<typeof SyncInterventionSchema>;
export type InterventionSyncItem = z.infer<typeof InterventionSyncItemSchema>;
export type MaterielSync = z.infer<typeof MaterielSyncSchema>;
export type TimesheetSync = z.infer<typeof TimesheetSyncSchema>;
export type ImageSync = z.infer<typeof ImageSyncSchema>;
export type DocumentSync = z.infer<typeof DocumentSyncSchema>;
export type CommentSync = z.infer<typeof CommentSyncSchema>;
export type SignatureSync = z.infer<typeof SignatureSyncSchema>;

