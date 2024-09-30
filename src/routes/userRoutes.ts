import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getUser } from "../controllers/userController.js";

const router = Router();

router.get("/", authMiddleware, getUser);

export default router;
