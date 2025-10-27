import { z } from "zod";

export const CreateCommentSchema = z.object({
  message: z.string().min(1, "Le message est requis"),
  date: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "La date doit être au format dd/mm/yyyy"),
  attachmentFilename: z.string().optional(),
  attachmentData: z.string().optional(),
  idIntervention: z.string().uuid("L'ID d'intervention doit être un UUID valide"),
});

export const UpdateCommentSchema = z.object({
  message: z.string().min(1, "Le message est requis").optional(),
  date: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "La date doit être au format dd/mm/yyyy").optional(),
  attachmentFilename: z.string().optional(),
  attachmentData: z.string().optional(),
  idIntervention: z.string().uuid("L'ID d'intervention doit être un UUID valide").optional(),
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

export type CreateCommentDTO = z.infer<typeof CreateCommentSchema>;
export type UpdateCommentDTO = z.infer<typeof UpdateCommentSchema>;
