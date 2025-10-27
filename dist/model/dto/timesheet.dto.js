"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTimesheetSchema = exports.CreateTimesheetSchema = void 0;
const zod_1 = require("zod");
exports.CreateTimesheetSchema = zod_1.z.object({
    description: zod_1.z.string().min(1, "La description est requise"),
    timeAllocated: zod_1.z.number().positive("Le temps alloué doit être un nombre positif"),
    date: zod_1.z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "Le format de date doit être dd/mm/YYYY"),
    idIntervention: zod_1.z.string().uuid("L'ID intervention doit être un UUID valide"),
});
exports.UpdateTimesheetSchema = zod_1.z.object({
    description: zod_1.z.string().min(1, "La description est requise").optional(),
    timeAllocated: zod_1.z.number().positive("Le temps alloué doit être un nombre positif").optional(),
    date: zod_1.z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "Le format de date doit être dd/mm/YYYY").optional(),
    idIntervention: zod_1.z.string().uuid("L'ID intervention doit être un UUID valide").optional(),
}).refine((data) => Object.keys(data).length > 0, {
    message: "Au moins un champ doit être fourni pour la mise à jour",
});
