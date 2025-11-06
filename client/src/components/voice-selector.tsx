import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User, Mic } from "lucide-react";
import type { VocalGender, VocalStyle } from "@shared/schema";

interface VoiceSelectorProps {
  selectedGender: VocalGender | null;
  selectedStyle: VocalStyle | null;
  onGenderChange: (gender: VocalGender | null) => void;
  onStyleChange: (style: VocalStyle | null) => void;
}

export function VoiceSelector({
  selectedGender,
  selectedStyle,
  onGenderChange,
  onStyleChange,
}: VoiceSelectorProps) {
  const genderOptions: { value: VocalGender; label: string; icon: typeof User }[] = [
    { value: "male", label: "Male Voice", icon: User },
    { value: "female", label: "Female Voice", icon: User },
  ];

  const styleOptions: { value: VocalStyle; label: string; description: string }[] = [
    { value: "warm", label: "Warm", description: "Comforting and gentle" },
    { value: "powerful", label: "Powerful", description: "Strong and commanding" },
    { value: "soft", label: "Soft", description: "Delicate and soothing" },
    { value: "energetic", label: "Energetic", description: "Dynamic and uplifting" },
    { value: "soulful", label: "Soulful", description: "Deep and emotional" },
    { value: "gritty", label: "Gritty", description: "Raw and authentic" },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <label className="text-sm font-medium flex items-center gap-2">
          <Mic className="h-4 w-4" />
          Voice Gender
        </label>
        <div className="grid grid-cols-2 gap-3">
          {genderOptions.map((option) => (
            <Button
              key={option.value}
              type="button"
              variant={selectedGender === option.value ? "default" : "outline"}
              className="h-auto py-3 hover-elevate"
              onClick={() =>
                onGenderChange(selectedGender === option.value ? null : option.value)
              }
              data-testid={`button-voice-gender-${option.value}`}
            >
              <option.icon className="h-4 w-4 mr-2" />
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">Voice Style</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {styleOptions.map((option) => (
            <Button
              key={option.value}
              type="button"
              variant={selectedStyle === option.value ? "default" : "outline"}
              className="h-auto py-3 flex flex-col items-start gap-1 hover-elevate"
              onClick={() =>
                onStyleChange(selectedStyle === option.value ? null : option.value)
              }
              data-testid={`button-voice-style-${option.value}`}
            >
              <span className="font-medium text-sm">{option.label}</span>
              <span className="text-xs text-muted-foreground">{option.description}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
