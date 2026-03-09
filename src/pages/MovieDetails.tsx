import { useParams, Link } from "react-router-dom";
import { slugify } from "@/lib/slugs";
import { useQuery } from "@tanstack/react-query";
import { Star, Clock, Calendar, ArrowLeft, Play, User, Image, Tag, Library, ExternalLink, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MovieRow from "@/components/MovieRow";
import SEOHead from "@/components/SEOHead";
import { getMovieDetails, getSimilarMovies, imageUrl } from "@/lib/tmdb";
import WatchProviders from "@/components/WatchProviders";
import ReviewSection from "@/components/ReviewSection";
import SubtitlesSection from "@/components/SubtitlesSection";

import { extractIdFromSlug } from "@/lib/slugs";

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = extractIdFromSlug(id);

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
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-16">
          <Skeleton className="w-full h-[50vh]" />
          <div className="container mx-auto px-4 py-8 space-y-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-20 w-full max-w-xl" />
          </div>
        </div>
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

  const movieJsonLd = {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: movie.title,
    image: movie.poster_path || undefined,
    datePublished: movie.release_date || undefined,
    description: movie.overview,
    genre: movie.genres?.map((g) => g.name),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: movie.vote_average.toFixed(1),
      bestRating: "10",
      ratingCount: movie.vote_count || 1000,
    },
    actor: movie.credits?.cast?.slice(0, 10).map((c) => ({ "@type": "Person", name: c.name })),
    ...(trailer ? { trailer: { "@type": "VideoObject", name: `${movie.title} Trailer`, embedUrl: `https://www.youtube.com/embed/${trailer.key}` } } : {}),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://cinemahub.space/" },
      { "@type": "ListItem", position: 2, name: "Movies", item: "https://cinemahub.space/movies" },
      { "@type": "ListItem", position: 3, name: movie.title, item: `https://cinemahub.space/movie/${slugify(movie.title, movieId)}` },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${movie.title}${year ? ` (${year})` : ""} – Movie Info, Trailer & Cast | CinemaHub`}
        description={`Explore ${movie.title} movie details including trailer, cast, ratings, release date, and overview on CinemaHub.`}
        ogImage={movie.poster_path || undefined}
        ogType="video.movie"
        canonicalPath={`/movie/${slugify(movie.title, movieId)}`}
        jsonLd={[movieJsonLd, breadcrumbJsonLd]}
      />
      <Navbar />

      <div className="relative w-full h-[50vh] md:h-[60vh]">
        <img src={movie.backdrop_path || "/placeholder.svg"} alt={movie.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
      </div>

      <main className="container mx-auto px-4 -mt-32 relative z-10 pb-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back
        </Link>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="shrink-0 w-full md:w-[300px]">
            <img src={movie.poster_path || "/placeholder.svg"} alt={movie.title} className="w-full rounded-xl shadow-2xl shadow-primary/10" />
          </div>

          <div className="flex-1 space-y-5">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">{movie.title}</h1>

            {/* Rating Block */}
            <div className="flex flex-wrap items-stretch gap-3">
              <div className="bg-card rounded-xl px-4 py-3 ring-1 ring-border/30 space-y-1">
                <div className="flex items-center gap-1.5">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-xl font-bold text-foreground">{movie.vote_average.toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground">/ 10</span>
                </div>
                <p className="text-xs text-muted-foreground">TMDB Rating</p>
              </div>

              <div className="bg-card rounded-xl px-4 py-3 ring-1 ring-border/30 flex flex-col justify-center">
                <div className="flex items-center gap-1.5">
                  <ThumbsUp className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">{movie.vote_count.toLocaleString()}</span>
                </div>
                <p className="text-xs text-muted-foreground">Votes</p>
              </div>

              {movie.imdb_id && (
                <a
                  href={`https://www.imdb.com/title/${movie.imdb_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-card rounded-xl px-4 py-3 ring-1 ring-border/30 hover:ring-yellow-500/50 hover:bg-yellow-500/5 transition-all flex flex-col justify-center group"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-yellow-400">IMDb</span>
                    <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-yellow-400 transition-colors" />
                  </div>
                  <p className="text-xs text-muted-foreground group-hover:text-yellow-400/70 transition-colors">View on IMDb →</p>
                </a>
              )}

              {year && (
                <div className="bg-card rounded-xl px-4 py-3 ring-1 ring-border/30 flex flex-col justify-center">
                  <div className="flex items-center gap-1 text-foreground">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-semibold">{year}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Release Year</p>
                </div>
              )}

              {movie.runtime && (
                <div className="bg-card rounded-xl px-4 py-3 ring-1 ring-border/30 flex flex-col justify-center">
                  <div className="flex items-center gap-1 text-foreground">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-semibold">{movie.runtime} min</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Runtime</p>
                </div>
              )}
            </div>

            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((g) => (
                  <Badge key={g.id} variant="secondary" className="bg-muted/60 border-border/50">{g.name}</Badge>
                ))}
              </div>
            )}

            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">Overview</h2>
              <p className="text-muted-foreground leading-relaxed">{movie.overview}</p>
            </div>

            {/* Where to Watch */}
            {movie.watchProviders && <WatchProviders data={movie.watchProviders} />}

            {/* Collection */}
            {movie.belongs_to_collection && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Library className="h-4 w-4 text-primary" /> Part of Collection
                </h2>
                <Link
                  to={`/collection/${movie.belongs_to_collection.id}`}
                  className="inline-flex items-center gap-3 bg-card rounded-xl px-4 py-3 ring-1 ring-border/30 hover:ring-primary/50 transition-all"
                >
                  {movie.belongs_to_collection.poster_path && (
                    <img
                      src={movie.belongs_to_collection.poster_path}
                      alt={movie.belongs_to_collection.name}
                      className="h-16 w-11 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <p className="text-sm font-medium text-foreground">{movie.belongs_to_collection.name}</p>
                    <p className="text-xs text-primary">View full collection →</p>
                  </div>
                </Link>
              </div>
            )}

            {/* Keywords */}
            {movie.keywords && movie.keywords.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Tag className="h-4 w-4 text-primary" /> Keywords
                </h2>
                <div className="flex flex-wrap gap-2">
                  {movie.keywords.map((kw) => (
                    <Badge key={kw.id} variant="outline" className="text-xs bg-muted/30">
                      {kw.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {trailer && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Play className="h-4 w-4 text-primary fill-primary" /> Trailer
                </h2>
                <div className="aspect-video rounded-xl overflow-hidden bg-card max-w-2xl ring-1 ring-border/50">
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
                    <Link
                      key={member.id}
                      to={`/person/${slugify(member.name, member.id)}`}
                      className="flex items-center gap-3 bg-card rounded-xl px-4 py-3 ring-1 ring-border/30 hover:ring-primary/50 hover:bg-primary/5 transition-all group"
                    >
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                        {member.profile_path ? (
                          <img src={member.profile_path} alt={member.name} className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <User className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.character}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Images Gallery */}
        {movie.images && movie.images.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Image className="h-5 w-5 text-primary" /> Images
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {movie.images.map((img, idx) => (
                <a
                  key={idx}
                  href={imageUrl(img.file_path, "original")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl overflow-hidden bg-card ring-1 ring-border/30 hover:ring-primary/50 transition-all group"
                >
                  <img
                    src={imageUrl(img.file_path, "w780")}
                    alt={`${movie.title} image ${idx + 1}`}
                    className="w-full h-full object-cover aspect-video transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        {movie.reviews && movie.reviews.length > 0 && (
          <ReviewSection reviews={movie.reviews} />
        )}

        {similar.length > 0 && (
          <div className="mt-12">
            <MovieRow title="Recommended Movies" movies={similar} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MovieDetails;
