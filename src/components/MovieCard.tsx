import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import type { Movie } from "@/lib/tmdb";
import { slugify } from "@/lib/slugs";

interface MovieCardProps {
  movie: Movie;
  linkPrefix?: string;
}

const getRatingColor = (rating: number) => {
  if (rating >= 8) return "text-green-400 border-green-400";
  if (rating >= 6) return "text-yellow-400 border-yellow-400";
  return "text-red-400 border-red-400";
};

const MovieCard = ({ movie, linkPrefix = "/movie" }: MovieCardProps) => {
  const date = movie.release_date
    ? new Date(movie.release_date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";
  const ratingPercent = Math.round(movie.vote_average * 10);

  return (
    <Link
      to={`${linkPrefix}/${slugify(movie.title, movie.id)}`}
      className="group relative flex-shrink-0 w-[150px] sm:w-[170px] md:w-[200px]"
    >
      <div className="relative rounded-xl overflow-hidden bg-card transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-primary/10">
        <div className="aspect-[2/3] overflow-hidden">
          <img
            src={movie.poster_path || "/placeholder.svg"}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        </div>

        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="h-7 w-7 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center">
            <MoreHorizontal className="h-4 w-4 text-foreground" />
          </div>
        </div>

        <div className="absolute -bottom-4 left-3">
          <div
            className={`relative h-10 w-10 rounded-full bg-background border-2 ${getRatingColor(movie.vote_average)} flex items-center justify-center`}
          >
            <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeWidth="2"
                strokeDasharray={`${ratingPercent} ${100 - ratingPercent}`}
                className={getRatingColor(movie.vote_average).split(" ")[0]} strokeLinecap="round" opacity={0.3} />
              <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeWidth="2.5"
                strokeDasharray={`${ratingPercent} ${100 - ratingPercent}`}
                className={getRatingColor(movie.vote_average).split(" ")[0]} strokeLinecap="round" />
            </svg>
            <span className={`text-xs font-bold ${getRatingColor(movie.vote_average).split(" ")[0]}`}>
              {ratingPercent}<span className="text-[6px] align-super">%</span>
            </span>
          </div>
        </div>
      </div>

      <div className="pt-6 px-1 space-y-0.5">
        <h3 className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {movie.title}
        </h3>
        {date && <p className="text-xs text-muted-foreground">{date}</p>}
      </div>
    </Link>
  );
};

export default MovieCard;
