import dotenv from "dotenv";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GoogleGenAI } from "@google/genai";
import { getOrderDetails } from "./orders.js";
import { INSTRUCTIONS } from "./prompt.js";

dotenv.config();

const app = express();
const liveModel = "gemini-3.8-live";
const summaryModel = "gemini-2.5-flash";
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(currentDirectory, "..");
const orderTool = {
  name: "get_order_details",
  description: "Look up an Aura Skincare order by its order ID.",
  parameters: {
    type: "object",
    properties: { order_id: { type: "string" } },
    required: ["order_id"],
    additionalProperties: false
  }
};

app.use(express.json({ limit: "1mb" }));

app.post("/api/session", async (request, response) => {
  if (!process.env.GEMINI_API_KEY) {
    response.status(503).json({ error: "Set GEMINI_API_KEY in the server environment." });
    return;
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: { apiVersion: "v1alpha" }
    });
    const config = {
      responseModalities: ["AUDIO"],
      systemInstruction: INSTRUCTIONS,
      inputAudioTranscription: {},
      outputAudioTranscription: {},
      tools: [{ functionDeclarations: [orderTool] }]
    };
    const token = await ai.authTokens.create({
      config: {
        uses: 1,
        expireTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        newSessionExpireTime: new Date(Date.now() + 60 * 1000).toISOString(),
        liveConnectConstraints: { model: liveModel, config }
      }
    });
    response.json({ token: token.name, model: liveModel, config });
  } catch (error) {
    console.error("Failed to create the Gemini session:", error);
    response.status(502).json({ error: "Could not create the Gemini voice session." });
  }
});

app.post("/api/order", (request, response) => {
  const { order_id: orderId } = request.body || {};
  response.json(getOrderDetails(orderId));
});

app.post("/api/summary", async (request, response) => {
  const transcript = Array.isArray(request.body?.transcript) ? request.body.transcript : [];

  if (transcript.length === 0) {
    response.json({
      customer_intent: "OTHER",
      order_id: null,
      resolution_status: "UNRESOLVED",
      call_summary: "No conversation took place."
    });
    return;
  }

  if (!process.env.GEMINI_API_KEY) {
    response.status(503).json({ error: "Set GEMINI_API_KEY in the server environment." });
    return;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const result = await ai.models.generateContent({
      model: summaryModel,
      contents: [{
        role: "user",
        parts: [{
          text: `Return only valid JSON with customer_intent, order_id, resolution_status, and call_summary. customer_intent must be ORDER_TRACKING, CANCELLATION, RETURN_REFUND, POLICY_QUESTION, OUT_OF_SCOPE, or OTHER. resolution_status must be RESOLVED, UNRESOLVED, or ESCALATED. order_id must be a string or null. call_summary must be 1-2 sentences.\n\nTranscript:\n${JSON.stringify(transcript)}`
        }]
      }],
      config: { responseMimeType: "application/json" }
    });
    response.json(JSON.parse(result.text));
  } catch (error) {
    console.error("Failed to create the call summary:", error);
    response.status(502).json({ error: "Could not create the call summary." });
  }
});

app.use(express.static(path.join(projectDirectory, "dist")));
app.get("*", (request, response) => {
  response.sendFile(path.join(projectDirectory, "dist", "index.html"));
});

export default app;
