import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { handleApiRequest } from "./src/api/handler.js";
dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3e3;
app.use(express.json());
app.use("/api", handleApiRequest);
app.use(express.static(__dirname));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
app.listen(PORT, () => {
  console.log(`Production server running on port ${PORT}`);
});
