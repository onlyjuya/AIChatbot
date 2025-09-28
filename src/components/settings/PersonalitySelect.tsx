"use client";

import { useCallback } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { setPersonality } from "@/lib/storage";
import type { Personality } from "@/lib/ai/personalities";

interface Props {
  value: string;
  onChange: (personalityId: string) => void;
  personalities: Personality[];
  disabled?: boolean;
}

export function PersonalitySelect({ value, onChange, personalities, disabled }: Props) {
  const handleValueChange = useCallback((personalityId: string) => {
    setPersonality(personalityId);
    onChange(personalityId);
  }, [onChange]);

  return (
    <Select value={value} onValueChange={handleValueChange} disabled={disabled}>
      <SelectTrigger className="w-[120px] h-10 text-sm">
        <SelectValue placeholder="성격 선택" />
      </SelectTrigger>
      <SelectContent>
        {personalities.map((personality) => (
          <SelectItem key={personality.id} value={personality.id}>
            <div className="flex items-center gap-2">
              <span>{personality.icon}</span>
              <span className="text-sm">{personality.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
