import express from "express";
import { agent } from "../controllers/agent.controllers.js";
import multer from "../config/multer.js"

const router = express.Router();
router.post("/chat",multer.single('file'),agent)

export default router;