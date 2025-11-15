import type { Request, Response, NextFunction } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db/drizzle.js";
import { tasks } from "../db/schema.js";
import { taskQueue } from "../queues/agent.queue.js";

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { prompt, repoUrl } = req.body;

    const result = await db.insert(tasks)
      .values({
        prompt,
        repoUrl,
        status: "queued"
      })
      .returning();

    const task = result[0];
    if (!task) {
      return res.status(500).json({ success: false, error: "Failed to create task" });
    }

    await taskQueue.add("agent-task", { taskId: task.id });

    return res.json({
      success: true,
      task
    });
  } catch (err) {
    next(err);
  }
};

export const getTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);

    const result = await db.select().from(tasks).where(eq(tasks.id, id));
    if (!result.length) return res.status(404).json({ error: "Task not found" });

    res.json({ task: result[0] });
  } catch (err) {
    next(err);
  }
};
