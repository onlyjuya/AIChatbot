import type { ChatMessage } from "./ai/gemini";

const API_KEY_STORAGE_KEY = "gemini_api_key";
const PERSONALITY_STORAGE_KEY = "ai_personality";
const CHAT_MESSAGES_STORAGE_KEY = "chat_messages";

export function getApiKey(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(API_KEY_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setApiKey(value: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(API_KEY_STORAGE_KEY, value);
  } catch {}
}

export function clearApiKey() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
  } catch {}
}

export function getPersonality(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(PERSONALITY_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setPersonality(personalityId: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PERSONALITY_STORAGE_KEY, personalityId);
  } catch {}
}

export function clearPersonality() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(PERSONALITY_STORAGE_KEY);
  } catch {}
}

// 대화 메시지 저장/로드 함수들
export function getChatMessages(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(CHAT_MESSAGES_STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function setChatMessages(messages: ChatMessage[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CHAT_MESSAGES_STORAGE_KEY, JSON.stringify(messages));
  } catch {}
}

export function clearChatMessages() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(CHAT_MESSAGES_STORAGE_KEY);
  } catch {}
}
