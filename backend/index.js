// Author: Shruti Mandaokar

// =========================
// IMPORTS
// =========================
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ws from "ws";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

// Load environment variables into process.env
dotenv.config();

function parseAIJson(text) {
    const cleaned = text.replace(/^```(?:json)?\s*|```\s*$/gm, "").trim();
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end <= start) {
        throw new SyntaxError("AI response contained no JSON object");
    }
    return JSON.parse(cleaned.slice(start, end + 1));
}

// =========================
// APP INITIALIZATION
// =========================
const app = express();
app.use(cors());
app.use(express.json());

// =========================
// AI + DATABASE SETUP
// =========================
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
        realtime: {
            transport: ws,
        },
    }
);

// =========================
// HEALTH CHECK ROUTE
// =========================
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        message: "VibeMatch backend is running 🌹",
    });
});

// =========================
// MAIN AI GENERATION ROUTE
// =========================
app.post("/api/generate", async (req, res) => {

    // Extract user input from request body
    const { name, description, interests, connectionType, profileLink, tags } = req.body;

    // Validate required fields
    if (!description) {
        return res.status(400).json({ error: "Description is required" });
    }

    // Validate profile link format if provided
    if (profileLink && !profileLink.startsWith("https://")) {
        return res.status(400).json({ error: "Profile link must start with https://" });
    }

    // =========================
    // PROMPT ENGINEERING
    // =========================
    const prompt = `
You are a warm, emotionally intelligent assistant helping someone craft a genuine opening message for a ${connectionType || "romantic"} connection.

Person's name: ${name || "them"}
About them: ${description}
Shared interests or context: ${interests || "not specified"}
Tags that describe them: ${tags?.length ? tags.join(", ") : "not specified"}
Profile link for extra context: ${profileLink || "not provided"}

Return ONLY valid JSON with this exact shape (no markdown, no extra text):
{
  "messages": [
    {
      "vibe": "warm",
      "emoji": "🌸",
      "message": "a warm, sincere opening message (2-3 sentences)",
      "why": "one short sentence on why this tone works"
    },
    {
      "vibe": "witty",
      "emoji": "✨",
      "message": "a clever, playful opening message (2-3 sentences)",
      "why": "one short sentence on why this tone works"
    },
    {
      "vibe": "curious",
      "emoji": "🦋",
      "message": "a thoughtful, question-driven opening message (2-3 sentences)",
      "why": "one short sentence on why this tone works"
    }
  ],
  "songVibes": [
    {
      "title": "song title",
      "artist": "artist name",
      "reason": "one sentence why this song matches the energy",
      "searchQuery": "song title artist"
    },
    {
      "title": "song title",
      "artist": "artist name",
      "reason": "one sentence why this song matches the energy",
      "searchQuery": "song title artist"
    },
    {
      "title": "song title",
      "artist": "artist name",
      "reason": "one sentence why this song matches the energy",
      "searchQuery": "song title artist"
    }
  ],
  "overallVibe": "2-3 word vibe label e.g. golden hour energy",
  "vibeColor": "one of: pink, purple, teal, amber, blue"
}`;

    try {
        // =========================
        // CALL GEMINI AI
        // =========================
        const model = genAI.getGenerativeModel({
            model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
        });

        // Generate AI response from prompt
        const result = await model.generateContent(prompt);

        // Extract raw text response
        const text = result.response.text().trim();

        // Clean possible markdown formatting from response
        const data = parseAIJson(text);

        // =========================
        // SAVE TO SUPABASE
        // =========================
        const { data: saved, error } = await supabase
            .from("vibes")
            .insert({
                name: name || null,
                description,
                interests: interests || null,
                connection_type: connectionType || "romantic",
                profile_link: profileLink || null,
                tags: tags || [],
                result: data,
            })
            .select()
            .single();

        // Log DB errors if any
        if (error) console.error("Supabase error:", error.message);

        // =========================
        // RESPONSE TO CLIENT
        // =========================
        res.json({
            ...data,
            id: saved?.id,
        });

    } catch (err) {
        console.error("Generation error:", err);

        if (err instanceof SyntaxError) {
            return res.status(500).json({
                error: "AI returned invalid JSON. Please try again.",
            });
        }

        if (err.status === 429) {
            return res.status(429).json({
                error: "Gemini API quota exceeded. Wait a minute and try again, or switch to a different model in .env.",
            });
        }

        if (err.status === 404) {
            return res.status(500).json({
                error: `Model "${process.env.GEMINI_MODEL || "gemini-2.5-flash"}" not found. Update GEMINI_MODEL in backend/.env.`,
            });
        }

        res.status(500).json({
            error: "Failed to generate. Check your Gemini API key and model name.",
        });
    }
});

// =========================
// SHARE ENDPOINT
// =========================
app.get("/api/share/:id", async (req, res) => {
    const { data, error } = await supabase
      .from("vibes")
      .select("id, name, connection_type, result, created_at")
      .eq("id", req.params.id)
      .single();
  
    if (error) return res.status(404).json({ error: "Vibe not found" });
  
    res.json(data);
  });

// =========================
// HISTORY ENDPOINT
// =========================
app.get("/api/history", async (req, res) => {
    const { data, error } = await supabase
        .from("vibes")
        .select("id, name, connection_type, tags, result, created_at")
        .order("created_at", { ascending: false })
        .limit(10);

    if (error) return res.status(500).json({ error: error.message });

    res.json(data);
});

// =========================
// DELETE HISTORY ITEM
// =========================
app.delete("/api/history/:id", async (req, res) => {
    const { error } = await supabase
        .from("vibes")
        .delete()
        .eq("id", req.params.id);

    if (error) return res.status(500).json({ error: error.message });

    res.json({ success: true });
});

// =========================
// START SERVER
// =========================
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} 🌹`);
});