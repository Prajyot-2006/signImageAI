const express = require("express");
const cors = require("cors");
const multer = require("multer");
require("dotenv").config();

const app = express();

app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });

app.get("/", (req, res) => {
  res.send("Sign Image AI Backend is running");
});

app.post("/api/analyze", upload.single("image"), (req, res) => {
  console.log("Image received:", req.file?.originalname);

  res.json({
    message: "Image received successfully",
  });
});

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});