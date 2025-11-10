import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, SkipBack, SkipForward, Volume2, Music2, X, Download, Share2, FileAudio, Video, Repeat, Repeat1 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { LyricsDisplay } from "@/components/lyrics-display";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Song } from "@shared/schema";

type LoopMode = 'off' | 'song' | 'library';

interface AudioPlayerProps {
  song: Song;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
  initialLoopMode?: LoopMode;
  onLoopModeChange?: (mode: LoopMode) => void;
}

export function AudioPlayer({ 
  song, 
  onNext, 
  onPrevious, 
  hasNext = false, 
  hasPrevious = false,
  initialLoopMode = 'off',
  onLoopModeChange
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showLyrics, setShowLyrics] = useState(true); // Show lyrics by default
  const [loopMode, setLoopMode] = useState<LoopMode>(initialLoopMode);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  // Update loop mode when Play All starts (initialLoopMode changes to 'library')
  // Don't overwrite user toggles when Play All ends (initialLoopMode changes to 'off')
  useEffect(() => {
    if (initialLoopMode === 'library') {
      setLoopMode('library');
    }
  }, [initialLoopMode]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      
      // Handle different loop modes
      if (loopMode === 'song') {
        // Loop current song
        if (audio) {
          audio.currentTime = 0;
          audio.play();
          setIsPlaying(true);
        }
      } else if (loopMode === 'library' && onNext) {
        // Auto-play next song in library (even if at end - will wrap around)
        onNext();
      }
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [loopMode, onNext, hasNext]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Auto-play when entering library loop mode (for "Play All")
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !song.audioUrl) return;

    // When loop mode changes to 'library', auto-start playback
    if (loopMode === 'library' && !isPlaying) {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error('Auto-play failed:', err);
        setIsPlaying(false);
      });
    }
  }, [loopMode]); // Trigger only when loop mode changes

  // Auto-play when song changes in library loop mode
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !song.audioUrl) return;

    // In library loop mode, auto-play the new song when it changes
    // Only check loopMode state so users can toggle loop mode during playback
    if (loopMode === 'library') {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error('Auto-play failed:', err);
        setIsPlaying(false);
      });
    }
  }, [song.id]); // Trigger only when song changes

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleLoop = () => {
    // Cycle through: off -> song -> library -> off
    let newMode: LoopMode;
    if (loopMode === 'off') {
      newMode = 'song';
      setLoopMode(newMode);
      onLoopModeChange?.(newMode);
      toast({
        title: "Loop: Song",
        description: "Current song will repeat",
      });
    } else if (loopMode === 'song') {
      newMode = 'library';
      setLoopMode(newMode);
      onLoopModeChange?.(newMode);
      toast({
        title: "Loop: Library",
        description: "All songs will play continuously",
      });
    } else {
      newMode = 'off';
      setLoopMode(newMode);
      onLoopModeChange?.(newMode);
      toast({
        title: "Loop: Off",
        description: "Songs will stop after playing",
      });
    }
  };

  const handleDownloadAudio = async () => {
    if (!song.audioUrl) {
      toast({
        title: "Download Failed",
        description: "Audio file not available for download.",
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: "Preparing Download",
        description: "Fetching audio file...",
      });

      // Fetch the audio file as a blob to handle cross-origin downloads
      const response = await fetch(song.audioUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch audio file');
      }
      
      const blob = await response.blob();
      
      // Create a temporary URL for the blob
      const blobUrl = URL.createObjectURL(blob);
      
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${song.title}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the blob URL after a short delay
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);

      toast({
        title: "Download Started",
        description: `Downloading "${song.title}" as audio...`,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "Could not download the song. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadVideo = async () => {
    if (!song.audioUrl || !song.lyrics) {
      toast({
        title: "Download Failed",
        description: "Song must have audio and lyrics to create a video.",
        variant: "destructive",
      });
      return;
    }

    // Check if MediaRecorder exists at all
    if (typeof MediaRecorder === 'undefined') {
      toast({
        title: "Video Not Supported",
        description: "Your browser doesn't support video recording. Please use Chrome, Edge, or Firefox.",
        variant: "destructive",
      });
      return;
    }

    // Check MediaRecorder support and select best codec
    const supportedMimeTypes = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm',
    ];

    const mimeType = supportedMimeTypes.find(type => 
      MediaRecorder.isTypeSupported(type)
    );

    if (!mimeType) {
      toast({
        title: "Video Not Supported",
        description: "Your browser doesn't support the required video codecs. Please use a newer browser.",
        variant: "destructive",
      });
      return;
    }

    let audioContext: AudioContext | null = null;
    let animationId: number | null = null;
    let audioBlobUrl: string | null = null;
    let recordingTimeout: NodeJS.Timeout | null = null;
    let isTimedOut = false;

    try {
      toast({
        title: "Creating Video",
        description: "Fetching audio file...",
      });

      // Fetch audio file
      const audioResponse = await fetch(song.audioUrl);
      if (!audioResponse.ok) {
        throw new Error('Failed to fetch audio file');
      }
      const audioBlob = await audioResponse.blob();
      audioBlobUrl = URL.createObjectURL(audioBlob);

      toast({
        title: "Creating Video",
        description: "Setting up recording...",
      });

      // Create audio element for duration (muted to prevent double playback)
      const audio = new Audio(audioBlobUrl);
      audio.muted = true;
      await new Promise((resolve, reject) => {
        audio.addEventListener('loadedmetadata', resolve, { once: true });
        audio.addEventListener('error', reject, { once: true });
      });
      const videoDuration = audio.duration;

      // Parse lyrics into lines
      const lyricsLines = song.lyrics.split('\n').filter(line => line.trim());
      const timePerLine = videoDuration / lyricsLines.length;

      // Create canvas for video rendering
      const canvas = document.createElement('canvas');
      canvas.width = 1280;
      canvas.height = 720;
      const ctx = canvas.getContext('2d')!;

      // Set up canvas stream
      const stream = canvas.captureStream(30); // 30 FPS
      audioContext = new AudioContext();
      const audioSource = audioContext.createMediaElementSource(audio);
      const audioDestination = audioContext.createMediaStreamDestination();
      audioSource.connect(audioDestination);
      
      // Don't connect to speakers to avoid double audio
      // audioSource.connect(audioContext.destination);

      // Add audio track to stream
      stream.addTrack(audioDestination.stream.getAudioTracks()[0]);

      // Set up MediaRecorder with detected codec
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 2500000,
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        // Don't download or show success if we timed out
        if (isTimedOut) {
          console.log('Recording stopped due to timeout - skipping download');
          if (audioBlobUrl) URL.revokeObjectURL(audioBlobUrl);
          return;
        }

        const videoBlob = new Blob(chunks, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(videoBlob);
        
        const link = document.createElement('a');
        link.href = videoUrl;
        link.download = `${song.title}.webm`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setTimeout(() => {
          URL.revokeObjectURL(videoUrl);
          if (audioBlobUrl) URL.revokeObjectURL(audioBlobUrl);
        }, 100);

        toast({
          title: "Download Complete",
          description: `"${song.title}" video downloaded successfully!`,
        });
      };

      toast({
        title: "Creating Video",
        description: "Recording video with lyrics...",
      });

      // Set timeout to prevent hanging forever (add 30 seconds buffer to song duration)
      recordingTimeout = setTimeout(() => {
        console.warn('Video recording timeout - forcing stop');
        isTimedOut = true;
        if (animationId) cancelAnimationFrame(animationId);
        if (mediaRecorder.state !== 'inactive') {
          mediaRecorder.stop();
        }
        if (audioContext) audioContext.close();
        audio.pause();
        
        toast({
          title: "Video Creation Timeout",
          description: "Video took too long to create. Please try a shorter song.",
          variant: "destructive",
        });
      }, (videoDuration + 30) * 1000);

      // Draw function for lyrics animation
      let currentLineIndex = 0;
      const drawFrame = () => {
        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(1, '#16213e');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Calculate current line based on audio time
        currentLineIndex = Math.min(
          Math.floor(audio.currentTime / timePerLine),
          lyricsLines.length - 1
        );

        // Draw song title at top
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(song.title, canvas.width / 2, 80);

        // Draw current lyric line (large, centered)
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 48px Playfair Display, serif';
        ctx.textAlign = 'center';
        const currentLine = lyricsLines[currentLineIndex] || '';
        ctx.fillText(currentLine, canvas.width / 2, canvas.height / 2);

        // Draw next line preview (smaller, below)
        if (currentLineIndex + 1 < lyricsLines.length) {
          ctx.fillStyle = '#ffffff80';
          ctx.font = '32px Inter, sans-serif';
          ctx.fillText(lyricsLines[currentLineIndex + 1], canvas.width / 2, canvas.height / 2 + 80);
        }

        // Draw genre badge at bottom
        ctx.fillStyle = '#ffffff60';
        ctx.font = '24px Inter, sans-serif';
        ctx.fillText(song.genre.toUpperCase(), canvas.width / 2, canvas.height - 60);

        // Draw progress bar at very bottom
        const progressWidth = (audio.currentTime / videoDuration) * (canvas.width - 40);
        ctx.fillStyle = '#ffffff40';
        ctx.fillRect(20, canvas.height - 20, canvas.width - 40, 4);
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(20, canvas.height - 20, progressWidth, 4);
      };

      // Start recording
      mediaRecorder.start();
      audio.muted = false; // Unmute for recording
      audio.play();

      // Draw frames using requestAnimationFrame for better performance
      const animate = () => {
        drawFrame();
        if (!audio.paused && !audio.ended) {
          animationId = requestAnimationFrame(animate);
        }
      };
      animationId = requestAnimationFrame(animate);

      // Stop recording when audio ends
      audio.addEventListener('ended', () => {
        console.log('Audio ended - stopping recording');
        if (recordingTimeout) clearTimeout(recordingTimeout);
        if (animationId) cancelAnimationFrame(animationId);
        if (mediaRecorder.state !== 'inactive') {
          mediaRecorder.stop();
        }
        if (audioContext) audioContext.close();
      }, { once: true });

    } catch (error) {
      console.error('Video download error:', error);
      
      // Clean up resources on error
      if (recordingTimeout) clearTimeout(recordingTimeout);
      if (animationId) cancelAnimationFrame(animationId);
      if (audioContext) audioContext.close();
      if (audioBlobUrl) URL.revokeObjectURL(audioBlobUrl);
      
      toast({
        title: "Video Creation Failed",
        description: error instanceof Error ? error.message : "Could not create video. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: song.title,
      text: `Check out my mantra song: ${song.title}`,
      url: window.location.href,
    };

    // Try Web Share API first (mobile/modern browsers)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast({
          title: "Shared Successfully",
          description: "Song shared!",
        });
      } catch (error) {
        // User cancelled or error occurred
        if ((error as Error).name !== 'AbortError') {
          toast({
            title: "Share Failed",
            description: "Could not share the song.",
            variant: "destructive",
          });
        }
      }
    } else {
      // Fallback: Copy link to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied",
          description: "Song link copied to clipboard!",
        });
      } catch (error) {
        toast({
          title: "Copy Failed",
          description: "Could not copy link to clipboard.",
          variant: "destructive",
        });
      }
    }
  };

  // Check if song is ready to play
  const isSongReady = song.status === 'completed' && song.audioUrl;
  const isGenerating = song.status === 'generating';
  const hasError = song.status === 'error';

  return (
    <div className="w-full space-y-4">
      {/* Song Info Card */}
      <Card data-testid="audio-player">
        <CardContent className="p-4 sm:p-6">
          {/* Song Info */}
          <div className="mb-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-2 mb-2">
              <div className="flex-1">
                <h3 className="font-bold text-base sm:text-lg mb-2" data-testid="text-song-title">{song.title}</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" data-testid="badge-genre">{song.genre}</Badge>
                  {isGenerating && (
                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400" data-testid="badge-generating">
                      Generating...
                    </Badge>
                  )}
                  {hasError && (
                    <Badge variant="destructive" data-testid="badge-error">
                      Generation Failed
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="gap-2 h-11 sm:h-9"
                      aria-label="Download song"
                      data-testid="button-download"
                      disabled={!isSongReady}
                    >
                      <Download className="h-4 w-4" />
                      <span className="hidden xs:inline">Download</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={handleDownloadAudio}
                      data-testid="menu-download-audio"
                      disabled={!isSongReady}
                    >
                      <FileAudio className="mr-2 h-4 w-4" />
                      Audio Only
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleDownloadVideo}
                      data-testid="menu-download-video"
                      disabled={!isSongReady || !song.lyrics}
                    >
                      <Video className="mr-2 h-4 w-4" />
                      Video with Lyrics
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="gap-2 h-11 sm:h-9"
                  aria-label="Share song"
                  data-testid="button-share"
                  disabled={!isSongReady}
                >
                  <Share2 className="h-4 w-4" />
                  <span className="hidden xs:inline">Share</span>
                </Button>
                {song.lyrics && (
                  <Button
                    variant="outline"
                    onClick={() => setShowLyrics(!showLyrics)}
                    className="gap-2 h-11 sm:h-9"
                    aria-label={showLyrics ? "Hide lyrics" : "Show lyrics"}
                    data-testid="button-toggle-lyrics"
                  >
                    {showLyrics ? (
                      <>
                        <X className="h-4 w-4" />
                        <span className="hidden xs:inline">Hide</span> Lyrics
                      </>
                    ) : (
                      <>
                        <Music2 className="h-4 w-4" />
                        <span className="hidden xs:inline">Show</span> Lyrics
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
            {!showLyrics && song.lyrics && (
              <p className="text-sm text-muted-foreground italic mt-3 line-clamp-2" data-testid="text-lyrics">
                {song.lyrics}
              </p>
            )}
          </div>

          {/* Hidden Audio Element */}
          {song.audioUrl && (
            <audio ref={audioRef} src={song.audioUrl} preload="metadata" />
          )}
        </CardContent>
      </Card>

      {/* Lyrics Display */}
      {showLyrics && song.lyrics && (
        <LyricsDisplay
          lyrics={song.lyrics}
          currentTime={currentTime}
          duration={duration}
          isPlaying={isPlaying}
        />
      )}

      {/* Sticky Player Controls */}
      <Card className="sticky bottom-2 sm:bottom-4 z-10" data-testid="player-controls">
        <CardContent className="p-3 sm:p-4">
          {/* Progress Bar */}
          <div className="space-y-2 mb-3 sm:mb-4">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              className="w-full touch-target"
              disabled={!isSongReady}
              data-testid="slider-progress"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span data-testid="text-current-time">{formatTime(currentTime)}</span>
              <span data-testid="text-duration">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls Layout: Stack volume on mobile, side-by-side on desktop */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-3 sm:gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={onPrevious}
                disabled={!hasPrevious}
                data-testid="button-previous"
                className="h-11 w-11 sm:h-9 sm:w-9"
              >
                <SkipBack className="h-5 w-5 sm:h-5 sm:w-5" />
              </Button>
              
              <Button
                size="icon"
                className="h-14 w-14 sm:h-12 sm:w-12"
                onClick={togglePlay}
                disabled={!isSongReady}
                data-testid="button-play-pause"
              >
                {isPlaying ? (
                  <Pause className="h-7 w-7 sm:h-6 sm:w-6" />
                ) : (
                  <Play className="h-7 w-7 sm:h-6 sm:w-6" />
                )}
              </Button>

              <Button
                size="icon"
                variant="ghost"
                onClick={onNext}
                disabled={!hasNext}
                data-testid="button-next"
                className="h-11 w-11 sm:h-9 sm:w-9"
              >
                <SkipForward className="h-5 w-5 sm:h-5 sm:w-5" />
              </Button>

              <Button
                size="icon"
                variant="ghost"
                onClick={toggleLoop}
                disabled={!isSongReady}
                data-testid="button-loop"
                className={`h-11 w-11 sm:h-9 sm:w-9 ${loopMode !== 'off' ? 'text-primary' : ''}`}
              >
                {loopMode === 'song' ? (
                  <Repeat1 className="h-5 w-5 sm:h-5 sm:w-5" />
                ) : (
                  <Repeat className="h-5 w-5 sm:h-5 sm:w-5" />
                )}
              </Button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2 justify-center sm:w-32">
              <Volume2 className="h-5 w-5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
              <Slider
                value={[volume * 100]}
                max={100}
                step={1}
                onValueChange={(value) => setVolume(value[0] / 100)}
                className="w-full max-w-[200px] sm:max-w-none touch-target"
                data-testid="slider-volume"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
