import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { router as taskRoutes } from "./routes/task.route.js";
import { router as logsRoutes } from "./routes/logs.route.js";
import { router as healthRoutes } from "./routes/health.route.js";
import { errorHandler } from "./middlewares/error.middleware.js";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


// Routes
app.use("/api/tasks", taskRoutes);
app.use("/api/logs", logsRoutes);
app.use("/api/health", healthRoutes);

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
