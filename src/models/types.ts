import { Request } from "express";

export interface User {
  id: number;
  username: string;
  password: string;
}

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  user_id: number;
}

export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
  };
}
