import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Music, Pen, Headphones, Sparkles, Heart, Sun, Moon, LogOut, Menu, Disc3 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { WaveformBars, VinylRecord, MusicNote, WaveformPattern } from "@/components/musical-elements";
import heroImage from "@assets/generated_images/Hero_sunrise_meditation_scene_7b6760e5.png";

export default function Home() {
  const [, setLocation] = useLocation();
  
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setLocation("/");
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <WaveformPattern className="opacity-20" />
        <div className="container relative flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <VinylRecord size="sm" spinning className="text-primary" data-testid="icon-logo" />
            <span className="text-lg sm:text-xl font-bold font-serif" data-testid="text-logo">Mantra Music</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors" data-testid="link-how-it-works">
              How It Works
            </a>
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors" data-testid="link-features">
              Features
            </a>
            <a href="#playlists" className="text-sm font-medium hover:text-primary transition-colors" data-testid="link-playlists">
              Playlists
            </a>
          </nav>
          
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/create">
              <Button className="musical-glow gap-2" data-testid="button-get-started">
                <Sparkles className="h-4 w-4" />
                Get Started
              </Button>
            </Link>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleLogout}
                  data-testid="button-logout"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Sign Out</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="h-11 w-11" aria-label="Open menu" data-testid="button-mobile-menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px]">
              <nav className="flex flex-col gap-6 mt-8">
                <a href="#how-it-works" className="text-base font-medium hover:text-primary transition-colors" data-testid="link-mobile-how-it-works">
                  How It Works
                </a>
                <a href="#features" className="text-base font-medium hover:text-primary transition-colors" data-testid="link-mobile-features">
                  Features
                </a>
                <a href="#playlists" className="text-base font-medium hover:text-primary transition-colors" data-testid="link-mobile-playlists">
                  Playlists
                </a>
                <div className="border-t pt-6 space-y-4">
                  <Link href="/create" className="block">
                    <Button className="w-full" data-testid="button-mobile-get-started">Get Started</Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="w-full gap-2"
                    onClick={handleLogout}
                    data-testid="button-mobile-logout"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 backdrop-blur-sm" />
        <WaveformPattern className="opacity-10" />
        
        {/* Floating musical decorations */}
        <MusicNote floating className="absolute top-20 left-10 h-10 w-10 text-white/20 hidden lg:block" />
        <MusicNote floating className="absolute top-32 right-20 h-8 w-8 text-white/20 hidden lg:block" style={{ animationDelay: '0.5s' }} />
        <MusicNote floating className="absolute bottom-32 right-1/4 h-9 w-9 text-white/20 hidden xl:block" style={{ animationDelay: '1s' }} />
        
        <div className="relative z-10 container px-4 md:px-6 text-center text-white">
          <div className="flex justify-center mb-6">
            <WaveformBars count={7} className="h-16 opacity-60" animated />
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-serif mb-6 leading-tight" data-testid="text-hero-title">
            Turn Your Goals into Songs<br />that Move You
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-white/90 leading-relaxed" data-testid="text-hero-subtitle">
            Transform your affirmations and daily mantras into personalized music. 
            Start your morning, stay inspired during the day, and unwind at night with your own soundtrack for growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/create">
              <Button size="lg" className="bg-primary/90 backdrop-blur-md hover:bg-primary musical-glow-strong text-lg px-8 gap-2" data-testid="button-create-first-song">
                <Sparkles className="h-5 w-5" />
                Create Your First Mantra Song
              </Button>
            </Link>
            <Link href="/library">
              <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 text-lg px-8 gap-2" data-testid="button-browse-library">
                <Disc3 className="h-5 w-5" />
                Browse Library
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-white/70">
            <VinylRecord size="sm" className="opacity-50" />
            <p data-testid="text-user-count">
              Join thousands transforming their mindset through music
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative py-20 bg-muted/30 overflow-hidden">
        <WaveformPattern className="opacity-10" />
        <div className="container relative px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4" data-testid="text-how-it-works-title">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-how-it-works-subtitle">
              Three simple steps to transform your mantras into powerful musical affirmations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="relative overflow-hidden text-center hover-elevate transition-all" data-testid="card-step-1">
              <WaveformPattern className="opacity-5" />
              <CardContent className="relative pt-8 pb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 musical-glow">
                  <Pen className="h-8 w-8 text-primary" data-testid="icon-write" />
                </div>
                <h3 className="text-xl font-bold font-serif mb-3">Write Your Mantras</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Express your goals, affirmations, and aspirations in your own authentic words.
                </p>
                <div className="mt-6">
                  <WaveformBars count={5} className="justify-center" />
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden text-center hover-elevate transition-all" data-testid="card-step-2">
              <WaveformPattern className="opacity-5" />
              <CardContent className="relative pt-8 pb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 musical-glow">
                  <Disc3 className="h-8 w-8 text-primary" data-testid="icon-music" />
                </div>
                <h3 className="text-xl font-bold font-serif mb-3">Choose Your Vibe</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Select from soul, blues, hip-hop, reggae, pop, or acoustic to match your mood and energy.
                </p>
                <div className="mt-6">
                  <WaveformBars count={5} className="justify-center" />
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden text-center hover-elevate transition-all" data-testid="card-step-3">
              <WaveformPattern className="opacity-5" />
              <CardContent className="relative pt-8 pb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 musical-glow">
                  <Headphones className="h-8 w-8 text-primary" data-testid="icon-listen" />
                </div>
                <h3 className="text-xl font-bold font-serif mb-3">Listen & Transform</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Your personalized mantra song is created instantly. Listen, save, and replay whenever you need motivation.
                </p>
                <div className="mt-6">
                  <WaveformBars count={5} className="justify-center" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4" data-testid="text-features-title">
              Features That Empower
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-features-subtitle">
              Everything you need to create and organize your personal soundtrack for growth
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex gap-4" data-testid="feature-ai-lyrics">
              <div className="flex-shrink-0">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold mb-2">AI-Powered Lyrics</h3>
                <p className="text-sm text-muted-foreground">
                  Transform your written mantras into beautiful song lyrics that capture your intentions perfectly.
                </p>
              </div>
            </div>

            <div className="flex gap-4" data-testid="feature-genres">
              <div className="flex-shrink-0">
                <Music className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold mb-2">6+ Music Genres</h3>
                <p className="text-sm text-muted-foreground">
                  Choose from soul, blues, hip-hop, reggae, pop, or acoustic to match your energy and preference.
                </p>
              </div>
            </div>

            <div className="flex gap-4" data-testid="feature-playlists">
              <div className="flex-shrink-0">
                <Sun className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold mb-2">Curated Playlists</h3>
                <p className="text-sm text-muted-foreground">
                  Morning, daytime, and bedtime playlists designed to support your daily rhythm and goals.
                </p>
              </div>
            </div>

            <div className="flex gap-4" data-testid="feature-library">
              <div className="flex-shrink-0">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold mb-2">Personal Library</h3>
                <p className="text-sm text-muted-foreground">
                  Save and organize all your mantra songs in one place. Access them anytime you need inspiration.
                </p>
              </div>
            </div>

            <div className="flex gap-4" data-testid="feature-instant">
              <div className="flex-shrink-0">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold mb-2">Instant Generation</h3>
                <p className="text-sm text-muted-foreground">
                  Create your personalized songs in seconds. No waiting, no complexity—just pure motivation.
                </p>
              </div>
            </div>

            <div className="flex gap-4" data-testid="feature-replay">
              <div className="flex-shrink-0">
                <Headphones className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold mb-2">Replay Anytime</h3>
                <p className="text-sm text-muted-foreground">
                  Listen to your mantras as many times as you need. Repetition reinforces your positive mindset.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Playlists Preview */}
      <section id="playlists" className="py-20 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4" data-testid="text-playlists-title">
              Your Daily Soundtrack
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-playlists-subtitle">
              Three curated playlists to match your daily rhythm
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="overflow-hidden hover-elevate transition-all" data-testid="card-morning-playlist">
              <div className="aspect-square bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
                <Sun className="h-16 w-16 text-white" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Morning Motivation</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start your day with energizing mantras that set a positive tone
                </p>
                <Link href="/playlists/morning">
                  <Button variant="outline" className="w-full" data-testid="button-view-morning">
                    View Playlist
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover-elevate transition-all" data-testid="card-daytime-playlist">
              <div className="aspect-square bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center">
                <Sparkles className="h-16 w-16 text-white" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Daytime Energy</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Stay inspired and focused throughout your active hours
                </p>
                <Link href="/playlists/daytime">
                  <Button variant="outline" className="w-full" data-testid="button-view-daytime">
                    View Playlist
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover-elevate transition-all" data-testid="card-bedtime-playlist">
              <div className="aspect-square bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Moon className="h-16 w-16 text-white" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Bedtime Calm</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Wind down with peaceful mantras for reflection and rest
                </p>
                <Link href="/playlists/bedtime">
                  <Button variant="outline" className="w-full" data-testid="button-view-bedtime">
                    View Playlist
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <Card className="bg-primary text-primary-foreground overflow-hidden">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4" data-testid="text-cta-title">
                Ready to Transform Your Mindset?
              </h2>
              <p className="text-lg mb-8 text-primary-foreground/90 max-w-2xl mx-auto" data-testid="text-cta-subtitle">
                Start creating your personalized mantra songs today. Your journey to empowerment through music begins now.
              </p>
              <Link href="/create">
                <Button size="lg" variant="secondary" className="text-lg px-8" data-testid="button-start-now">
                  Start Creating Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container px-4 md:px-6 text-center text-sm text-muted-foreground">
          <p data-testid="text-footer">© 2025 Mantra Music. Transform your words into music that moves you.</p>
        </div>
      </footer>
    </div>
  );
}
