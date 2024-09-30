import { Request, Response } from "express";
import pool from "../models/db.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";
import { User } from "../models/types.js";

export const signup = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username],
    );
    if (userExists.rows.length > 0) {
      res.status(400).json({ message: "Username already taken" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user into database
    const newUser: User = (
      await pool.query(
        "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username",
        [username, hashedPassword],
      )
    ).rows[0];

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const userResult = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username],
    );
    const user: User = userResult.rows[0];

    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = generateToken(user.id);

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
