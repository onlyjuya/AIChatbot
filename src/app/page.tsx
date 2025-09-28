"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@/hooks/useChat";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { ChatInput } from "@/components/chat/ChatInput";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { Button } from "@/components/ui/button";
import { ApiKeySheet } from "@/components/settings/ApiKeySheet";
import { PersonalitySelect } from "@/components/settings/PersonalitySelect";
import { getApiKey } from "@/lib/storage";
import { Sparkles, KeyRound, RotateCcw } from "lucide-react";
import toast from "react-hot-toast";

export default function Page() {
  const { 
    messages, 
    input, 
    setInput, 
    isStreaming, 
    apiKey, 
    canSend, 
    sendMessage, 
    stop, 
    reset,
    personalityId,
    setPersonalityId,
    availablePersonalities,
    shouldScrollToBottom,
    setShouldScrollToBottom
  } = useChat();
  const [openSheet, setOpenSheet] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!apiKey) {
      setOpenSheet(true);
      toast("API 키를 설정해주세요", {
        icon: "🔑",
        duration: 4000,
      });
    }
  }, [apiKey]);

  // 메시지가 변경되거나 스크롤 신호가 올 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current;
      
      // DOM 업데이트를 기다린 후 스크롤 실행
      const scrollToBottom = () => {
        // 스트리밍 중에는 즉시 스크롤, 그 외에는 부드럽게
        if (isStreaming) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        } else {
          scrollContainer.scrollTo({
            top: scrollContainer.scrollHeight,
            behavior: 'smooth'
          });
        }
      };
      
      // requestAnimationFrame을 사용해서 DOM 업데이트 후 스크롤
      requestAnimationFrame(() => {
        scrollToBottom();
        
        // 추가로 setTimeout을 사용해서 확실히 스크롤
        setTimeout(() => {
          scrollToBottom();
        }, 10);
      });

      // 스크롤 신호가 있었다면 리셋
      if (shouldScrollToBottom) {
        setShouldScrollToBottom(false);
      }
    }
  }, [messages, isStreaming, shouldScrollToBottom, setShouldScrollToBottom]);

  return (
    <main className="mx-auto flex min-h-svh w-[760px] max-w-full flex-col bg-background h-svh overflow-hidden">
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex items-center justify-between px-4 py-3 min-h-[56px] w-[760px] max-w-full">
          <div className="flex items-center gap-2 text-base font-medium">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-primary">AI 챗봇</span>
          </div>
          <div className="flex items-center gap-2">
            <PersonalitySelect
              value={personalityId}
              onChange={setPersonalityId}
              personalities={availablePersonalities}
              disabled={isStreaming}
            />
            <Button variant="ghost" size="icon" onClick={() => setOpenSheet(true)} className="h-10 w-10">
              <KeyRound className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={reset} disabled={isStreaming} className="h-10 w-10">
              <RotateCcw className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      <div ref={scrollAreaRef} className="flex-1 overflow-auto px-3 pt-[72px] pb-20">
        <div className="mx-auto flex w-full flex-col gap-2">
          {messages.length === 0 && (
            <div className="mt-10 rounded-xl border p-4 text-center text-sm text-muted-foreground">
              {apiKey ? "메시지를 입력해 대화를 시작하세요." : "API 키를 설정하고 메시지를 입력해 대화를 시작하세요."}
            </div>
          )}
          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))}
          {isStreaming && <TypingIndicator />}
        </div>
      </div>
      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={sendMessage}
        onStop={stop}
        disabled={!canSend}
        isStreaming={isStreaming}
      />
      <ApiKeySheet open={openSheet} onOpenChange={setOpenSheet} />
    </main>
  );
}
