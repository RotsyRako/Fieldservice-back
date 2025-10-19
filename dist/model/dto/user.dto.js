"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserSchema = exports.LoginSchema = exports.CreateUserSchema = void 0;
const zod_1 = require("zod");
exports.CreateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Le nom est requis"),
    email: zod_1.z.string().email("L'email est invalide"),
    password: zod_1.z.string().min(6, "Le mot de passe doit avoir au moins 6 caractères"),
});
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email("L'email est invalide"),
    password: zod_1.z.string().min(1, "Le mot de passe est requis"),
});
exports.UpdateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Le nom est requis").optional(),
    email: zod_1.z.string().email("L'email est invalide").optional(),
    password: zod_1.z.string().min(6, "Le mot de passe doit avoir au moins 6 caractères").optional(),
}).refine((data) => Object.keys(data).length > 0, {
    message: "Au moins un champ doit être fourni pour la mise à jour",
});
