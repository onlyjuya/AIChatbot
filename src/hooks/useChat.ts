"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getApiKey, getPersonality, setPersonality, getChatMessages, setChatMessages, clearChatMessages } from "@/lib/storage";
import { ChatMessage, streamGemini } from "@/lib/ai/gemini";
import { getAllPersonalities, getPersonality as getPersonalityConfig } from "@/lib/ai/personalities";
import toast from "react-hot-toast";

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [modelName, setModelName] = useState("gemini-2.5-flash");
  const [apiKey, setApiKeyState] = useState<string | null>(null);
  const [personalityId, setPersonalityId] = useState<string>("friendly");
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);
  const scrollThrottleRef = useRef<NodeJS.Timeout | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  // API 키 상태를 주기적으로 확인하여 업데이트
  useEffect(() => {
    const checkApiKey = () => {
      const currentKey = getApiKey();
      if (currentKey !== apiKey) {
        setApiKeyState(currentKey);
      }
    };
    
    checkApiKey(); // 초기 확인
    const interval = setInterval(checkApiKey, 500); // 500ms마다 확인
    
    return () => clearInterval(interval);
  }, [apiKey]);

  // 성격 설정 초기화
  useEffect(() => {
    const savedPersonality = getPersonality();
    if (savedPersonality) {
      setPersonalityId(savedPersonality);
    }
  }, []);

  // 저장된 대화 로드
  useEffect(() => {
    const savedMessages = getChatMessages();
    if (savedMessages.length > 0) {
      setMessages(savedMessages);
    }
  }, []);

  // 메시지가 변경될 때마다 자동 저장
  useEffect(() => {
    if (messages.length > 0) {
      setChatMessages(messages);
    }
  }, [messages]);

  const canSend = useMemo(
    () => !!apiKey && input.trim().length > 0 && !isStreaming,
    [apiKey, input, isStreaming]
  );

  const sendMessage = useCallback(async () => {
    if (!apiKey) {
      toast.error("API 키를 먼저 설정해주세요");
      return;
    }
    const text = input.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };
    const modelMsgId = crypto.randomUUID();
    let isFirstToken = true;

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      await streamGemini({
        apiKey,
        modelName,
        messages: [...messages, userMsg],
        personalityId,
        signal: controller.signal,
        onToken: (t) => {
          // 첫 번째 토큰이 도착할 때만 AI 메시지 버블 생성하고 TypingIndicator 숨김
          if (isFirstToken) {
            const modelMsg: ChatMessage = { id: modelMsgId, role: "model", content: t };
            setMessages((prev) => [...prev, modelMsg]);
            setIsStreaming(false); // TypingIndicator 숨김
            isFirstToken = false;
          } else {
            setMessages((prev) =>
              prev.map((m) => (m.id === modelMsgId ? { ...m, content: m.content + t } : m))
            );
          }
          
          // 스크롤 신호를 throttling으로 제어 (너무 자주 호출되지 않도록)
          if (scrollThrottleRef.current) {
            clearTimeout(scrollThrottleRef.current);
          }
          scrollThrottleRef.current = setTimeout(() => {
            setShouldScrollToBottom(true);
          }, 50); // 50ms마다 최대 한 번
        },
        onEnd: () => setIsStreaming(false),
        onError: (error) => {
          setIsStreaming(false);
          toast.error("AI 응답 생성 중 오류가 발생했습니다");
          console.error("Gemini API error:", error);
        },
      });
    } catch {
      // already handled
    } finally {
      abortRef.current = null;
      setIsStreaming(false);
    }
  }, [apiKey, input, messages, modelName, personalityId]);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setIsStreaming(false);
    clearChatMessages(); // 로컬 스토리지에서도 대화 삭제
    toast.success("대화가 초기화되었습니다");
  }, []);

  const handlePersonalityChange = useCallback((newPersonalityId: string) => {
    // 성격이 실제로 변경된 경우에만 초기화
    if (newPersonalityId !== personalityId) {
      setPersonalityId(newPersonalityId);
      setPersonality(newPersonalityId);
      // 기존 대화 초기화 (새로운 성격이 제대로 반영되도록)
      setMessages([]);
      setIsStreaming(false);
      clearChatMessages(); // 로컬 스토리지에서도 대화 삭제
      // 진행 중인 요청이 있다면 중단
      abortRef.current?.abort();
      abortRef.current = null;
      
      const personalityName = getPersonalityConfig(newPersonalityId).name;
      toast.success(`${personalityName}로 변경되었습니다. 대화가 초기화되었습니다.`);
    }
  }, [personalityId]);

  const currentPersonality = getPersonalityConfig(personalityId);
  const availablePersonalities = getAllPersonalities();

  return {
    messages,
    input,
    setInput,
    isStreaming,
    apiKey,
    modelName,
    setModelName,
    personalityId,
    setPersonalityId: handlePersonalityChange,
    currentPersonality,
    availablePersonalities,
    canSend,
    sendMessage,
    stop,
    reset,
    shouldScrollToBottom,
    setShouldScrollToBottom,
  };
}


