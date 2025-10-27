"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCommentSchema = exports.CreateCommentSchema = void 0;
const zod_1 = require("zod");
exports.CreateCommentSchema = zod_1.z.object({
    message: zod_1.z.string().min(1, "Le message est requis"),
    date: zod_1.z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "La date doit être au format dd/mm/yyyy"),
    attachmentFilename: zod_1.z.string().optional(),
    attachmentData: zod_1.z.string().optional(),
    idIntervention: zod_1.z.string().uuid("L'ID d'intervention doit être un UUID valide"),
});
exports.UpdateCommentSchema = zod_1.z.object({
    message: zod_1.z.string().min(1, "Le message est requis").optional(),
    date: zod_1.z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "La date doit être au format dd/mm/yyyy").optional(),
    attachmentFilename: zod_1.z.string().optional(),
    attachmentData: zod_1.z.string().optional(),
    idIntervention: zod_1.z.string().uuid("L'ID d'intervention doit être un UUID valide").optional(),
}).transform((data) => ({
    message: data.message,
    date: data.date,
    attachmentFilename: data.attachmentFilename,
    attachmentData: data.attachmentData,
    idIntervention: data.idIntervention,
})).refine((data) => {
    return data.message !== undefined || data.date !== undefined ||
        data.attachmentFilename !== undefined || data.attachmentData !== undefined ||
        data.idIntervention !== undefined;
}, {
    message: "Au moins un champ doit être fourni pour la mise à jour",
});
