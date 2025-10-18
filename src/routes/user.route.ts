import { Router } from "express";
import { validate } from "../middleware/validate";
import { CreateUserSchema } from "../model/dto/user.dto";
import { createUser } from "../controller/user.controller";


const router = Router();

router.post("/users", validate(CreateUserSchema), createUser);

export default router;
