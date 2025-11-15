import { Queue, Worker } from "bullmq";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger.js";
import { db } from "../db/drizzle.js";
import { tasks } from "../db/schema.js";
import { bullRedis } from "../config/bullmq.js";

export const taskQueue = new Queue("agent-tasks", {
    connection: bullRedis
});

// Create worker instance
const worker = new Worker(
    "agent-tasks",
    async (job) => {
        const { taskId } = job.data;

        logger.info(`Processing task ${taskId}`);

        // TODO: actual agent work
        await new Promise(res => setTimeout(res, 1000));

        await db.update(tasks)
            .set({ status: "completed" })
            .where(eq(tasks.id, taskId));

        logger.info(`Task ${taskId} completed`);
    },
    { connection: bullRedis }
);

// Log when worker is ready
worker.on("ready", () => {
    console.log("Worker is running...");
});

// Log errors
worker.on("error", (err) => {
    console.error("Worker error:", err);
});
