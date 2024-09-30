import { Response } from "express";
import pool from "../models/db";
import { AuthRequest, Todo } from "../models/types";

export const createTodo = async (req: AuthRequest, res: Response) => {
  const { title } = req.body;
  const userId = req.user?.id;

  if (!title) {
    res.status(400).json({ message: "Title is required" });
  }

  try {
    const newTodo: Todo = (
      await pool.query(
        "INSERT INTO todos (title, user_id) VALUES ($1, $2) RETURNING *",
        [title, userId],
      )
    ).rows[0];

    res.status(201).json(newTodo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getTodos = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  try {
    const todos: Todo[] = (
      await pool.query("SELECT * FROM todos WHERE user_id = $1", [userId])
    ).rows;
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateTodo = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const userId = req.user?.id;

  try {
    // Check if todo exists and belongs to user
    const todoResult = await pool.query(
      "SELECT * FROM todos WHERE id = $1 AND user_id = $2",
      [id, userId],
    );
    const todo: Todo = todoResult.rows[0];

    if (!todo) {
      res.status(404).json({ message: "To-Do not found" });
    }

    // Update fields if provided
    const updatedTitle = title !== undefined ? title : todo.title;
    const updatedCompleted =
      completed !== undefined ? completed : todo.completed;

    const updatedTodo: Todo = (
      await pool.query(
        "UPDATE todos SET title = $1, completed = $2 WHERE id = $3 RETURNING *",
        [updatedTitle, updatedCompleted, id],
      )
    ).rows[0];

    res.json(updatedTodo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteTodo = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    // Check if todo exists and belongs to user
    const todoResult = await pool.query(
      "SELECT * FROM todos WHERE id = $1 AND user_id = $2",
      [id, userId],
    );
    const todo: Todo = todoResult.rows[0];

    if (!todo) {
      res.status(404).json({ message: "To-Do not found" });
    }

    // Delete todo
    await pool.query("DELETE FROM todos WHERE id = $1", [id]);

    res.json({ message: "To-Do deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
