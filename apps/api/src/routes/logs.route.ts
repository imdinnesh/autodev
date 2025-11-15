import { Router } from "express";
import { streamLogs } from "../lib/sse.js";


export const router: Router = Router();

router.get("/:taskId", streamLogs);
