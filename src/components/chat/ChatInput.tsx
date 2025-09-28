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
    <div className="sticky bottom-0 z-20 flex items-end gap-2 border-t bg-background/95 backdrop-blur shadow-lg p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="메세지입력"
        className="flex-1"
      />
      {isStreaming ? (
        <Button variant="secondary" size="icon" onClick={onStop} className="shrink-0 h-10 w-10">
          <Square className="h-4 w-4" />
        </Button>
      ) : (
        <Button size="icon" onClick={onSubmit} disabled={disabled} className="shrink-0 h-10 w-10">
          <Send className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}


