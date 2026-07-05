import { GoogleGenAI, GenerateVideosOperation } from "@google/genai";
let aiClient = null;
function getAiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing. Please configure it in your Settings > Secrets panel.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiClient;
}
async function getRequestBody(req) {
  if (req.body !== void 0) {
    return req.body;
  }
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
  });
}
async function handleApiRequest(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }
  const url = req.url || "";
  const parsedUrl = new URL(url, "http://localhost");
  const path = parsedUrl.pathname;
  try {
    const ai = getAiClient();
    if (path === "/chat" || path === "/api/chat") {
      if (req.method !== "POST") {
        res.statusCode = 450;
        res.end(JSON.stringify({ error: "Method not allowed" }));
        return;
      }
      const body = await getRequestBody(req);
      const { message, history, systemInstruction, temperature, useThinking, useGrounding } = body;
      if (!message) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Missing message parameter" }));
        return;
      }
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      const formattedHistory = (history || []).map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }]
      }));
      let responseStream;
      let activeModel = useThinking ? "gemini-3.1-pro-preview" : "gemini-3.5-flash";
      
      const config = {
        systemInstruction: systemInstruction || "You are a helpful creative assistant.",
        temperature: typeof temperature === "number" ? temperature : 1
      };
      
      if (useThinking) {
        config.thinkingConfig = { thinkingLevel: "HIGH" };
      }
      if (useGrounding) {
        config.tools = [{ googleSearch: {} }, { googleMaps: {} }];
      }

      try {
        const chat = ai.chats.create({
          model: activeModel,
          config,
          history: formattedHistory
        });
        responseStream = await chat.sendMessageStream({ message });
      } catch (firstErr) {
        const isOverloaded = firstErr.message?.includes("503") || firstErr.message?.includes("UNAVAILABLE") || firstErr.message?.includes("demand") || firstErr.message?.includes("overloaded");
        if (isOverloaded) {
          console.log(`[API Server] ${activeModel} unavailable (503). Falling back to gemini-2.5-flash.`);
          try {
            activeModel = "gemini-2.5-flash";
            const chat = ai.chats.create({
              model: activeModel,
              config: {
                systemInstruction: systemInstruction || "You are a helpful creative assistant.",
                temperature: typeof temperature === "number" ? temperature : 1
              },
              history: formattedHistory
            });
            responseStream = await chat.sendMessageStream({ message });
          } catch (secondErr) {
            console.log(`[API Server] gemini-2.5-flash also unavailable (503). Falling back to gemini-1.5-flash.`);
            activeModel = "gemini-1.5-flash";
            const chat = ai.chats.create({
              model: activeModel,
              config: {
                systemInstruction: systemInstruction || "You are a helpful creative assistant.",
                temperature: typeof temperature === "number" ? temperature : 1
              },
              history: formattedHistory
            });
            responseStream = await chat.sendMessageStream({ message });
          }
        } else {
          throw firstErr;
        }
      }
      for await (const chunk of responseStream) {
        const text = chunk.text || "";
        res.write(`data: ${JSON.stringify({ text })}

`);
      }
      res.write("data: [DONE]\n\n");
      res.end();
      return;
    }
    if (path === "/generate" || path === "/api/generate") {
      if (req.method !== "POST") {
        res.statusCode = 405;
        res.end(JSON.stringify({ error: "Method not allowed" }));
        return;
      }
      const body = await getRequestBody(req);
      const { prompt, systemInstruction, temperature, imageBase64, imageMimeType } = body;
      if (!prompt) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Missing prompt parameter" }));
        return;
      }
      let contents;
      if (imageBase64 && imageMimeType) {
        const imagePart = {
          inlineData: {
            mimeType: imageMimeType,
            data: imageBase64
          }
        };
        const textPart = { text: prompt };
        contents = { parts: [imagePart, textPart] };
      } else {
        contents = prompt;
      }
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      let responseStream;
      let activeModel = "gemini-3.5-flash";
      try {
        responseStream = await ai.models.generateContentStream({
          model: activeModel,
          contents,
          config: {
            systemInstruction: systemInstruction || "You are an expert content creator.",
            temperature: typeof temperature === "number" ? temperature : 0.7
          }
        });
      } catch (firstErr) {
        const isOverloaded = firstErr.message?.includes("503") || firstErr.message?.includes("UNAVAILABLE") || firstErr.message?.includes("demand") || firstErr.message?.includes("overloaded");
        if (isOverloaded) {
          console.log(`[API Server] ${activeModel} unavailable (503). Falling back to gemini-2.5-flash.`);
          try {
            activeModel = "gemini-2.5-flash";
            responseStream = await ai.models.generateContentStream({
              model: activeModel,
              contents,
              config: {
                systemInstruction: systemInstruction || "You are an expert content creator.",
                temperature: typeof temperature === "number" ? temperature : 0.7
              }
            });
          } catch (secondErr) {
            console.log(`[API Server] gemini-2.5-flash also unavailable (503). Falling back to gemini-1.5-flash.`);
            activeModel = "gemini-1.5-flash";
            responseStream = await ai.models.generateContentStream({
              model: activeModel,
              contents,
              config: {
                systemInstruction: systemInstruction || "You are an expert content creator.",
                temperature: typeof temperature === "number" ? temperature : 0.7
              }
            });
          }
        } else {
          throw firstErr;
        }
      }
      for await (const chunk of responseStream) {
        const text = chunk.text || "";
        res.write(`data: ${JSON.stringify({ text })}

`);
      }
      res.write("data: [DONE]\n\n");
      res.end();
      return;
    }
    if (path === "/generate-image" || path === "/api/generate-image") {
      if (req.method !== "POST") {
        res.statusCode = 405;
        res.end(JSON.stringify({ error: "Method not allowed" }));
        return;
      }
      const body = await getRequestBody(req);
      const { prompt, aspectRatio, quality } = body;
      
      if (!prompt) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Prompt is required" }));
        return;
      }

      const activeModel = quality === "standard" ? "gemini-3.1-flash-image" : "gemini-3-pro-image";
      const ai = getAiClient();
      const response = await ai.models.generateContent({
        model: activeModel,
        contents: {
          parts: [{ text: prompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio || "1:1",
            imageSize: "1K"
          }
        }
      });

      let imageUrl = null;
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          const mimeType = part.inlineData.mimeType || 'image/jpeg';
          imageUrl = `data:${mimeType};base64,${base64EncodeString}`;
          break;
        }
      }

      if (!imageUrl) {
        throw new Error("No image generated.");
      }

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ imageUrl }));
      return;
    }

    if (path === "/generate-video" || path === "/api/generate-video") {
      if (req.method !== "POST") {
        res.statusCode = 405;
        res.end(JSON.stringify({ error: "Method not allowed" }));
        return;
      }
      const body = await getRequestBody(req);
      const { prompt, imageBase64, imageMimeType, aspectRatio, resolution } = body;
      
      const ai = getAiClient();
      const model = 'veo-3.1-fast-generate-preview';
      const config = {
        numberOfVideos: 1,
        resolution: resolution || '720p',
        aspectRatio: aspectRatio || '16:9'
      };
      
      const params = { model, config };
      if (prompt) {
        params.prompt = prompt;
      }
      if (imageBase64 && imageMimeType) {
        const pureBase64 = imageBase64.includes(",") ? imageBase64.split(",")[1] : imageBase64;
        params.image = {
          imageBytes: pureBase64,
          mimeType: imageMimeType
        };
      }
      
      const operation = await ai.models.generateVideos(params);
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ operationName: operation.name }));
      return;
    }

    if (path === "/video-status" || path === "/api/video-status") {
      if (req.method !== "POST") {
        res.statusCode = 405;
        res.end(JSON.stringify({ error: "Method not allowed" }));
        return;
      }
      const body = await getRequestBody(req);
      const { operationName } = body;
      if (!operationName) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "operationName is required" }));
        return;
      }
      
      const ai = getAiClient();
      const op = new GenerateVideosOperation();
      op.name = operationName;
      
      const updated = await ai.operations.getVideosOperation({ operation: op });
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ done: updated.done, error: updated.error || null }));
      return;
    }

    if (path === "/video-download" || path === "/api/video-download") {
      if (req.method !== "POST") {
        res.statusCode = 405;
        res.end(JSON.stringify({ error: "Method not allowed" }));
        return;
      }
      const body = await getRequestBody(req);
      const { operationName } = body;
      if (!operationName) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "operationName is required" }));
        return;
      }
      
      const ai = getAiClient();
      const op = new GenerateVideosOperation();
      op.name = operationName;
      
      const updated = await ai.operations.getVideosOperation({ operation: op });
      if (!updated.done) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Video generation is still processing" }));
        return;
      }
      
      const uri = updated.response?.generatedVideos?.[0]?.video?.uri;
      if (!uri) {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: "Generated video URI not found" }));
        return;
      }
      
      const videoRes = await fetch(uri, {
        headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY || '' }
      });
      
      const arrayBuffer = await videoRes.arrayBuffer();
      const base64Video = Buffer.from(arrayBuffer).toString("base64");
      const videoUrl = `data:video/mp4;base64,${base64Video}`;
      
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ videoUrl }));
      return;
    }

    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "API route not found" }));
  } catch (error) {
    console.error("API error:", error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({
      error: error.message || "An unexpected server-side error occurred."
    }));
  }
}
export {
  handleApiRequest
};
