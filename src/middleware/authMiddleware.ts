import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import pool from "../models/db";
import { User } from "../models/types";

interface AuthRequest extends Request {
  user?: User;
}

const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.sendStatus(401);
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: number;
    };
    const result = await pool.query(
      "SELECT id, username FROM users WHERE id = $1",
      [decoded.id],
    );
    const user: User = result.rows[0];
    if (!user) res.sendStatus(401);
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.sendStatus(403);
  }
};

export default authMiddleware;
