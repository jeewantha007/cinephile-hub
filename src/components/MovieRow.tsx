import { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "./MovieCard";
import type { Movie } from "@/lib/tmdb";

interface MovieRowProps {
  title: string;
  movies: Movie[];
  viewAllHref?: string;
  linkPrefix?: string;
}

const MovieRow = ({ title, movies, viewAllHref, linkPrefix }: MovieRowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollWidth = scrollRef.current.clientWidth * 0.75;
      const amount = direction === "left" ? -scrollWidth : scrollWidth;
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  return (
    <section className="relative group/row">
      <div className="flex items-center justify-between mb-3 sm:mb-4 px-4 md:px-0">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">{title}</h2>
        {viewAllHref && (
          <Link
            to={viewAllHref}
            className="text-xs sm:text-sm text-primary hover:text-primary/80 font-medium transition-colors"
          >
            View All →
          </Link>
        )}
      </div>
      <div className="relative">
        <button onClick={() => scroll("left")}
          className="absolute left-0 top-0 bottom-12 z-10 w-8 sm:w-12 bg-gradient-to-r from-background via-background/80 to-transparent hidden sm:flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-300">
          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-card/80 border border-border/50 flex items-center justify-center hover:bg-muted transition-colors">
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
          </div>
        </button>
        <div ref={scrollRef} className="flex gap-2.5 sm:gap-3 md:gap-3 overflow-x-auto scrollbar-hide px-4 md:px-0 pb-2 snap-x snap-mandatory sm:snap-none">
          {movies.map((movie) => (
            <div key={movie.id} className="snap-start">
              <MovieCard movie={movie} linkPrefix={linkPrefix} />
            </div>
          ))}
        </div>
        <button onClick={() => scroll("right")}
          className="absolute right-0 top-0 bottom-12 z-10 w-8 sm:w-12 bg-gradient-to-l from-background via-background/80 to-transparent hidden sm:flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-300">
          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-card/80 border border-border/50 flex items-center justify-center hover:bg-muted transition-colors">
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
          </div>
        </button>
      </div>
    </section>
  );
};

export default MovieRow;
