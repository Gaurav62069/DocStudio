import express from "express";
import multer from "multer";
import { extractFromPdf } from "../controllers/extract.controller.js";

const router = express.Router();

// Multer Setup - Memory storage use karenge taaki file server pe save na ho
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ==================== Routes ====================

// PDF Upload & Extract
router.post("/upload", upload.single("pdfFile"), extractFromPdf);

export default router;
