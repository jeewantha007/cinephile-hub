import { Link } from "react-router-dom";
import { Play, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Movie } from "@/data/mockMovies";

interface HeroSectionProps {
  movie: Movie;
}

const HeroSection = ({ movie }: HeroSectionProps) => {
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : "";

  return (
    <section className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0">
        <img
          src={movie.backdrop_path}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex flex-col justify-end pb-16 md:pb-20 max-w-3xl">
        <div className="animate-fade-in space-y-4">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
            {movie.title}
          </h1>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-primary fill-primary" />
              <span className="text-primary font-semibold">{movie.vote_average.toFixed(1)}</span>
            </div>
            {year && <span className="text-muted-foreground">{year}</span>}
            {movie.runtime && <span className="text-muted-foreground">{movie.runtime} min</span>}
          </div>

          <p className="text-sm md:text-base text-muted-foreground max-w-lg line-clamp-3">
            {movie.overview}
          </p>

          <div className="flex items-center gap-3 pt-2">
            <Link to={`/movie/${movie.id}`}>
              <Button className="gap-2">
                <Play className="h-4 w-4" />
                Watch Trailer
              </Button>
            </Link>
            <Link to={`/movie/${movie.id}`}>
              <Button variant="outline">More Info</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
