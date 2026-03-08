import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Star, Clock, Calendar, ArrowLeft, Play, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MovieRow from "@/components/MovieRow";
import { getMovieDetails, getSimilarMovies } from "@/lib/tmdb";

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = Number(id);

  const { data: movie, isLoading } = useQuery({
    queryKey: ["movie", movieId],
    queryFn: () => getMovieDetails(movieId),
    enabled: !!movieId,
  });

  const { data: similar = [] } = useQuery({
    queryKey: ["similar", movieId],
    queryFn: () => getSimilarMovies(movieId),
    enabled: !!movieId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 text-center">
          <p className="text-muted-foreground">Movie not found.</p>
          <Link to="/" className="text-primary hover:underline mt-2 inline-block">Go Home</Link>
        </div>
      </div>
    );
  }

  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : "";
  const trailer = movie.videos?.results.find((v) => v.type === "Trailer" && v.site === "YouTube");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Backdrop */}
      <div className="relative w-full h-[50vh] md:h-[60vh]">
        <img src={movie.backdrop_path} alt={movie.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
      </div>

      <main className="container mx-auto px-4 -mt-32 relative z-10 pb-8">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="shrink-0 w-full md:w-[300px]">
            <img
              src={movie.poster_path}
              alt={movie.title}
              className="w-full rounded-lg shadow-2xl"
            />
          </div>

          {/* Info */}
          <div className="flex-1 space-y-5">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">{movie.title}</h1>

            <div className="flex flex-wrap items-center gap-3 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-primary fill-primary" />
                <span className="text-primary font-semibold">{movie.vote_average.toFixed(1)}</span>
              </div>
              {year && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-4 w-4" /> {year}
                </div>
              )}
              {movie.runtime && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" /> {movie.runtime} min
                </div>
              )}
            </div>

            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((g) => (
                  <Badge key={g.id} variant="secondary">{g.name}</Badge>
                ))}
              </div>
            )}

            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">Overview</h2>
              <p className="text-muted-foreground leading-relaxed">{movie.overview}</p>
            </div>

            {/* Trailer */}
            {trailer && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Play className="h-4 w-4 text-primary" /> Trailer
                </h2>
                <div className="aspect-video rounded-lg overflow-hidden bg-card max-w-2xl">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailer.key}`}
                    title={trailer.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </div>
            )}

            {/* Cast */}
            {movie.credits?.cast && movie.credits.cast.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-3">Cast</h2>
                <div className="flex flex-wrap gap-3">
                  {movie.credits.cast.map((member) => (
                    <div key={member.id} className="flex items-center gap-2 bg-card rounded-lg px-3 py-2">
                      <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.character}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Similar movies */}
        {similar.length > 0 && (
          <div className="mt-12">
            <MovieRow title="Similar Movies" movies={similar} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MovieDetails;
