"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMaterielSchema = exports.CreateMaterielSchema = void 0;
const zod_1 = require("zod");
exports.CreateMaterielSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Le nom du matériel est requis"),
    quantity: zod_1.z.number().int().min(1, "La quantité doit être un entier positif"),
    idIntervention: zod_1.z.string().uuid("L'ID intervention doit être un UUID valide"),
});
exports.UpdateMaterielSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Le nom du matériel est requis").optional(),
    quantity: zod_1.z.number().int().min(1, "La quantité doit être un entier positif").optional(),
    idIntervention: zod_1.z.string().uuid("L'ID intervention doit être un UUID valide").optional(),
}).refine((data) => Object.keys(data).length > 0, {
    message: "Au moins un champ doit être fourni pour la mise à jour",
});
