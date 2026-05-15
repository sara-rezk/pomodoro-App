import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Gemini Initialization
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// AI endpoints
app.post("/api/ai/breakdown", async (req, res) => {
  try {
    const { goal } = req.body;
    if (!goal) return res.status(400).json({ error: "Goal is required" });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Parçala ve fethet: Şu akademik hedefi 15-25 dakikalık 5-8 adet mikro-göreve böl. Her göreve bir öncelik (high, medium, low) ata. Sadece JSON döndür. 
      Örnek format: { tasks: [{ title: "..", description: "..", duration: 20, priority: "high" }] }
      Hedef: ${goal}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  duration: { type: Type.NUMBER },
                  priority: { type: Type.STRING, enum: ["high", "medium", "low"] }
                },
                required: ["title", "description", "duration", "priority"]
              }
            }
          }
        }
      }
    });

    res.json(JSON.parse(response.text));
  } catch (error) {
    console.error("AI Breakdown Error:", error);
    res.status(500).json({ error: "AI breakdown failed" });
  }
});

app.post("/api/ai/flashcards", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Text is required" });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Şu metinden önemli kavramları ayıkla ve SuperMemo-2 stili flashcard'lar oluştur. Sadece JSON döndür.
      Örnek format: { cards: [{ question: "..", answer: ".." }] }
      Metin: ${text}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  answer: { type: Type.STRING }
                },
                required: ["question", "answer"]
              }
            }
          }
        }
      }
    });

    res.json(JSON.parse(response.text));
  } catch (error) {
    console.error("AI Flashcards Error:", error);
    res.status(500).json({ error: "AI flashcard generation failed" });
  }
});

// Vite Middleware
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

bootstrap();
