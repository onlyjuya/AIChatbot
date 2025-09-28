"use client";

import { useCallback } from "react";
import { Input } from "@/components/ui/input";
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
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        onSubmit();
      }
    },
    [onSubmit]
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex items-end gap-3 border-t bg-background/95 backdrop-blur shadow-lg p-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto flex w-full max-w-[760px] items-center gap-3">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="메세지입력"
          className="flex-1 h-12 text-base"
        />
        {isStreaming ? (
          <Button variant="secondary" size="icon" onClick={onStop} className="shrink-0 h-12 w-12">
            <Square className="h-5 w-5" />
          </Button>
        ) : (
          <Button size="icon" onClick={onSubmit} disabled={disabled} className="shrink-0 h-12 w-12">
            <Send className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
}


