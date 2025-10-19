import { z } from "zod";

export const CreateInterventionSchema = z.object({
  titre: z.string().min(1, "Le titre est requis"),
  dateStart: z.string().min(1, "La date de début est requise"),
  dateEnd: z.string().min(1, "La date de fin est requise"),
  status: z.number().int().min(0, "Le statut doit être un entier positif"),
  priority: z.string().min(1, "La priorité est requise"),
  customer: z.string().min(1, "Le client est requis"),
  long: z.number().min(-180).max(180, "La longitude doit être entre -180 et 180"),
  lat: z.number().min(-90).max(90, "La latitude doit être entre -90 et 90"),
  distance: z.number().min(0, "La distance doit être positive"),
  description: z.string().min(1, "La description est requise"),
  userId: z.string().uuid("L'ID utilisateur doit être un UUID valide"),
});

export const UpdateInterventionSchema = z.object({
  titre: z.string().min(1, "Le titre est requis").optional(),
  dateStart: z.string().min(1, "La date de début est requise").optional(),
  dateEnd: z.string().min(1, "La date de fin est requise").optional(),
  status: z.number().int().min(0, "Le statut doit être un entier positif").optional(),
  priority: z.string().min(1, "La priorité est requise").optional(),
  customer: z.string().min(1, "Le client est requis").optional(),
  long: z.number().min(-180).max(180, "La longitude doit être entre -180 et 180").optional(),
  lat: z.number().min(-90).max(90, "La latitude doit être entre -90 et 90").optional(),
  distance: z.number().min(0, "La distance doit être positive").optional(),
  description: z.string().min(1, "La description est requise").optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "Au moins un champ doit être fourni pour la mise à jour",
});

export type CreateInterventionDTO = z.infer<typeof CreateInterventionSchema>;
export type UpdateInterventionDTO = z.infer<typeof UpdateInterventionSchema>;
