import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Star, Clock, Calendar, ArrowLeft, Play, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MovieRow from "@/components/MovieRow";
import SEOHead from "@/components/SEOHead";
import { getTVDetails, getSimilarTV } from "@/lib/tmdb";

const TVDetails = () => {
  const { id } = useParams<{ id: string }>();
  const showId = Number(id);

  const { data: show, isLoading } = useQuery({
    queryKey: ["tv-detail", showId],
    queryFn: () => getTVDetails(showId),
    enabled: !!showId,
  });

  const { data: similar = [] } = useQuery({
    queryKey: ["tv-similar", showId],
    queryFn: () => getSimilarTV(showId),
    enabled: !!showId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-16">
          <Skeleton className="w-full h-[60vh]" />
          <div className="container mx-auto px-4 py-8 space-y-4">
            <Skeleton className="h-10 w-96" />
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-24 w-full max-w-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <p className="text-muted-foreground">TV show not found.</p>
      </div>
    );
  }

  const year = show.release_date ? new Date(show.release_date).getFullYear() : "";
  const trailer = show.videos?.results.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${show.title}${year ? ` (${year})` : ""} – TV Show Info, Trailer & Cast | CinemaHub`}
        description={`Explore ${show.title} TV show details including trailer, cast, ratings, and overview on CinemaHub.`}
        canonicalPath={`/tv/${show.id}`}
        ogImage={show.backdrop_path || show.poster_path || undefined}
        ogType="video.tv_show"
      />
      <Navbar />

      {/* Backdrop */}
      <div className="relative w-full h-[50vh] md:h-[60vh]">
        <img
          src={show.backdrop_path || show.poster_path || "/placeholder.svg"}
          alt={show.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-48 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0 w-[200px] md:w-[250px]">
            <img
              src={show.poster_path || "/placeholder.svg"}
              alt={show.title}
              className="rounded-xl shadow-2xl w-full"
            />
          </div>

          <div className="flex-1 space-y-4">
            <Link to="/tv-shows" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to TV Shows
            </Link>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {show.title} {year && <span className="text-muted-foreground font-normal">({year})</span>}
            </h1>

            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1.5">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold text-foreground">{show.vote_average.toFixed(1)}</span>
              </div>
              {show.runtime ? (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{show.runtime} min</span>
                </div>
              ) : null}
              {show.release_date && (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{new Date(show.release_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
                </div>
              )}
            </div>

            {show.genres && (
              <div className="flex gap-2 flex-wrap">
                {show.genres.map((g) => (
                  <Badge key={g.id} variant="secondary">{g.name}</Badge>
                ))}
              </div>
            )}

            <p className="text-muted-foreground leading-relaxed max-w-2xl">{show.overview}</p>

            {trailer && (
              <a href={`https://www.youtube.com/watch?v=${trailer.key}`} target="_blank" rel="noopener noreferrer">
                <Button className="gap-2">
                  <Play className="h-4 w-4" /> Watch Trailer
                </Button>
              </a>
            )}
          </div>
        </div>

        {/* Cast */}
        {show.credits?.cast && show.credits.cast.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Cast</h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
              {show.credits.cast.map((member) => (
                <div key={member.id} className="flex-shrink-0 w-[120px] text-center space-y-2">
                  {member.profile_path ? (
                    <img src={member.profile_path} alt={member.name} className="w-20 h-20 rounded-full mx-auto object-cover" loading="lazy" />
                  ) : (
                    <div className="w-20 h-20 rounded-full mx-auto bg-muted flex items-center justify-center">
                      <User className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-foreground line-clamp-1">{member.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{member.character}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Similar */}
        {similar.length > 0 && (
          <div className="mt-12 pb-8">
            <MovieRow title="Similar TV Shows" movies={similar} />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default TVDetails;
