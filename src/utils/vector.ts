import { GoogleGenAI } from '@google/genai';
import { AppDataSource } from "@database/data-source";
// import { LlmKnowledgeBase, KnowledgeType, KnowledgeSource } from "@database/entity/LlmKnowledgeBase";
import pgvector from 'pgvector';
import axios from "axios";
import crypto from "crypto";

// const KnowledgeBaseRepository = AppDataSource.getRepository(LlmKnowledgeBase);

// Initialize Google GenAI client
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY'
});

export const embedText = async (text: string) => {
    try {
        const response = await ai.models.embedContent({
            model: 'gemini-embedding-exp-03-07',
            contents: text,
            config: {
                taskType: "SEMANTIC_SIMILARITY",
            }
        });
    
        if (!response.embeddings || response.embeddings.length === 0) {
            throw new Error('No embeddings generated');
        }
    
        return response.embeddings[0].values;
    } catch (error) {
        throw new Error(error);
    }
}

// export const addRagData = async(ragData: {
//     source: KnowledgeSource;
//     text: string;
//     type: KnowledgeType;
//     user_id: number
// }) => {
//     const embedding = await embedText(ragData.text);

//     const ragMemory = new LlmKnowledgeBase();
//     ragMemory.user_id = ragData.user_id;
//     ragMemory.text = ragData.text;
//     ragMemory.embedding = pgvector.toSql(embedding);
//     ragMemory.type = ragData.type;
//     ragMemory.source = ragData.source;

//     const saved = await KnowledgeBaseRepository.save(ragMemory);
//     return {
//         saved
//     };
// }
  
export const chunkText = async(text: string, maxLength = 1000, overlap = 200): Promise<string[]>=> {
    const chunks: string[] = [];
    let current = 0;
  
    while (current < text.length) {
      const end = Math.min(current + maxLength, text.length);
      const chunk = text.slice(current, end);
      chunks.push(chunk);
      current += maxLength - overlap; // slide forward with overlap
    }
  
    return chunks;
}

const JINA_URL = "https://api.jina.ai/v1/embeddings";

export const embedTextJina = async (text: string) => {
  try {
    const response = await axios.post(
      JINA_URL,
      {
        model: "jina-embeddings-v3",
        task: "text-matching", // semantic similarity use case
        input: [text],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.JINA_API_KEY}`,
        },
      }
    );

    const data = response.data;

    if (!data.data || data.data.length === 0) {
      throw new Error("No embeddings returned from Jina");
    }

    return data.data[0].embedding; // embedding is a float array
  } catch (error: any) {
    throw new Error(`embedText2 failed: ${error.message}`);
  }
};

// Lightweight HTML -> text extraction for simple static pages (no headless browser)
type ExtractResult = {
  url: string;
  title: string;
  text: string;
};

function stripHtmlToText(html: string): { title: string; text: string } {
  // Remove script/style blocks
  let cleaned = html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "");
  // Extract <title>
  const titleMatch = cleaned.match(/<title>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : "";
  // Basic body extraction
  const bodyMatch = cleaned.match(/<body[\s\S]*?>([\s\S]*?)<\/body>/i);
  const bodyHtml = (bodyMatch ? bodyMatch[1] : cleaned)
    // Remove all tags
    .replace(/<[^>]+>/g, "\n")
    // Decode a few common entities
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  // Collapse whitespace
  const text = bodyHtml
    .replace(/\n\s*\n+/g, "\n\n")
    .replace(/[\t ]+/g, " ")
    .trim();
  return { title, text };
}

export const extractPageText = async (url: string): Promise<ExtractResult> => {
  const response = await axios.get<string>(url, {
    responseType: "text",
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; KBIngest/1.0)",
      Accept: "text/html,application/xhtml+xml",
    },
    // follow redirects by default
    maxRedirects: 3,
    timeout: 30000,
  });

  const html = response.data || "";
  const { title, text } = stripHtmlToText(html);
  const combined = `${title ? title + "\n\n" : ""}${text}`.trim();

  if (!combined || combined.length < 150) {
    throw new Error("Could not extract meaningful content from page");
  }

  return { url, title, text: combined };
};

// export const ingestUrlToKnowledgeBase = async (args: {
//   userId: number;
//   url: string;
//   type: KnowledgeType; // use existing enum (e.g., "pdf_text" for documents, or "manual_input")
//   source?: KnowledgeSource; // limited to existing enum: "inbox" | "manual_upload" | "system"
//   chunkSize?: number;
//   overlap?: number;
// }) => {
//   const { userId, url, type, source = "system", chunkSize = 2000, overlap = 400 } = args;

//   const extracted = await extractPageText(url);
//   console.log("extracted :>>", extracted);
//   const chunks = await chunkText(extracted.text, chunkSize, overlap);
//   console.log("chunks :>>", chunks);

//   const savedRecords: LlmKnowledgeBase[] = [];


//   for (const chunk of chunks) {
//     const embedding = await embedText(chunk);
//     const record = new LlmKnowledgeBase();
//     record.user_id = userId;
//     record.text = chunk;
//     record.embedding = pgvector.toSql(embedding);
//     record.type = type;
//     record.source = source;
//     // If later you add a dedicated column to store source_id/hash, set it here.
//     // (record as any).source_id = contentHash;
//     const saved = await KnowledgeBaseRepository.save(record);
//     savedRecords.push(saved);
//   }

//   return {
//     url: extracted.url,
//     title: extracted.title,
//     count: savedRecords.length
//   };
// };

