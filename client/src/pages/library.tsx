import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { SongCard } from "@/components/song-card";
import { AudioPlayer } from "@/components/audio-player";
import { Music, ArrowLeft, Plus, Loader2, PlayCircle } from "lucide-react";
import type { Song } from "@shared/schema";

export default function Library() {
  const [, navigate] = useLocation();
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [playAllMode, setPlayAllMode] = useState(false);
  const [wrapCounter, setWrapCounter] = useState(0); // Force re-render on single-song wrap

  const { data: songs, isLoading } = useQuery<Song[]>({
    queryKey: ["/api/songs"],
  });

  const handlePlaySong = (song: Song) => {
    setSelectedSong(song);
    setPlayAllMode(false); // Disable play all mode when manually selecting a song
  };

  // Filter to only include ready songs (completed with audio)
  const readySongs = songs?.filter(s => s.status === 'completed' && s.audioUrl) || [];

  const handlePlayAll = () => {
    // Use the same readySongs filter for consistency
    if (readySongs.length > 0) {
      setSelectedSong(readySongs[0]);
      setPlayAllMode(true); // Enable play all mode (library loop)
    }
  };

  const handleNext = () => {
    if (!selectedSong || !readySongs.length) return;
    const currentIndex = readySongs.findIndex(s => s.id === selectedSong.id);
    if (currentIndex >= 0) {
      if (currentIndex < readySongs.length - 1) {
        // Go to next song
        setSelectedSong(readySongs[currentIndex + 1]);
      } else {
        // Wrap around to first song for library loop
        setSelectedSong(readySongs[0]);
        // Force re-render for single-song case (same object reference)
        setWrapCounter(prev => prev + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (!selectedSong || !readySongs.length) return;
    const currentIndex = readySongs.findIndex(s => s.id === selectedSong.id);
    if (currentIndex >= 0) {
      if (currentIndex > 0) {
        // Go to previous song
        setSelectedSong(readySongs[currentIndex - 1]);
      } else {
        // Wrap around to last song for library loop
        setSelectedSong(readySongs[readySongs.length - 1]);
        // Force re-render for single-song case (same object reference)
        setWrapCounter(prev => prev + 1);
      }
    }
  };

  const handleLoopModeChange = (mode: 'off' | 'song' | 'library') => {
    // Sync playAllMode with loop mode changes from AudioPlayer
    setPlayAllMode(mode === 'library');
  };

  const currentIndex = selectedSong && readySongs ? readySongs.findIndex(s => s.id === selectedSong.id) : -1;
  
  // In play all mode (library loop), always allow next/previous if there are ready songs
  // Otherwise, only allow if there's actually a next/previous song in the linear list
  const hasNext = playAllMode 
    ? readySongs.length > 1 
    : currentIndex >= 0 && currentIndex < readySongs.length - 1;
  const hasPrevious = playAllMode 
    ? readySongs.length > 1 
    : currentIndex > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="gap-2"
            data-testid="button-back-home"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          <div className="flex items-center gap-2">
            <Music className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold font-serif">Mantra Music</span>
          </div>
          <Button
            onClick={() => navigate("/create")}
            data-testid="button-create-new"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container max-w-6xl px-4 md:px-6 py-12">
        <div className="mb-12">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-4xl font-bold font-serif mb-2" data-testid="text-page-title">
                Your Mantra Library
              </h1>
              <p className="text-lg text-muted-foreground" data-testid="text-page-subtitle">
                All your personalized mantra songs in one place
              </p>
            </div>
            {songs && songs.length > 0 && (
              <Button
                onClick={handlePlayAll}
                size="lg"
                className="gap-2"
                data-testid="button-play-all"
              >
                <PlayCircle className="h-5 w-5" />
                Play All
              </Button>
            )}
          </div>
        </div>

        {/* Current Player */}
        {selectedSong && (
          <div className="mb-8" key={`${selectedSong.id}-${wrapCounter}`}>
            <AudioPlayer
              song={selectedSong}
              onNext={handleNext}
              onPrevious={handlePrevious}
              hasNext={hasNext}
              hasPrevious={hasPrevious}
              initialLoopMode={playAllMode ? 'library' : 'off'}
              onLoopModeChange={handleLoopModeChange}
            />
          </div>
        )}

        {/* Songs List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" data-testid="loader-songs" />
            </div>
          ) : songs && songs.length > 0 ? (
            songs.map((song) => (
              <SongCard
                key={song.id}
                song={song}
                onPlay={handlePlaySong}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <Music className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2" data-testid="text-empty-title">
                No Songs Yet
              </h3>
              <p className="text-muted-foreground mb-6" data-testid="text-empty-description">
                Create your first mantra song to start building your library
              </p>
              <Button onClick={() => navigate("/create")} data-testid="button-create-first">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Song
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
