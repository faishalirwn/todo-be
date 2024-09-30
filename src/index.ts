import express, { Application, Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import todoRoutes from "./routes/todoRoutes";
import userRoutes from "./routes/userRoutes";
import helmet from "helmet";

const app: Application = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/user", userRoutes);

// Health Check Route
app.get("/", (req: Request, res: Response) => {
  res.send("To-Do List API is running");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
