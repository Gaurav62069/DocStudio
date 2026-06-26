import express from "express";
import multer from "multer";
import {
  scrapeCardData,
  extractFromPdf,
} from "../controllers/scrape.controller.js";

const router = express.Router();

// Multer Setup - Memory storage use karenge taaki file server pe save na ho, direct RAM me read ho jaye
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Routes
router.post("/scrape", scrapeCardData);

// 'pdfFile' wo naam hai jo frontend se file bhejte time Form Data me use hoga
router.post("/upload", upload.single("pdfFile"), extractFromPdf);

export default router;
