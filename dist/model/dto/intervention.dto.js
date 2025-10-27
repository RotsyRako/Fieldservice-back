"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateInterventionSchema = exports.CreateInterventionSchema = void 0;
const zod_1 = require("zod");
exports.CreateInterventionSchema = zod_1.z.object({
    titre: zod_1.z.string().min(1, "Le titre est requis"),
    dateStart: zod_1.z.string().min(1, "La date de début est requise"),
    dateEnd: zod_1.z.string().min(1, "La date de fin est requise"),
    status: zod_1.z.number().int().min(0, "Le statut doit être un entier positif"),
    priority: zod_1.z.string().min(1, "La priorité est requise"),
    customer: zod_1.z.string().min(1, "Le client est requis"),
    long: zod_1.z.number().min(-180).max(180, "La longitude doit être entre -180 et 180"),
    lat: zod_1.z.number().min(-90).max(90, "La latitude doit être entre -90 et 90"),
    distance: zod_1.z.number().min(0, "La distance doit être positive"),
    description: zod_1.z.string().min(1, "La description est requise"),
});
exports.UpdateInterventionSchema = zod_1.z.object({
    titre: zod_1.z.string().min(1, "Le titre est requis").optional(),
    dateStart: zod_1.z.string().min(1, "La date de début est requise").optional(),
    dateEnd: zod_1.z.string().min(1, "La date de fin est requise").optional(),
    status: zod_1.z.number().int().min(0, "Le statut doit être un entier positif").optional(),
    priority: zod_1.z.string().min(1, "La priorité est requise").optional(),
    customer: zod_1.z.string().min(1, "Le client est requis").optional(),
    long: zod_1.z.number().min(-180).max(180, "La longitude doit être entre -180 et 180").optional(),
    lat: zod_1.z.number().min(-90).max(90, "La latitude doit être entre -90 et 90").optional(),
    distance: zod_1.z.number().min(0, "La distance doit être positive").optional(),
    description: zod_1.z.string().min(1, "La description est requise").optional(),
}).refine((data) => Object.keys(data).length > 0, {
    message: "Au moins un champ doit être fourni pour la mise à jour",
});
