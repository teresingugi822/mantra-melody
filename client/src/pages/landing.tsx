import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Music2, Sparkles, Heart, Headphones } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Music2 className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Mantra Music</span>
          </div>
          <Button onClick={handleLogin} data-testid="button-login">
            Log In
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
          <div className="container relative max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Transform Your Mantras Into Music
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Turn your personal affirmations, goals, and daily mantras into custom AI-generated songs.
              Experience the power of your words through music.
            </p>
            <Button size="lg" onClick={handleLogin} className="gap-2" data-testid="button-get-started">
              <Sparkles className="h-5 w-5" />
              Get Started
            </Button>
          </div>
        </section>

        <section className="py-16 px-4 bg-muted/50">
          <div className="container max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card data-testid="card-feature-1">
                <CardContent className="p-6 text-center">
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Write Your Mantra</h3>
                  <p className="text-muted-foreground">
                    Share your affirmations, goals, or daily mantras in your own words
                  </p>
                </CardContent>
              </Card>

              <Card data-testid="card-feature-2">
                <CardContent className="p-6 text-center">
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Choose Your Style</h3>
                  <p className="text-muted-foreground">
                    Select from soul, blues, hip-hop, reggae, pop, or acoustic genres
                  </p>
                </CardContent>
              </Card>

              <Card data-testid="card-feature-3">
                <CardContent className="p-6 text-center">
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Headphones className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Listen & Transform</h3>
                  <p className="text-muted-foreground">
                    AI generates a personalized song with vocals singing your words
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Begin Your Journey?</h2>
            <p className="text-muted-foreground mb-8">
              Create your first personalized mantra song in minutes
            </p>
            <Button size="lg" onClick={handleLogin} className="gap-2" data-testid="button-start-journey">
              <Music2 className="h-5 w-5" />
              Start Creating
            </Button>
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
