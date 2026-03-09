import { Link } from "react-router-dom";
import { Play, Info, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Movie } from "@/lib/tmdb";

interface HeroSectionProps {
  movie: Movie;
  linkPrefix?: string;
}

const HeroSection = ({ movie, linkPrefix = "/movie" }: HeroSectionProps) => {
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : "";
  const detailUrl = `${linkPrefix}/${movie.id}`;

  return (
    <section className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[85vh] overflow-hidden">
      <div className="absolute inset-0">
        <img src={movie.backdrop_path || "/placeholder.svg"} alt={movie.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
      </div>
      <div className="relative h-full container mx-auto px-4 flex flex-col justify-end pb-12 sm:pb-16 md:pb-20 lg:pb-24 max-w-4xl">
        <div className="space-y-3 sm:space-y-4 md:space-y-5">
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-bold text-foreground tracking-tight animate-fade-in-up leading-tight">
            {movie.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center gap-1 sm:gap-1.5 bg-primary/20 text-primary px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
              <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-primary" />
              <span className="font-bold">{movie.vote_average.toFixed(1)}</span>
            </div>
            {year && <span className="text-muted-foreground">{year}</span>}
            {movie.runtime && <span className="text-muted-foreground hidden sm:inline">{movie.runtime} min</span>}
            {movie.genres?.slice(0, 3).map((g) => (
              <Badge key={g.id} variant="secondary" className="text-[10px] sm:text-xs bg-muted/60 border-border/50 hidden sm:inline-flex">{g.name}</Badge>
            ))}
          </div>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-xl line-clamp-2 sm:line-clamp-3 leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            {movie.overview}
          </p>
          <div className="flex items-center gap-2 sm:gap-3 pt-1 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Link to={detailUrl}>
              <Button size="sm" className="gap-1.5 sm:gap-2 font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow text-xs sm:text-sm h-9 sm:h-10 md:h-11 px-3 sm:px-4 md:px-6">
                <Play className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-current" /> Watch Trailer
              </Button>
            </Link>
            <Link to={detailUrl}>
              <Button size="sm" variant="outline" className="gap-1.5 sm:gap-2 bg-foreground/10 border-foreground/20 hover:bg-foreground/20 text-xs sm:text-sm h-9 sm:h-10 md:h-11 px-3 sm:px-4 md:px-6">
                <Info className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Details
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
