import { Link } from "react-router-dom";
import { Star, Play } from "lucide-react";
import type { Movie } from "@/data/mockMovies";

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : "";

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="group relative flex-shrink-0 w-[150px] sm:w-[170px] md:w-[200px] rounded-xl overflow-hidden bg-card transition-all duration-300 hover:scale-105 hover:z-10 hover:shadow-xl hover:shadow-primary/10"
    >
      {/* Poster */}
      <div className="aspect-[2/3] overflow-hidden relative">
        <img
          src={movie.poster_path}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
          <h3 className="text-sm font-semibold text-foreground line-clamp-2">{movie.title}</h3>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{movie.overview}</p>
          <div className="mt-2 flex items-center gap-1.5">
            <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center">
              <Play className="h-3.5 w-3.5 text-primary-foreground fill-current" />
            </div>
            <span className="text-xs text-muted-foreground">Watch trailer</span>
          </div>
        </div>
      </div>

      {/* Info below poster */}
      <div className="p-2.5 space-y-1">
        <h3 className="text-sm font-medium text-foreground line-clamp-1">{movie.title}</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 text-primary fill-primary" />
            <span className="text-xs text-primary font-bold">{movie.vote_average.toFixed(1)}</span>
          </div>
          {year && <span className="text-xs text-muted-foreground">{year}</span>}
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
