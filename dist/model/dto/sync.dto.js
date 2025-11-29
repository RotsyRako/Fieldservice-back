"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncInterventionSchema = void 0;
const zod_1 = require("zod");
// Schémas pour les entités dans la synchronisation (id optionnel pour upsert, peut être null)
const MaterielSyncSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().nullish(),
    name: zod_1.z.string().min(1, "Le nom du matériel est requis"),
    quantity: zod_1.z.number().int().min(1, "La quantité doit être un entier positif"),
}).passthrough(); // Permet les champs supplémentaires comme localId, createdAt, etc.
const TimesheetSyncSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().nullish(),
    description: zod_1.z.string().min(1, "La description est requise"),
    timeAllocated: zod_1.z.number().positive("Le temps alloué doit être un nombre positif"),
    date: zod_1.z.string().min(1, "La date est requise"),
}).passthrough(); // Permet les champs supplémentaires comme localId, idIntervention, createdAt, etc.
const ImageSyncSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().nullish(),
    filename: zod_1.z.string().min(1, "Le nom de fichier est requis"),
    data: zod_1.z.string().min(1, "Les données sont requises"),
}).passthrough(); // Permet les champs supplémentaires comme localId, createdAt, etc.
const DocumentSyncSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().nullish(),
    filename: zod_1.z.string().min(1, "Le nom de fichier est requis"),
    data: zod_1.z.string().min(1, "Les données sont requises"),
}).passthrough(); // Permet les champs supplémentaires comme localId, createdAt, etc.
const CommentSyncSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().nullish(),
    message: zod_1.z.string().min(1, "Le message est requis"),
    date: zod_1.z.string().min(1, "La date est requise"),
    attachmentFilename: zod_1.z.string().optional().nullable(),
    attachmentData: zod_1.z.string().optional().nullable(),
}).passthrough(); // Permet les champs supplémentaires comme localId, createdAt, etc.
const SignatureSyncSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().nullish(),
    filename: zod_1.z.string().min(1, "Le nom de fichier est requis"),
    data: zod_1.z.string().min(1, "Les données sont requises"),
}).passthrough(); // Permet les champs supplémentaires comme localId, idIntervention, createdAt, etc.
// Schéma pour un élément de synchronisation d'intervention
const InterventionSyncItemSchema = zod_1.z.object({
    id: zod_1.z.string().uuid("L'ID intervention doit être un UUID valide"),
    status: zod_1.z.number().int().min(0, "Le statut doit être un entier positif"),
    materials: zod_1.z.array(MaterielSyncSchema).optional().default([]),
    timesheets: zod_1.z.array(TimesheetSyncSchema).optional().default([]),
    images: zod_1.z.array(ImageSyncSchema).optional().default([]),
    documents: zod_1.z.array(DocumentSyncSchema).optional().default([]),
    signature: SignatureSyncSchema.optional().nullable(),
    comments: zod_1.z.array(CommentSyncSchema).optional().default([]),
});
// Schéma principal pour la synchronisation
exports.SyncInterventionSchema = zod_1.z.object({
    data: zod_1.z.array(InterventionSyncItemSchema).min(1, "Au moins une intervention doit être fournie"),
});
