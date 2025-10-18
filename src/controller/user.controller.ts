import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { CreateUserDTO } from "../model/dto/user.dto";
import { fail, ok } from "../utils/base_response.utils";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as CreateUserDTO;

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return res.status(409).json(fail("Email déjà utilisé"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = crypto.randomBytes(32).toString("hex");

    const user = await prisma.user.create({
      data: { email, password: hashedPassword, token },
      select: { id: true, email: true, token: true, createdAt: true},
    });

    return res.status(201).json(ok("Utilisateur créé", user));
  } catch (e: any) {
    // P2002 = contrainte unique (email/token)
    if (e?.code === "P2002") {
      return res.status(409).json(fail("Contrainte unique violée (email ou token)"));
    }
    return res.status(500).json(fail("Erreur serveur"));
  }
};
