import { z } from "zod";

export const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Le mot de passe doit avoir au moins 6 caractères"),
});

export type CreateUserDTO = z.infer<typeof CreateUserSchema>;
