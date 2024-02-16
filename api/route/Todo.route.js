import express from "express";

import { verifyToken } from "../utils/verify.js";
import {
  createTodo,
  deleteTodo,
  findTodo,
  updateTodo,
} from "../controllers/Todo.controller.js";

const router = express.Router();

router.post("/create", createTodo);

router.put("/update/:id", updateTodo);
router.delete("/delete/:id", deleteTodo);
router.get("/find/:id", findTodo);

export default router;
