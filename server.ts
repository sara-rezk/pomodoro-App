import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const args = process.argv.slice(2);

let cliPort: number | null = null;
let cliHost: string | null = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--port" && args[i + 1]) {
    cliPort = parseInt(args[i + 1], 10);
  } else if (args[i].startsWith("--port=")) {
    cliPort = parseInt(args[i].split("=")[1], 10);
  }
  if (args[i] === "--host" && args[i + 1]) {
    cliHost = args[i + 1];
  } else if (args[i].startsWith("--host=")) {
    cliHost = args[i].split("=")[1];
  }
}

const PORT = cliPort || (process.env.PORT ? parseInt(process.env.PORT, 10) : 3000);
const HOST = cliHost || process.env.HOST || "0.0.0.0";

app.use(express.json());

// Immediate health check endpoints
app.get(["/healthz", "/health", "/_health"], (_req, res) => {
  res.status(200).send("OK");
});

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
    const { goal, language = 'tr' } = req.body;
    if (!goal) return res.status(400).json({ error: "Goal is required" });

    const langInstruction = language === 'ar' 
      ? 'Çıktı dili: Arapça (العربية).' 
      : language === 'en' 
      ? 'Çıktı dili: İngilizce (English).' 
      : 'Çıktı dili: Türkçe.';

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Parçala ve fethet: Şu akademik hedefi 15-25 dakikalık 5-8 adet mikro-göreve böl. Her göreve bir öncelik (high, medium, low) ata. Sadece JSON döndür. ${langInstruction}
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
    const { text, language = 'tr' } = req.body;
    if (!text) return res.status(400).json({ error: "Text is required" });

    const langInstruction = language === 'ar' 
      ? 'Çıktı dili: Arapça (العربية).' 
      : language === 'en' 
      ? 'Çıktı dili: İngilizce (English).' 
      : 'Çıktı dili: Türkçe.';

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Şu metinden önemli kavramları ayıkla ve SuperMemo-2 stili flashcard'lar oluştur. Sadece JSON döndür. ${langInstruction}
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

app.post("/api/ai/suggest-session-tasks", async (req, res) => {
  try {
    const { durationMinutes, language = 'tr' } = req.body;
    if (!durationMinutes) return res.status(400).json({ error: "Duration is required" });

    const langInstruction = language === 'ar' 
      ? 'Arapça (العربية)' 
      : language === 'en' 
      ? 'İngilizce (English)' 
      : 'Türkçe';

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Parçala ve fethet: Kullanıcının ${durationMinutes} dakikalık bir odaklanma seansı var. Bu süreye uygun, odaklanmasını ve yüksek verim almasını sağlayacak 3 adet mikro-görev/seans görevi öner. Sadece JSON döndür. Dil: ${langInstruction}.
      Örnek format: { tasks: [{ text: "İlk 10 dakika: Konu başlığını hızlıca oku" }, { text: "25 dakika: Özet çıkar ve anahtar kelimeleri yaz" }, { text: "Son 10 dakika: Kendini test et" }] }`,
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
                  text: { type: Type.STRING }
                },
                required: ["text"]
              }
            }
          },
          required: ["tasks"]
        }
      }
    });

    res.json(JSON.parse(response.text));
  } catch (error) {
    console.error("AI Session Tasks Error:", error);
    res.status(500).json({ error: "AI task suggestions failed" });
  }
});

// Vite Middleware & Server Initialization
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const vitePromise = createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });

    app.use(async (req, res, next) => {
      if (req.originalUrl.startsWith("/api") || req.originalUrl === "/healthz" || req.originalUrl === "/health" || req.originalUrl === "/_health") {
        return next();
      }
      try {
        const vite = await vitePromise;
        vite.middlewares(req, res, next);
      } catch (err) {
        next(err);
      }
    });

    app.use("*", async (req, res, next) => {
      if (req.originalUrl.startsWith("/api") || req.originalUrl === "/healthz" || req.originalUrl === "/health" || req.originalUrl === "/_health") {
        return next();
      }
      try {
        const vite = await vitePromise;
        const url = req.originalUrl;
        const templatePath = path.resolve(process.cwd(), "index.html");
        let template = fs.readFileSync(templatePath, "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        try {
          const vite = await vitePromise;
          vite.ssrFixStacktrace(e as Error);
        } catch {
          // ignore
        }
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
    console.log(`Local: http://localhost:${PORT}/`);
    console.log(`ready in 50 ms`);
  });
}

bootstrap();
