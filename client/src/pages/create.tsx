import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { GenreSelector } from "@/components/genre-selector";
import { RhythmSelector } from "@/components/rhythm-selector";
import { VoiceSelector } from "@/components/voice-selector";
import { Loader2, Music, ArrowLeft, Sparkles, Sun, Moon, Zap, Headphones } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Genre, VocalGender, VocalStyle, Rhythm, RHYTHM_OPTIONS } from "@shared/schema";

type PlaylistType = "morning" | "daytime" | "bedtime" | null;

export default function Create() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [mantraText, setMantraText] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [selectedRhythm, setSelectedRhythm] = useState<Rhythm | null>(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistType>(null);
  const [selectedVocalGender, setSelectedVocalGender] = useState<VocalGender | null>(null);
  const [selectedVocalStyle, setSelectedVocalStyle] = useState<VocalStyle | null>(null);
  const [useExactLyrics, setUseExactLyrics] = useState(false);

  // Auto-select first rhythm when genre changes
  const handleGenreChange = (genre: Genre | null) => {
    setSelectedGenre(genre);
    if (genre) {
      // Import RHYTHM_OPTIONS inline to avoid circular dependency
      const { RHYTHM_OPTIONS } = require("@shared/schema");
      const firstRhythm = RHYTHM_OPTIONS[genre][0].value as Rhythm;
      setSelectedRhythm(firstRhythm);
    } else {
      setSelectedRhythm(null);
    }
  };

  const generateSongMutation = useMutation({
    mutationFn: async (data: { 
      text: string; 
      genre: Genre;
      rhythm: Rhythm;
      playlistType?: string;
      vocalGender?: VocalGender;
      vocalStyle?: VocalStyle;
      useExactLyrics?: boolean;
    }) => {
      return await apiRequest("POST", "/api/songs/generate", data);
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/songs"] });
      if (selectedPlaylist) {
        queryClient.invalidateQueries({ queryKey: [`/api/playlists/${selectedPlaylist}/songs`] });
      }
      toast({
        title: "Song Created!",
        description: "Your mantra song has been generated successfully.",
      });
      navigate(`/library`);
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate your mantra song. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGenerate = () => {
    if (!mantraText.trim()) {
      toast({
        title: "Mantra Required",
        description: "Please write your mantra before generating a song.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedGenre) {
      toast({
        title: "Genre Required",
        description: "Please select a music genre for your mantra.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedRhythm) {
      toast({
        title: "Rhythm Required",
        description: "Please select a rhythm for your song.",
        variant: "destructive",
      });
      return;
    }

    generateSongMutation.mutate({
      text: mantraText,
      genre: selectedGenre,
      rhythm: selectedRhythm,
      playlistType: selectedPlaylist || undefined,
      vocalGender: selectedVocalGender || undefined,
      vocalStyle: selectedVocalStyle || undefined,
      useExactLyrics,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="gap-2 h-11 sm:h-auto"
            aria-label="Back to Home"
            data-testid="button-back-home"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Back to Home</span>
          </Button>
          <div className="flex items-center gap-2">
            <Music className="h-6 w-6 text-primary" />
            <span className="text-lg sm:text-xl font-bold font-serif">Mantra Music</span>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate("/library")}
            className="h-11 sm:h-auto"
            aria-label="View Library"
            data-testid="button-view-library"
          >
            <Headphones className="h-5 w-5 sm:mr-2" />
            <span className="hidden sm:inline">View Library</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container max-w-4xl px-4 md:px-6 py-6 sm:py-12">
        <div className="text-center mb-6 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl font-bold font-serif mb-3 sm:mb-4" data-testid="text-page-title">
            Create Your Mantra Song
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground" data-testid="text-page-subtitle">
            Write your goals, affirmations, or daily mantras and transform them into personalized music
          </p>
        </div>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Sparkles className="h-5 w-5 text-primary" />
              Write Your Mantra
            </CardTitle>
            <CardDescription className="text-sm">
              Be authentic and personal. Express what you want to achieve, overcome, or become.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-4 sm:p-6">
            {/* Mantra Input */}
            <div className="space-y-2">
              <label htmlFor="mantra" className="text-sm font-medium">
                Your Mantra
              </label>
              <Textarea
                id="mantra"
                placeholder="I am strong, capable, and ready to embrace new opportunities. Each day brings me closer to my goals..."
                value={mantraText}
                onChange={(e) => setMantraText(e.target.value)}
                className="min-h-[200px] sm:min-h-[200px] resize-none text-base"
                data-testid="textarea-mantra"
              />
              <p className="text-xs text-muted-foreground text-right" data-testid="text-character-count">
                {mantraText.length} characters
              </p>
            </div>

            {/* Genre Selector */}
            <GenreSelector
              value={selectedGenre}
              onChange={handleGenreChange}
            />

            {/* Rhythm Selector - shown after genre selection */}
            {selectedGenre && (
              <RhythmSelector
                genre={selectedGenre}
                selectedRhythm={selectedRhythm}
                onSelectRhythm={setSelectedRhythm}
              />
            )}

            {/* Voice Selection */}
            <VoiceSelector
              selectedGender={selectedVocalGender}
              selectedStyle={selectedVocalStyle}
              onGenderChange={setSelectedVocalGender}
              onStyleChange={setSelectedVocalStyle}
            />

            {/* Exact Lyrics Toggle */}
            <div className="flex items-center justify-between space-x-4 p-4 border rounded-lg">
              <div className="flex-1">
                <label htmlFor="exact-lyrics" className="text-sm font-medium">
                  Use My Exact Words
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  Sing your mantra exactly as written, or let AI transform it into song lyrics
                </p>
              </div>
              <Switch
                id="exact-lyrics"
                checked={useExactLyrics}
                onCheckedChange={setUseExactLyrics}
                data-testid="switch-exact-lyrics"
              />
            </div>

            {/* Playlist Assignment (Optional) */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Add to Playlist (Optional)</label>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <Button
                  type="button"
                  variant={selectedPlaylist === "morning" ? "default" : "outline"}
                  className="h-auto py-4 sm:py-3 flex flex-col items-center gap-2 hover-elevate touch-target"
                  onClick={() => setSelectedPlaylist(selectedPlaylist === "morning" ? null : "morning")}
                  data-testid="button-playlist-morning"
                >
                  <Sun className="h-6 w-6 sm:h-6 sm:w-6" />
                  <span className="text-xs">Morning</span>
                </Button>
                <Button
                  type="button"
                  variant={selectedPlaylist === "daytime" ? "default" : "outline"}
                  className="h-auto py-4 sm:py-3 flex flex-col items-center gap-2 hover-elevate touch-target"
                  onClick={() => setSelectedPlaylist(selectedPlaylist === "daytime" ? null : "daytime")}
                  data-testid="button-playlist-daytime"
                >
                  <Zap className="h-6 w-6 sm:h-6 sm:w-6" />
                  <span className="text-xs">Daytime</span>
                </Button>
                <Button
                  type="button"
                  variant={selectedPlaylist === "bedtime" ? "default" : "outline"}
                  className="h-auto py-4 sm:py-3 flex flex-col items-center gap-2 hover-elevate touch-target"
                  onClick={() => setSelectedPlaylist(selectedPlaylist === "bedtime" ? null : "bedtime")}
                  data-testid="button-playlist-bedtime"
                >
                  <Moon className="h-6 w-6 sm:h-6 sm:w-6" />
                  <span className="text-xs">Bedtime</span>
                </Button>
              </div>
            </div>

            {/* Generate Button */}
            <Button
              size="lg"
              className="w-full"
              onClick={handleGenerate}
              disabled={generateSongMutation.isPending}
              data-testid="button-generate"
            >
              {generateSongMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Your Song...
                </>
              ) : (
                <>
                  <Music className="mr-2 h-5 w-5" />
                  Generate Mantra Song
                </>
              )}
            </Button>

            {generateSongMutation.isPending && (
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground" data-testid="text-generating-status">
                  Creating lyrics and composing your personalized mantra song...
                </p>
                <p className="text-xs text-muted-foreground">
                  This may take 3-6 minutes. AI is composing your unique song with vocals and instruments.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
