const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const app = express();

app.use(cors());

const upload = multer({
  storage: multer.memoryStorage(),
});

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.get("/", (req, res) => {
  res.send("Sign Image AI Backend is running");
});

app.post("/api/analyze", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No image uploaded",
      });
    }

    const imageBase64 = req.file.buffer.toString("base64");

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: req.file.mimetype,
                data: imageBase64,
              },
            },
            
{
  text: `
Analyze this image for a possible sign-language gesture.

Return ONLY this format:

Possible Sign: [most likely sign, letter, or gesture]

Meaning: [what the sign means]

What the person is communicating: [what the person is likely communicating in simple natural language]

Rules:
- Identify the most likely recognized sign or fingerspelling letter.
- Focus on the meaning of the sign, not the physical hand shape.
- Do not describe finger positions.
- If it is a fingerspelling letter, explain that it represents that letter.
- If a complete message cannot be determined from one image, say so briefly.
- Do not add an introduction.
- Do not add numbered lists.
- Keep the response short and simple.
  `,
},
          ],
        },
      ],
    });

    res.json({
      result: response.text,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to analyze image",
    });
  }
});

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});