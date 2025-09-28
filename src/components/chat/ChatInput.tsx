"use client";

import { useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Square, Loader2 } from "lucide-react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onStop: () => void;
  disabled?: boolean;
  isStreaming?: boolean;
}

export function ChatInput({ value, onChange, onSubmit, onStop, disabled, isStreaming }: Props) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSubmit();
      }
    },
    [onSubmit]
  );

  return (
    <div className="sticky bottom-0 z-20 flex items-end gap-2 border-t bg-background/95 backdrop-blur shadow-lg p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="메시지를 입력하세요 (Enter: 전송, Shift+Enter: 줄바꿈)"
        className="min-h-10 max-h-40 flex-1 resize-y"
      />
      {isStreaming ? (
        <Button variant="secondary" onClick={onStop} className="shrink-0">
          <Square className="mr-1 h-4 w-4" /> 중지
        </Button>
      ) : (
        <Button onClick={onSubmit} disabled={disabled} className="shrink-0">
          <Send className="mr-1 h-4 w-4" />
          전송
        </Button>
      )}
    </div>
  );
}


