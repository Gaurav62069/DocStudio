import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import scrapeRoutes from "./routes/scrape.routes.js";
import dns from "dns";
// Environment variables load karna
dotenv.config();

dns.setServers(["8.8.8.8", "1.1.1.1"]);
// Database connect karna
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // JSON data read karne ke liye
app.use("/api/auth", authRoutes);
app.use("/api/data", scrapeRoutes);
// Test Route
app.get("/", (req, res) => {
  res.send("RCard Backend is Running!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
