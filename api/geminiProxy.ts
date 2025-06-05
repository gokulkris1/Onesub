// This file (api/geminiProxy.ts) is now a generic Node.js style HTTP handler example.
// For production, this proxy logic should ideally be implemented as a Firebase Function.
// See README-Firebase.md for Firebase setup.

import { GoogleGenAI, GenerateContentResponse, HarmCategory, HarmBlockThreshold, Content } from "@google/genai";
import http from 'http'; // Using Node.js standard http module types for request/response

// IMPORTANT: Store your API_KEY as an Environment Variable.
const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  console.error("API_KEY environment variable is not set. The API proxy will not function.");
}

// This is a simplified handler. A robust Node.js server would handle body parsing, routing, etc.
// This example assumes a simple HTTP server or a context where 'request' and 'response' are similar to Node's.
export default async function handler(
  request: http.IncomingMessage, // Generic Node.js IncomingMessage
  response: http.ServerResponse, // Generic Node.js ServerResponse
) {
  if (!ai) {
    response.writeHead(500, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({
      error: {
        message: "Gemini API client is not initialized. Check server logs for API key configuration issues.",
        code: "API_CLIENT_NOT_INITIALIZED"
      }
    }));
    return;
  }

  if (request.method !== 'POST') {
    response.writeHead(405, { 'Allow': 'POST', 'Content-Type': 'application/json' });
    response.end(JSON.stringify({
      error: {
        message: `Method ${request.method} Not Allowed. Please use POST.`,
        code: "METHOD_NOT_ALLOWED"
      }
    }));
    return;
  }

  let body = '';
  request.on('data', chunk => {
    body += chunk.toString(); // convert Buffer to string
  });

  request.on('end', async () => {
    try {
      const requestBody = JSON.parse(body);
      const {
        prompt,
        contents,
        model = 'gemini-2.5-flash-preview-04-17',
        config
      } = requestBody;

      let finalContents: string | Content | undefined;

      if (contents) {
        finalContents = contents;
      } else if (prompt && typeof prompt === 'string') {
        finalContents = prompt;
      } else {
        response.writeHead(400, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({
          error: {
            message: "Missing 'prompt' (string for simple text) or 'contents' (valid Gemini content structure for complex requests) in the request body.",
            code: "BAD_REQUEST_MISSING_PROMPT_OR_CONTENTS"
          }
        }));
        return;
      }
      
      if (!finalContents) {
        response.writeHead(400, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({
          error: {
            message: "Invalid request: 'prompt' or 'contents' must be provided to form valid Gemini API contents.",
            code: "BAD_REQUEST_INVALID_CONTENTS"
          }
        }));
        return;
      }

      const generationRequest = {
        model: model,
        contents: finalContents,
        ...(config && { config: config }),
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        ],
      };

      const result: GenerateContentResponse = await ai.models.generateContent(generationRequest);
      
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ text: result.text }));

    } catch (error: any) {
      console.error('Error calling Gemini API via proxy:', error);
      let statusCode = 500;
      let errorCode = "INTERNAL_SERVER_ERROR";
      let message = "An unexpected error occurred while processing your request.";

      if (error.message && error.message.includes("API key not valid")) {
          statusCode = 401;
          errorCode = "INVALID_API_KEY";
          message = "The configured API key is invalid. Please check server configuration.";
      } else if (error.status) {
          statusCode = error.status;
          message = error.message || message;
      } else if (error.message && error.message.toLowerCase().includes("quota")) {
          statusCode = 429;
          errorCode = "QUOTA_EXCEEDED";
          message = "API quota exceeded. Please check your Gemini API plan and usage.";
      } else if (error.name === 'GoogleGenerativeAIError') {
          message = error.message;
      }

      response.writeHead(statusCode, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({
        error: {
          message: message,
          code: errorCode,
          details: error.message 
        }
      }));
    }
  });
}