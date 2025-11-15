import { Router} from "express";
import { createTask, getTask } from "../controller/task.controller.js";

export const router:Router = Router();

router.post("/", createTask);
router.get("/:id", getTask);
