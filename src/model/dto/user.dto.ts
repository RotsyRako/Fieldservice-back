import { z } from "zod";

export const CreateUserSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.string().email("L'email est invalide"),
  password: z.string().min(6, "Le mot de passe doit avoir au moins 6 caractères"),
});

export const LoginSchema = z.object({
  email: z.string().email("L'email est invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export const UpdateUserSchema = z.object({
  name: z.string().min(1, "Le nom est requis").optional(),
  email: z.string().email("L'email est invalide").optional(),
  password: z.string().min(6, "Le mot de passe doit avoir au moins 6 caractères").optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "Au moins un champ doit être fourni pour la mise à jour",
});

export type CreateUserDTO = z.infer<typeof CreateUserSchema>;
export type LoginDTO = z.infer<typeof LoginSchema>;
export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;
