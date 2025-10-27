import { z } from "zod";

export const CreateTimesheetSchema = z.object({
  description: z.string().min(1, "La description est requise"),
  timeAllocated: z.number().positive("Le temps alloué doit être un nombre positif"),
  date: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "Le format de date doit être dd/mm/YYYY"),
  idIntervention: z.string().uuid("L'ID intervention doit être un UUID valide"),
});

export const UpdateTimesheetSchema = z.object({
  description: z.string().min(1, "La description est requise").optional(),
  timeAllocated: z.number().positive("Le temps alloué doit être un nombre positif").optional(),
  date: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "Le format de date doit être dd/mm/YYYY").optional(),
  idIntervention: z.string().uuid("L'ID intervention doit être un UUID valide").optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "Au moins un champ doit être fourni pour la mise à jour",
});

export type CreateTimesheetDTO = z.infer<typeof CreateTimesheetSchema>;
export type UpdateTimesheetDTO = z.infer<typeof UpdateTimesheetSchema>;
