import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Music2, Sparkles, Heart, Headphones, Disc3, Music, Radio } from "lucide-react";
import { WaveformBars, VinylRecord, MusicNote, WaveformPattern } from "@/components/musical-elements";

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <WaveformPattern className="opacity-30" />
        <div className="container relative flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <VinylRecord size="sm" spinning className="text-primary" />
            <span className="font-bold text-xl font-serif">Mantra Music</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setLocation("/login")} data-testid="button-login">
              Log In
            </Button>
            <Button onClick={() => setLocation("/signup")} className="musical-glow" data-testid="button-signup">
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative py-20 md:py-32 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/10 to-background" />
          <WaveformPattern className="opacity-20" />
          
          {/* Floating musical notes decoration */}
          <MusicNote floating className="absolute top-20 left-10 h-8 w-8 hidden md:block" />
          <MusicNote floating className="absolute top-40 right-20 h-6 w-6 hidden lg:block" style={{ animationDelay: '0.5s' }} />
          <MusicNote floating className="absolute bottom-20 left-1/4 h-7 w-7 hidden md:block" style={{ animationDelay: '1s' }} />
          
          {/* Vinyl record decorations */}
          <div className="absolute top-10 right-10 hidden lg:block">
            <VinylRecord size="lg" spinning className="opacity-20" />
          </div>
          
          <div className="container relative max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <WaveformBars count={7} className="h-12" animated />
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-serif mb-6 bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent">
              Transform Your Mantras Into Music
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Turn your personal affirmations, goals, and daily mantras into custom AI-generated songs.
              Experience the power of your words through music.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" onClick={() => setLocation("/signup")} className="gap-2 musical-glow-strong" data-testid="button-get-started">
                <Sparkles className="h-5 w-5" />
                Get Started Free
              </Button>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Disc3 className="h-4 w-4 text-primary" />
                <span>6 musical genres • Instant generation</span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 px-4 bg-muted/50 relative overflow-hidden">
          <WaveformPattern className="opacity-10" />
          <div className="container relative max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-center mb-4">How It Works</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Three simple steps to transform your words into empowering music
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <Card data-testid="card-feature-1" className="relative overflow-hidden hover-elevate transition-all">
                <WaveformPattern className="opacity-5" />
                <CardContent className="relative p-6 text-center">
                  <div className="h-16 w-16 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 musical-glow">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xl mb-2 font-serif">Write Your Mantra</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Share your affirmations, goals, or daily mantras in your own authentic words
                  </p>
                  <div className="mt-4">
                    <WaveformBars count={5} className="justify-center" />
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-feature-2" className="relative overflow-hidden hover-elevate transition-all">
                <WaveformPattern className="opacity-5" />
                <CardContent className="relative p-6 text-center">
                  <div className="h-16 w-16 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 musical-glow">
                    <Disc3 className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xl mb-2 font-serif">Choose Your Vibe</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Select from soul, blues, hip-hop, reggae, pop, or acoustic genres with custom rhythms
                  </p>
                  <div className="mt-4">
                    <WaveformBars count={5} className="justify-center" />
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-feature-3" className="relative overflow-hidden hover-elevate transition-all">
                <WaveformPattern className="opacity-5" />
                <CardContent className="relative p-6 text-center">
                  <div className="h-16 w-16 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 musical-glow">
                    <Headphones className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xl mb-2 font-serif">Listen & Transform</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    AI generates a personalized song with vocals singing your transformative words
                  </p>
                  <div className="mt-4">
                    <WaveformBars count={5} className="justify-center" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="relative py-16 md:py-24 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-background to-background" />
          <WaveformPattern className="opacity-10" />
          <div className="container relative max-w-4xl mx-auto text-center">
            <VinylRecord size="lg" spinning className="mx-auto mb-6 opacity-60" />
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4">Ready to Begin Your Journey?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Create your first personalized mantra song in minutes. Join thousands transforming their words into music.
            </p>
            <Button size="lg" onClick={() => setLocation("/signup")} className="gap-2 musical-glow-strong" data-testid="button-start-journey">
              <Music2 className="h-5 w-5" />
              Start Creating Now
            </Button>
            <div className="mt-8">
              <WaveformBars count={9} className="justify-center h-16" animated />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 px-4 bg-muted/30">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Transform your words into uplifting, personalized music</p>
        </div>
      </footer>
    </div>
  );
}
