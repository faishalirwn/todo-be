import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import { getUser } from "../controllers/userController";

const router = Router();

router.get("/", authMiddleware, getUser);

export default router;
