import { GoogleGenerativeAI } from "@google/generative-ai";
import { getPersonality } from "./personalities";

export type ChatRole = "user" | "model";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
}

function mapMessagesToContents(messages: ChatMessage[]) {
  return messages.map((m) => ({
    role: m.role,
    parts: [{ text: m.content }],
  }));
}

export interface StreamOptions {
  apiKey: string;
  modelName?: string;
  messages: ChatMessage[];
  personalityId?: string;
  onToken?: (token: string) => void;
  onEnd?: (fullText: string) => void;
  onError?: (error: unknown) => void;
  signal?: AbortSignal;
}

export async function streamGemini(options: StreamOptions): Promise<string> {
  const {
    apiKey,
    modelName = "gemini-2.5-flash",
    messages,
    personalityId,
    onToken,
    onEnd,
    onError,
    signal,
  } = options;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName });

    // 시스템 프롬프트를 첫 번째 메시지로 추가
    const systemPrompt = getPersonality(personalityId || "friendly").systemPrompt;
    const systemMessage = {
      role: "user" as const,
      parts: [{ text: systemPrompt }],
    };

    const contents = [systemMessage, ...mapMessagesToContents(messages)];

    const result = await model.generateContentStream({
      contents,
    });

    let full = "";
    for await (const chunk of result.stream) {
      if (signal?.aborted) break;
      const t = chunk.text();
      if (t) {
        full += t;
        onToken?.(t);
      }
    }
    const response = await result.response;
    const finalText = response.text() || full;
    if (!signal?.aborted) onEnd?.(finalText);
    return finalText;
  } catch (err) {
    onError?.(err);
    throw err;
  }
}


