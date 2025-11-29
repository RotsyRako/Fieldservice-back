import { z } from "zod";

export const CreateImageSchema = z.object({
  filename: z.string().min(1, "Le nom de fichier est requis"),
  data: z.string().min(1, "Les données sont requises"),
  idIntervention: z.string().uuid("L'ID d'intervention doit être un UUID valide"),
});

export const UpdateImageSchema = z.object({
  filename: z.string().min(1, "Le nom de fichier est requis").optional(),
  data: z.string().min(1, "Les données sont requises").optional(),
  idIntervention: z.string().uuid("L'ID d'intervention doit être un UUID valide").optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "Au moins un champ doit être fourni pour la mise à jour",
});

export type CreateImageDTO = z.infer<typeof CreateImageSchema>;
export type UpdateImageDTO = z.infer<typeof UpdateImageSchema>;
