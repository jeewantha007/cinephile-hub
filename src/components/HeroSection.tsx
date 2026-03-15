import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Play, Info, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Movie } from "@/lib/tmdb";

interface HeroSectionProps {
  movie?: Movie;
  movies?: Movie[];
  linkPrefix?: string;
}

const HeroSection = ({ movie, movies, linkPrefix = "/movie" }: HeroSectionProps) => {
  const heroMovies = movies?.length ? movies.slice(0, 8) : movie ? [movie] : [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 300);
  }, [isTransitioning]);

  const goNext = useCallback(() => {
    goTo((currentIndex + 1) % heroMovies.length);
  }, [currentIndex, heroMovies.length, goTo]);

  const goPrev = useCallback(() => {
    goTo((currentIndex - 1 + heroMovies.length) % heroMovies.length);
  }, [currentIndex, heroMovies.length, goTo]);

  // Auto-rotate every 7 seconds
  useEffect(() => {
    if (heroMovies.length <= 1) return;
    const timer = setInterval(goNext, 7000);
    return () => clearInterval(timer);
  }, [goNext, heroMovies.length]);

  if (!heroMovies.length) return null;

  const current = heroMovies[currentIndex];
  const year = current.release_date ? new Date(current.release_date).getFullYear() : "";
  const detailUrl = `${linkPrefix}/${current.id}`;

  return (
    <section className="relative w-full h-[75vh] md:h-[85vh] overflow-hidden group">
      {/* Background image */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${isTransitioning ? "opacity-0" : "opacity-100"}`}>
        <img src={current.backdrop_path || "/placeholder.svg"} alt={current.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
      </div>

      {/* Content */}
      <div className={`relative h-full container mx-auto px-4 flex flex-col justify-end pb-20 md:pb-24 max-w-4xl transition-all duration-500 ${isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}>
        <div className="space-y-5">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-foreground tracking-tight">
            {current.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <div className="flex items-center gap-1.5 bg-primary/20 text-primary px-2.5 py-1 rounded-full">
              <Star className="h-3.5 w-3.5 fill-primary" />
              <span className="font-bold">{current.vote_average.toFixed(1)}</span>
            </div>
            {year && <span className="text-muted-foreground">{year}</span>}
            {current.runtime && <span className="text-muted-foreground">{current.runtime} min</span>}
            {current.genres?.map((g) => (
              <Badge key={g.id} variant="secondary" className="text-xs bg-muted/60 border-border/50">{g.name}</Badge>
            ))}
          </div>
          <p className="text-sm md:text-base text-muted-foreground max-w-xl line-clamp-3 leading-relaxed">
            {current.overview}
          </p>
          <div className="flex items-center gap-3 pt-1">
            <Link to={detailUrl}>
              <Button size="lg" className="gap-2 font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow">
                <Play className="h-4 w-4 fill-current" /> Watch Trailer
              </Button>
            </Link>
            <Link to={detailUrl}>
              <Button size="lg" variant="outline" className="gap-2 bg-foreground/10 border-foreground/20 hover:bg-foreground/20">
                <Info className="h-4 w-4" /> More Details
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      {heroMovies.length > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/30 backdrop-blur-sm text-foreground/80 hover:bg-background/50 hover:text-foreground flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
            aria-label="Previous movie"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={goNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/30 backdrop-blur-sm text-foreground/80 hover:bg-background/50 hover:text-foreground flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
            aria-label="Next movie"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {heroMovies.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex ? "w-8 bg-primary" : "w-1.5 bg-foreground/30 hover:bg-foreground/50"
                }`}
                aria-label={`Go to movie ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default HeroSection;
