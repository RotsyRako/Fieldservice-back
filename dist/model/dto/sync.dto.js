"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncInterventionSchema = void 0;
const zod_1 = require("zod");
// Schémas pour les entités dans la synchronisation (id optionnel pour upsert)
const MaterielSyncSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    name: zod_1.z.string().min(1, "Le nom du matériel est requis"),
    quantity: zod_1.z.number().int().min(1, "La quantité doit être un entier positif"),
});
const TimesheetSyncSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    description: zod_1.z.string().min(1, "La description est requise"),
    timeAllocated: zod_1.z.number().positive("Le temps alloué doit être un nombre positif"),
    date: zod_1.z.string().min(1, "La date est requise"),
});
const ImageSyncSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    filename: zod_1.z.string().min(1, "Le nom de fichier est requis"),
    data: zod_1.z.string().min(1, "Les données sont requises"),
});
const DocumentSyncSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    filename: zod_1.z.string().min(1, "Le nom de fichier est requis"),
    data: zod_1.z.string().min(1, "Les données sont requises"),
});
const CommentSyncSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    message: zod_1.z.string().min(1, "Le message est requis"),
    date: zod_1.z.string().min(1, "La date est requise"),
    attachmentFilename: zod_1.z.string().optional().nullable(),
    attachmentData: zod_1.z.string().optional().nullable(),
});
const SignatureSyncSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    filename: zod_1.z.string().min(1, "Le nom de fichier est requis"),
    data: zod_1.z.string().min(1, "Les données sont requises"),
});
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
