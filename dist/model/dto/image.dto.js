"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateImageSchema = exports.CreateImageSchema = void 0;
const zod_1 = require("zod");
exports.CreateImageSchema = zod_1.z.object({
    filename: zod_1.z.string().min(1, "Le nom de fichier est requis"),
    data: zod_1.z.string().min(1, "Les données sont requises"),
    idIntervention: zod_1.z.string().uuid("L'ID d'intervention doit être un UUID valide"),
});
exports.UpdateImageSchema = zod_1.z.object({
    filename: zod_1.z.string().min(1, "Le nom de fichier est requis").optional(),
    data: zod_1.z.string().min(1, "Les données sont requises").optional(),
    idIntervention: zod_1.z.string().uuid("L'ID d'intervention doit être un UUID valide").optional(),
}).refine((data) => Object.keys(data).length > 0, {
    message: "Au moins un champ doit être fourni pour la mise à jour",
});
