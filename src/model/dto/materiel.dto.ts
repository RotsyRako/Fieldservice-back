import { z } from "zod";

export const CreateMaterielSchema = z.object({
  name: z.string().min(1, "Le nom du matériel est requis"),
  quantity: z.number().int().min(1, "La quantité doit être un entier positif"),
  idIntervention: z.string().uuid("L'ID intervention doit être un UUID valide"),
});

export const UpdateMaterielSchema = z.object({
  name: z.string().min(1, "Le nom du matériel est requis").optional(),
  quantity: z.number().int().min(1, "La quantité doit être un entier positif").optional(),
  idIntervention: z.string().uuid("L'ID intervention doit être un UUID valide").optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "Au moins un champ doit être fourni pour la mise à jour",
});

export type CreateMaterielDTO = z.infer<typeof CreateMaterielSchema>;
export type UpdateMaterielDTO = z.infer<typeof UpdateMaterielSchema>;
