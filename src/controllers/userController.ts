import { AuthRequest } from "../models/types.js";
import { Response } from "express";

export const getUser = async (req: AuthRequest, res: Response) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(404).json({ error: "User not found" });
  }
};
