import type { Request, Response } from "express";
import { redis } from "./redis.js";

export const streamLogs = async (req: Request, res: Response) => {
    const { taskId } = req.params;

    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive"
    });

    const channel = `logs:${taskId}`;
    const sub = redis.duplicate();
    await sub.subscribe(channel);

    sub.on("message", (_:any, message: any) => {
        res.write(`data: ${message}\n\n`);
    });

    req.on("close", () => {
        sub.unsubscribe(channel);
        sub.disconnect();
    });
};
