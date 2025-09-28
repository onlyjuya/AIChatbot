"use client";

import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { setApiKey, getApiKey, clearApiKey } from "@/lib/storage";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApiKeySheet({ open, onOpenChange }: Props) {
  const [value, setValue] = useState("");

  useEffect(() => {
    const current = getApiKey();
    setValue(current ?? "");
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="space-y-4">
        <SheetHeader>
          <SheetTitle>Google Gemini API 키 설정</SheetTitle>
        </SheetHeader>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            1) Google AI Studio에서 API 키를 발급받으세요.
            (<a className="underline" href="https://ai.google.dev/" target="_blank" rel="noreferrer">공식 안내</a>)
          </p>
          <p>2) 아래 입력창에 키를 붙여넣고 저장을 누르면 활성화됩니다.</p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="AIza... 형식의 API 키"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button
            onClick={() => {
              const trimmed = value.trim();
              if (!trimmed) {
                toast.error("API 키를 입력해주세요");
                return;
              }
              if (!trimmed.startsWith("AIza")) {
                toast.error("올바른 Google API 키 형식이 아닙니다 (AIza...로 시작해야 함)");
                return;
              }
              setApiKey(trimmed);
              toast.success("API 키가 저장되었습니다");
              onOpenChange(false);
            }}
          >
            저장
          </Button>
          <Button variant="secondary" onClick={() => { 
            clearApiKey(); 
            setValue(""); 
            toast.success("API 키가 삭제되었습니다");
          }}>삭제</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}


